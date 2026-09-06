/* Account lifecycle and confirmed-only garden state. No UI or PIN state is persisted here. */
class GardenSession extends EventTarget {
  constructor(store) {
    super();
    this.store = store;
    this.user = null;
    this.garden = null;
    this.pending = null;
    this.conflict = false;
    this.ready = false;
    this.loading = false;
    this.busy = false;
    this.status = store.configured ? "accountSignedOut" : "notConfigured";
    this.epoch = 0;
    this.authAttempt = 0;
    this.refreshSequence = 0;
    this.unsubscribe = null;
    this.lastResult = null;
  }

  get canWrite() {
    return Boolean(this.user && this.garden && this.ready && navigator.onLine &&
      !this.busy && !this.pending && !this.conflict);
  }

  notify(reason = "status") {
    this.dispatchEvent(new CustomEvent("change", { detail: { reason } }));
  }

  async start() {
    if (!this.store.configured) {
      this.notify();
      return;
    }
    this.stopAuth = this.store.onAuthChange((session) => { void this.setSession(session); });
    const initialEpoch = this.epoch;
    const initialAuthAttempt = this.authAttempt;
    try {
      const session = await this.store.getSession();
      if (initialEpoch === this.epoch && initialAuthAttempt === this.authAttempt) await this.setSession(session);
    } catch (_) {
      if (initialEpoch === this.epoch && initialAuthAttempt === this.authAttempt) {
        this.status = "sessionExpired";
        this.notify();
      }
    }
    const refresh = () => { if (this.user) void this.refresh(); };
    window.addEventListener("online", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });
    window.addEventListener("offline", () => {
      this.ready = false;
      this.status = "offline";
      this.notify();
    });
    // Realtime is an invalidation hint. Polling also recovers missed messages.
    this.poll = setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine) refresh();
    }, 30000);
  }

  async setSession(session) {
    const nextUser = session?.user || null;
    if (nextUser?.id === this.user?.id) {
      this.user = nextUser;
      return;
    }
    const previousUser = this.user;
    const epoch = ++this.epoch;
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.user = nextUser;
    this.garden = null;
    this.pending = null;
    this.conflict = false;
    this.ready = false;
    this.busy = false;
    this.lastResult = null;
    this.loading = Boolean(nextUser);
    this.status = nextUser ? "loading" : "accountSignedOut";
    this.notify(previousUser ? "accountChanged" : "session");
    if (previousUser) await this.store.clearCache(previousUser.id);
    if (epoch !== this.epoch || !nextUser) return;
    this.garden = this.store.readCache(nextUser.id);
    this.pending = this.store.readPending(nextUser.id);
    this.notify("snapshot");
    this.unsubscribe = this.store.subscribe(nextUser.id, () => {
      if (epoch === this.epoch) void this.refresh();
    }, (status) => {
      if (epoch === this.epoch && status === "SUBSCRIBED") void this.refresh();
    });
    await this.refresh();
  }

  accept(garden) {
    if (garden && this.garden && garden.revision < this.garden.revision) return;
    this.garden = garden;
    this.store.writeCache(this.user.id, garden);
  }

  async refresh() {
    if (!this.user) return;
    if (!navigator.onLine) {
      this.ready = false;
      this.loading = false;
      this.status = "offline";
      this.notify();
      return;
    }
    const epoch = this.epoch;
    const sequence = ++this.refreshSequence;
    try {
      const garden = await this.store.load();
      if (epoch !== this.epoch || sequence !== this.refreshSequence) return;
      this.accept(garden);
      this.ready = true;
      if (!this.busy) {
        this.status = this.pending ? "checkingSave" : this.conflict ? "saveConflict" : "synced";
      }
    } catch (_) {
      if (epoch !== this.epoch || sequence !== this.refreshSequence) return;
      this.ready = false;
      if (!this.busy) this.status = "connectionLost";
    }
    this.loading = false;
    this.notify("snapshot");
  }

  async signIn(email, password) {
    const attempt = ++this.authAttempt;
    const session = await this.store.signIn(email, password);
    if (attempt !== this.authAttempt) return;
    await this.setSession(session);
  }

  async signOut() {
    this.authAttempt += 1;
    // Hide data immediately even if the network cannot revoke the session.
    // Start SDK invalidation before awaiting cache cleanup, so a new sign-in is
    // serialized after sign-out by the store rather than revoked by a late call.
    await Promise.all([this.setSession(null), this.store.signOut()]);
  }

  async initialize(document) {
    if (!this.user || !this.ready || !navigator.onLine || this.garden || this.busy) return false;
    const epoch = this.epoch;
    this.busy = true;
    this.status = "initializing";
    this.notify();
    try {
      const result = await this.store.initialize(document);
      if (epoch !== this.epoch) return false;
      // Reads issued before confirmation may still contain the old document
      // (or no document during initialization). They cannot supersede this save.
      this.refreshSequence += 1;
      this.accept(result.garden);
      this.ready = true;
      this.status = navigator.onLine ? "synced" : "offline";
      return true;
    } catch (_) {
      if (epoch === this.epoch) this.status = "initFailed";
      return false;
    } finally {
      if (epoch === this.epoch) {
        this.busy = false;
        this.notify("snapshot");
      }
    }
  }

  async commit(document, expectedRevision = this.garden?.revision, context = null) {
    if (!this.canWrite) return { status: "unavailable" };
    const epoch = this.epoch;
    const uid = this.user.id;
    // Web Locks coordinate tabs; the durable pending record survives page reloads.
    const perform = async () => {
      if (epoch !== this.epoch) return { status: "stale" };
      if (!this.canWrite) return { status: "unavailable" };
      const existing = this.store.readPending(this.user.id);
      if (existing) {
        this.pending = existing;
        this.status = "checkingSave";
        this.notify();
        return { status: "unavailable" };
      }
      if (expectedRevision !== this.garden.revision) {
        this.conflict = true;
        this.status = "saveConflict";
        this.lastResult = { status: "conflict", garden: this.garden, context };
        this.notify();
        return { status: "conflict", garden: this.garden };
      }
      const pending = { expectedRevision, operationId: crypto.randomUUID(), document, context };
      try {
        this.store.writePending(this.user.id, pending);
      } catch (_) {
        this.status = "saveFailed";
        this.notify();
        return { status: "error" };
      }
      this.pending = pending;
      return this.sendPending();
    };
    if (navigator.locks) {
      return navigator.locks.request(`star-garden-save-${uid}`, { ifAvailable: true },
        (lock) => lock ? perform() : { status: "unavailable" });
    }
    return perform();
  }

  async retryPending() {
    if (!this.pending || !this.user || !navigator.onLine || this.busy) return { status: "unavailable" };
    const epoch = this.epoch;
    const uid = this.user.id;
    const operationId = this.pending.operationId;
    const perform = () => {
      if (epoch !== this.epoch) return { status: "stale" };
      if (this.busy || !navigator.onLine || this.pending?.operationId !== operationId) {
        return { status: "unavailable" };
      }
      return this.sendPending();
    };
    if (navigator.locks) {
      return navigator.locks.request(`star-garden-save-${uid}`, { ifAvailable: true },
        (lock) => lock ? perform() : { status: "unavailable" });
    }
    return perform();
  }

  async sendPending() {
    const epoch = this.epoch;
    const pending = this.pending;
    this.busy = true;
    this.status = "saving";
    this.notify();
    try {
      const result = await this.store.commit(pending.expectedRevision, pending.operationId, pending.document);
      if (epoch !== this.epoch) return { status: "stale" };
      this.refreshSequence += 1;
      this.accept(result.garden);
      // A different tab may already have resolved this operation and started
      // another. Completing the old retry must never delete the newer request.
      if (this.store.readPending(this.user.id)?.operationId === pending.operationId) {
        this.store.clearPending(this.user.id, pending.operationId);
      }
      this.pending = this.store.readPending(this.user.id);
      this.conflict = result.status === "conflict";
      this.status = this.pending ? "checkingSave" : this.conflict ? "saveConflict" : navigator.onLine ? "synced" : "offline";
      this.ready = true;
      this.lastResult = { ...result, operationId: pending.operationId, context: pending.context ?? null };
      return result;
    } catch (error) {
      if (epoch !== this.epoch) return { status: "stale" };
      if (["22023", "23514", "42501"].includes(error.code)) {
        // These database errors reject the transaction definitively. The form
        // may be corrected and resubmitted without replaying a failed payload.
        if (this.store.readPending(this.user.id)?.operationId === pending.operationId) {
          this.store.clearPending(this.user.id, pending.operationId);
        }
        this.pending = this.store.readPending(this.user.id);
        this.conflict = false;
        this.ready = error.code !== "42501";
        this.status = this.pending ? "checkingSave" : "saveFailed";
        this.lastResult = {
          status: "rejected", code: error.code,
          operationId: pending.operationId, context: pending.context ?? null
        };
        return this.lastResult;
      }
      // Do not invent a new request ID: the server may have committed this save.
      this.ready = false;
      this.status = navigator.onLine ? "checkingSave" : "offline";
      return { status: "error" };
    } finally {
      if (epoch === this.epoch) {
        this.busy = false;
        this.notify("snapshot");
      }
    }
  }

  reviewConflict() {
    this.conflict = false;
    this.status = navigator.onLine ? "synced" : "offline";
    this.notify();
  }
}

window.GardenSession = GardenSession;
