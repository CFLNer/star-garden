/* Account-owned persistence. Only confirmed snapshots belong in the garden cache. */
(function () {
  "use strict";

  const BUCKET = "avatars";
  const PHOTO_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

  function failure(message, code) {
    return Object.assign(new Error(message), { code });
  }

  async function timedFetch(input, options = {}) {
    const controller = new AbortController();
    const upstream = options.signal;
    const abort = () => controller.abort(upstream.reason);
    if (upstream?.aborted) abort();
    else upstream?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 15000);
    try { return await fetch(input, { ...options, signal: controller.signal }); }
    finally {
      clearTimeout(timeout);
      upstream?.removeEventListener("abort", abort);
    }
  }

  class GardenStore {
    constructor({ url = "", publishableKey = "" } = {}) {
      this.configured = Boolean(url && publishableKey && window.supabase?.createClient);
      this.namespace = `star-garden-cloud-v1:${encodeURIComponent(url.replace(/\/$/, ""))}:`;
      this.session = null;
      this.sessionKnown = false;
      this.epoch = 0;
      this.authGeneration = 0;
      this.authQueue = Promise.resolve();
      this.acceptAuth = true;
      try { this.acceptAuth = localStorage.getItem(`${this.namespace}signed-out`) !== "true"; } catch { /* Session-only storage. */ }
      this.activeSignIn = null;
      this.photoEpochs = new Map();
      if (this.configured) {
        try {
          this.client = window.supabase.createClient(url, publishableKey, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
            global: { fetch: timedFetch }
          });
        } catch {
          this.configured = false;
        }
      }
    }

    _client() {
      if (!this.configured) throw failure("Supabase is not configured.", "NOT_CONFIGURED");
      return this.client;
    }

    _setSession(session, initializing = false) {
      if (!initializing && this.session?.user?.id !== session?.user?.id) this.epoch += 1;
      this.sessionKnown = true;
      this.session = session;
      // Identify the read-only cache without refreshing expired tokens offline.
      // This record contains no credential and never authorizes cloud writes.
      try {
        if (session?.user?.id) {
          localStorage.setItem(`${this.namespace}last-user`, JSON.stringify({ id: session.user.id, email: session.user.email }));
        } else localStorage.removeItem(`${this.namespace}last-user`);
      } catch { /* The application also works without a persistent cache. */ }
    }

    async getSession() {
      if (!this.configured || !this.acceptAuth) return null;
      if (navigator.onLine === false) {
        if (this.session) return this.session;
        try {
          const user = JSON.parse(localStorage.getItem(`${this.namespace}last-user`) || "null");
          if (user?.id) this._setSession({ user }, !this.sessionKnown);
        } catch { /* No usable offline identity. */ }
        return this.session;
      }
      const epoch = this.epoch;
      const { data, error } = await this.client.auth.getSession();
      if (error) throw error;
      if (this.epoch !== epoch || !this.acceptAuth) return this.session;
      if (this.activeSignIn !== null && this.activeSignIn !== this.authGeneration) return null;
      this._setSession(data.session, !this.sessionKnown);
      return this.session;
    }

    onAuthChange(callback) {
      if (!this.configured) return () => {};
      let active = true;
      const { data } = this.client.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION" && !session && navigator.onLine === false) return;
        if (session && (!this.acceptAuth ||
            (this.activeSignIn !== null && this.activeSignIn !== this.authGeneration))) return;
        this._setSession(session);
        const epoch = this.epoch;
        // Awaiting another auth method inside the SDK callback can deadlock its lock.
        setTimeout(() => {
          if (active && epoch === this.epoch) callback(session);
        }, 0);
      });
      return () => {
        active = false;
        data.subscription.unsubscribe();
      };
    }

    async signIn(email, password) {
      this._online();
      const generation = ++this.authGeneration;
      const attempt = this.authQueue.then(async () => {
        if (generation !== this.authGeneration) throw failure("Sign-in was canceled.", "SESSION_CHANGED");
        this.activeSignIn = generation;
        try {
          const { data, error } = await this._client().auth.signInWithPassword({ email, password });
          if (generation !== this.authGeneration) throw failure("Sign-in was canceled.", "SESSION_CHANGED");
          if (error) throw error;
          this.acceptAuth = true;
          try { localStorage.removeItem(`${this.namespace}signed-out`); } catch { /* In-memory login still works. */ }
          this._setSession(data.session);
          return data.session;
        } finally { this.activeSignIn = null; }
      });
      this.authQueue = attempt.catch(() => {});
      return attempt;
    }

    async signOut() {
      const uid = this.session?.user?.id;
      // Invalidate pending photo downloads before auth makes any network requests.
      this.authGeneration += 1;
      this.acceptAuth = false;
      // A reload must remain signed out even if offline SDK revocation is pending.
      try { localStorage.setItem(`${this.namespace}signed-out`, "true"); } catch { /* SDK also clears its session. */ }
      this.epoch += 1;
      this._setSession(null);
      const cacheCleanup = uid ? this.clearCache(uid) : Promise.resolve();
      const attempt = this.authQueue.then(async () => {
        await cacheCleanup;
        const { error } = await this._client().auth.signOut({ scope: "local" });
        if (error) throw error;
      });
      this.authQueue = attempt.catch(() => {});
      return attempt;
    }

    _online() {
      if (navigator.onLine === false) throw failure("Garden changes need a connection.", "OFFLINE");
    }

    async _identity() {
      const epoch = this.epoch;
      const session = await this.getSession();
      if (epoch !== this.epoch) throw failure("The account changed before this request started.", "SESSION_CHANGED");
      if (!session?.user?.id) throw failure("Sign in to use the garden.", "AUTH_REQUIRED");
      return { uid: session.user.id, accessToken: session.access_token, epoch: this.epoch };
    }

    _stillCurrent(identity) {
      if (identity.epoch !== this.epoch || identity.uid !== this.session?.user?.id) {
        throw failure("The account changed before this request finished.", "SESSION_CHANGED");
      }
    }

    async load() {
      const identity = await this._identity();
      this._stillCurrent(identity);
      const { data, error } = await this._client().from("gardens")
        .select("document,revision,schema_version,updated_at")
        .eq("user_id", identity.uid).maybeSingle()
        .setHeader("Authorization", `Bearer ${identity.accessToken}`);
      this._stillCurrent(identity);
      if (error) throw error;
      return data;
    }

    async initialize(document) {
      this._online();
      const identity = await this._identity();
      this._stillCurrent(identity);
      const { data, error } = await this._client().rpc("initialize_garden", { p_document: document })
        .setHeader("Authorization", `Bearer ${identity.accessToken}`);
      this._stillCurrent(identity);
      if (error) throw error;
      return data;
    }

    async commit(expectedRevision, operationId, document) {
      this._online();
      const identity = await this._identity();
      this._stillCurrent(identity);
      const { data, error } = await this._client().rpc("commit_garden", {
        p_expected_revision: expectedRevision,
        p_operation_id: operationId,
        p_document: document
      }).setHeader("Authorization", `Bearer ${identity.accessToken}`);
      this._stillCurrent(identity);
      if (error) throw error;
      return data;
    }

    subscribe(uid, onChange, onStatus = () => {}) {
      if (!this.configured) return () => {};
      let active = true;
      const epoch = this.epoch;
      const current = () => active && epoch === this.epoch && uid === this.session?.user?.id;
      const channel = this.client.channel(`garden:${uid}:${crypto.randomUUID()}`)
        .on("postgres_changes", {
          event: "*", schema: "public", table: "gardens", filter: `user_id=eq.${uid}`
        }, () => { if (current()) onChange(); })
        .subscribe((status) => { if (current()) onStatus(status); });
      return () => {
        active = false;
        void this.client.removeChannel(channel);
      };
    }

    _key(uid, kind) { return `${this.namespace}${uid}:${kind}`; }

    _read(uid, kind) {
      try { return JSON.parse(localStorage.getItem(this._key(uid, kind)) || "null"); }
      catch { return null; }
    }

    readCache(uid) { return this._read(uid, "snapshot"); }

    writeCache(uid, garden) {
      try {
        localStorage.setItem(this._key(uid, "snapshot"), JSON.stringify(garden));
        return true;
      } catch { return false; }
    }

    readPending(uid) { return this._read(uid, "pending"); }

    writePending(uid, payload) {
      try { localStorage.setItem(this._key(uid, "pending"), JSON.stringify(payload)); }
      catch { throw failure("This browser cannot preserve a pending save. Enable local storage and retry.", "CACHE_UNAVAILABLE"); }
    }

    clearPending(uid, operationId) {
      if (operationId && this.readPending(uid)?.operationId !== operationId) return;
      try { localStorage.removeItem(this._key(uid, "pending")); } catch { /* Storage may be blocked. */ }
    }

    async clearCache(uid) {
      this.photoEpochs.set(uid, (this.photoEpochs.get(uid) || 0) + 1);
      try {
        const user = JSON.parse(localStorage.getItem(`${this.namespace}last-user`) || "null");
        if (user?.id === uid) localStorage.removeItem(`${this.namespace}last-user`);
      } catch { /* Storage may be blocked. */ }
      try { localStorage.removeItem(this._key(uid, "snapshot")); } catch { /* Storage may be blocked. */ }
      this.clearPending(uid);
      try { if (window.caches) await caches.delete(this._key(uid, "photos")); } catch { /* Best-effort cache cleanup. */ }
    }

    _photoPath(path, uid) {
      if (typeof path !== "string" || !path.startsWith(`${uid}/`) ||
          path.split("/").length !== 2 || !/^[a-zA-Z0-9._-]+$/.test(path.split("/")[1]) ||
          path.includes("..")) {
        throw failure("Photo does not belong to this account.", "INVALID_PHOTO_PATH");
      }
      return path;
    }

    async uploadPhoto(blob) {
      this._online();
      if (!PHOTO_TYPES[blob?.type] || blob.size > 5 * 1024 * 1024 || !blob.size) {
        throw failure("Choose a JPEG, PNG, or WebP photo up to 5 MB.", "INVALID_PHOTO");
      }
      const identity = await this._identity();
      this._stillCurrent(identity);
      const path = `${identity.uid}/${crypto.randomUUID()}.${PHOTO_TYPES[blob.type]}`;
      const { error } = await this._client().storage.from(BUCKET).upload(path, blob, {
        contentType: blob.type, upsert: false, cacheControl: "31536000"
      });
      this._stillCurrent(identity);
      if (error) throw error;
      return path;
    }

    async getPhoto(path, uid) {
      const identity = await this._identity();
      this._stillCurrent(identity);
      if (uid !== identity.uid) throw failure("Photo does not belong to this account.", "INVALID_PHOTO_PATH");
      this._photoPath(path, uid);
      const photoEpoch = this.photoEpochs.get(uid) || 0;
      const cacheKey = new URL(`__garden_photo__/${encodeURIComponent(path)}`, window.location.href).href;
      let cache = null;
      try {
        if (window.caches) {
          cache = await caches.open(this._key(uid, "photos"));
          const saved = await cache.match(cacheKey);
          this._stillCurrent(identity);
          if (photoEpoch !== (this.photoEpochs.get(uid) || 0)) {
            throw failure("The photo cache was cleared during loading.", "SESSION_CHANGED");
          }
          if (saved) {
            const blob = await saved.blob();
            this._stillCurrent(identity);
            return blob;
          }
        }
      } catch (error) {
        if (error.code === "SESSION_CHANGED") throw error;
      }
      this._stillCurrent(identity);
      // Private bytes are cached explicitly above, where sign-out can remove them.
      const { data, error } = await this._client().storage.from(BUCKET).download(path, {}, { cache: "no-store" });
      this._stillCurrent(identity);
      if (error) throw error;
      if (photoEpoch !== (this.photoEpochs.get(uid) || 0)) {
        throw failure("The photo cache was cleared during download.", "SESSION_CHANGED");
      }
      try { if (cache) await cache.put(cacheKey, new Response(data, { headers: { "Content-Type": data.type } })); }
      catch { /* Display works even when this browser cannot cache photos. */ }
      this._stillCurrent(identity);
      return data;
    }

    async removePhoto(path) {
      this._online();
      const identity = await this._identity();
      this._stillCurrent(identity);
      this._photoPath(path, identity.uid);
      const { error } = await this._client().storage.from(BUCKET).remove([path]);
      this._stillCurrent(identity);
      if (error) throw error;
      try {
        if (window.caches) {
          const cache = await caches.open(this._key(identity.uid, "photos"));
          const key = new URL(`__garden_photo__/${encodeURIComponent(path)}`, window.location.href).href;
          await cache.delete(key);
        }
      } catch { /* Best-effort cache cleanup. */ }
    }
  }

  window.GardenStore = GardenStore;
})();
