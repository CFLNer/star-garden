const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const SOURCE = readFileSync(join(__dirname, "../../storage.js"), "utf8");
const A = "00000000-0000-4000-8000-000000000001";
const B = "00000000-0000-4000-8000-000000000002";
const session = (uid) => ({ user: { id: uid }, access_token: `token-${uid}` });
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function harness(overrides = {}) {
  const memory = new Map();
  const photos = new Map();
  const calls = { rpc: [], signOut: [], upload: [], download: [] };
  let sdkSession = session(A);
  let authCallback = () => {};
  let options;
  const emit = (next) => { sdkSession = next; authCallback(next ? "SIGNED_IN" : "SIGNED_OUT", next); };
  const h = { calls, emit, memory, photos, rpc: async () => ({ data: { status: "saved", garden: { revision: 2 } }, error: null }) };
  const auth = {
    getSession: async () => ({ data: { session: sdkSession }, error: null }),
    onAuthStateChange: (cb) => { authCallback = cb; return { data: { subscription: { unsubscribe() {} } } }; },
    signInWithPassword: async () => { emit(session(A)); return { data: { session: sdkSession }, error: null }; },
    signOut: async (config) => { calls.signOut.push(config); emit(null); return { error: null }; }
  };
  const client = {
    auth,
    rpc(name, payload) {
      const headers = {};
      return {
        setHeader(key, value) { headers[key] = value; return this; },
        then(resolve, reject) {
          calls.rpc.push({ name, payload, headers });
          return h.rpc(name, payload).then(resolve, reject);
        }
      };
    },
    storage: { from: () => ({
      upload: async (path, blob, config) => { calls.upload.push({ path, blob, config }); return { error: null }; },
      download: async (path) => {
        calls.download.push(path);
        return h.download ? h.download(path) : { data: new Blob(["photo"], { type: "image/png" }), error: null };
      },
      remove: async () => ({ error: null })
    }) }
  };
  const caches = {
    async open(key) {
      if (!photos.has(key)) photos.set(key, new Map());
      const cache = photos.get(key);
      return {
        match: async (path) => cache.get(path)?.clone(),
        put: async (path, response) => { cache.set(path, response.clone()); },
        delete: async (path) => cache.delete(path)
      };
    },
    delete: async (key) => photos.delete(key)
  };
  const localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: (key) => memory.delete(key)
  };
  const window = { location: { href: "https://garden.test/" }, caches,
    supabase: { createClient: (_url, _key, config) => { options = config; return client; } } };
  const context = { window, navigator: { onLine: true }, localStorage, caches,
    crypto: webcrypto, Blob, Response, URL, AbortController, fetch,
    setTimeout, clearTimeout, ...overrides };
  vm.runInNewContext(SOURCE, context);
  h.store = new window.GardenStore({ url: "https://project.test", publishableKey: "public-key" });
  h.newStore = (url) => new window.GardenStore({ url, publishableKey: "public-key" });
  h.auth = auth;
  h.context = context;
  h.options = options;
  return h;
}

test("offline startup identifies the cached account without waiting for an expired-token refresh", async () => {
  const h = harness();
  await h.store.getSession();
  h.context.navigator.onLine = false;
  h.auth.getSession = async () => { throw new Error("Offline startup must not refresh tokens"); };
  const restarted = h.newStore("https://project.test");
  assert.equal((await restarted.getSession()).user.id, A);
  assert.equal((await restarted.getSession()).access_token, undefined);
  await assert.rejects(restarted.commit(1, "operation", {}), { code: "OFFLINE" });
});

test("device sign-out survives reload even if SDK revocation has not completed", async () => {
  const h = harness();
  await h.store.getSession();
  const revocation = deferred();
  h.auth.signOut = async () => revocation.promise;
  const signingOut = h.store.signOut();
  const restarted = h.newStore("https://project.test");
  assert.equal(await restarted.getSession(), null);
  revocation.resolve({ error: null });
  await signingOut;
});

test("identity changing while getSession waits never issues a mutation for the new account", async () => {
  const h = harness();
  h.store.onAuthChange(() => {});
  await h.store.getSession();
  const waiting = deferred();
  h.auth.getSession = () => waiting.promise;
  const saving = h.store.commit(1, webcrypto.randomUUID(), {});
  h.emit(session(B));
  waiting.resolve({ data: { session: session(B) }, error: null });
  await assert.rejects(saving, { code: "SESSION_CHANGED" });
  assert.equal(h.calls.rpc.length, 0);
});

test("an issued RPC keeps its originating token and a late response cannot replace another session", async () => {
  const h = harness();
  h.store.onAuthChange(() => {});
  await h.store.getSession();
  const waiting = deferred();
  const started = deferred();
  h.rpc = () => { started.resolve(); return waiting.promise; };
  const saving = h.store.commit(1, webcrypto.randomUUID(), {});
  await started.promise;
  assert.equal(h.calls.rpc[0].headers.Authorization, `Bearer token-${A}`);
  h.emit(session(B));
  waiting.resolve({ data: { status: "saved", garden: { revision: 2 } }, error: null });
  await assert.rejects(saving, { code: "SESSION_CHANGED" });
  assert.equal(h.store.session.user.id, B);
});

test("sign-out cancels in-flight sign-in and clears the SDK session that finishes late", async () => {
  const h = harness();
  const notifications = [];
  h.store.onAuthChange((next) => notifications.push(next));
  const waiting = deferred();
  const started = deferred();
  h.auth.signInWithPassword = async () => {
    started.resolve();
    await waiting.promise;
    h.emit(session(A));
    return { data: { session: session(A) }, error: null };
  };
  const signingIn = h.store.signIn("parent@example.test", "password");
  const rejected = assert.rejects(signingIn, { code: "SESSION_CHANGED" });
  await started.promise;
  const signingOut = h.store.signOut();
  waiting.resolve();
  await rejected;
  await signingOut;
  await new Promise((resolve) => setTimeout(resolve, 1));
  assert.equal(await h.store.getSession(), null);
  assert.equal(h.calls.signOut[0].scope, "local");
  assert.equal(notifications.some((value) => value?.user?.id === A), false);
});

test("a new sign-in waits for local sign-out even while photo cleanup is pending", async () => {
  const h = harness();
  h.store.onAuthChange(() => {});
  await h.store.getSession();
  const cleanup = deferred();
  h.store.clearCache = () => cleanup.promise;
  const sequence = [];
  h.auth.signOut = async () => { sequence.push("out"); h.emit(null); return { error: null }; };
  h.auth.signInWithPassword = async () => {
    sequence.push("in"); h.emit(session(B));
    return { data: { session: session(B) }, error: null };
  };
  const signingOut = h.store.signOut();
  const signingIn = h.store.signIn("other@example.test", "password");
  cleanup.resolve();
  await signingOut;
  await signingIn;
  assert.deepEqual(sequence, ["out", "in"]);
  assert.equal(h.store.session.user.id, B);
});

test("project/account caches are isolated and an old receipt cannot clear a newer pending operation", async () => {
  const h = harness();
  const other = h.newStore("https://another-project.test");
  h.store.writeCache(A, { revision: 1 });
  h.store.writeCache(B, { revision: 3 });
  assert.equal(other.readCache(A), null);
  assert.equal(h.store.readCache(B).revision, 3);
  h.store.writePending(A, { operationId: "newer" });
  h.store.clearPending(A, "older");
  assert.equal(h.store.readPending(A).operationId, "newer");
  h.store.clearPending(A, "newer");
  assert.equal(h.store.readPending(A), null);
  await h.store.clearCache(A);
  assert.equal(h.store.readCache(A), null);
  assert.equal(h.store.readCache(B).revision, 3);
});

test("blocked storage prevents a write from losing its durable retry ID", () => {
  const h = harness({ localStorage: { setItem() { throw new Error("quota"); }, getItem() { return null; } } });
  assert.throws(() => h.store.writePending(A, { operationId: "save" }), { code: "CACHE_UNAVAILABLE" });
  assert.equal(h.store.writeCache(A, { revision: 1 }), false);
});

test("invalid/oversized photos never upload and valid photos get unique owner paths", async () => {
  const h = harness();
  await h.store.getSession();
  await assert.rejects(h.store.uploadPhoto(new Blob(["gif"], { type: "image/gif" })), { code: "INVALID_PHOTO" });
  await assert.rejects(h.store.uploadPhoto(new Blob([new Uint8Array(5242881)], { type: "image/png" })), { code: "INVALID_PHOTO" });
  assert.equal(h.calls.upload.length, 0);
  const first = await h.store.uploadPhoto(new Blob(["image"], { type: "image/png" }));
  const second = await h.store.uploadPhoto(new Blob(["image"], { type: "image/png" }));
  assert.ok(first.startsWith(`${A}/`) && first.endsWith(".png"));
  assert.notEqual(first, second);
  assert.equal(h.calls.upload[0].config.upsert, false);
});

test("cached photos display offline and another account cannot request them", async () => {
  const h = harness();
  await h.store.getSession();
  const path = `${A}/photo.png`;
  assert.equal(await (await h.store.getPhoto(path, A)).text(), "photo");
  h.context.navigator.onLine = false;
  assert.equal(await (await h.store.getPhoto(path, A)).text(), "photo");
  assert.equal(h.calls.download.length, 1);
  await assert.rejects(h.store.getPhoto(path, B), { code: "INVALID_PHOTO_PATH" });
  await assert.rejects(h.store.commit(1, webcrypto.randomUUID(), {}), { code: "OFFLINE" });
});

test("clearing the photo cache invalidates a download that is still in flight", async () => {
  const h = harness();
  await h.store.getSession();
  const waiting = deferred();
  const started = deferred();
  h.download = () => { started.resolve(); return waiting.promise; };
  const photo = h.store.getPhoto(`${A}/photo.png`, A);
  await started.promise;
  await h.store.clearCache(A);
  waiting.resolve({ data: new Blob(["late"], { type: "image/png" }), error: null });
  await assert.rejects(photo, { code: "SESSION_CHANGED" });
  assert.equal(h.photos.size, 0);
});

test("sign-out removes confirmed snapshot, pending operation, and cached photos", async () => {
  const h = harness();
  h.store.onAuthChange(() => {});
  await h.store.getSession();
  h.store.writeCache(A, { revision: 2 });
  h.store.writePending(A, { operationId: "uncertain" });
  await h.store.getPhoto(`${A}/photo.png`, A);
  await h.store.signOut();
  assert.equal(h.store.readCache(A), null);
  assert.equal(h.store.readPending(A), null);
  assert.equal(h.photos.size, 0);
  assert.equal(await h.store.getSession(), null);
});

test("network timeout aborts an otherwise hanging SDK request", async () => {
  const h = harness({
    setTimeout(callback, delay) {
      if (delay === 15000) { queueMicrotask(callback); return 1; }
      return setTimeout(callback, delay);
    },
    fetch: async (_input, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })), { once: true });
    })
  });
  await assert.rejects(h.options.global.fetch("https://project.test/rest/v1/gardens"), { name: "AbortError" });
});
