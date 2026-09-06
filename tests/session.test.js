const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function snapshot(revision = 1) {
  return { revision, document: { child: { currentStars: revision } } };
}

function fixture(overrides = {}) {
  const records = new Map();
  const cached = new Map();
  const locks = [];
  const navigator = {
    onLine: true,
    locks: { request: async (name, options, callback) => {
      locks.push(name);
      return callback({ name });
    } }
  };
  const window = new EventTarget();
  const document = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const store = {
    configured: true,
    getSession: async () => ({ user: { id: "family" } }),
    onAuthChange: () => () => {},
    load: async () => snapshot(),
    signIn: async () => ({ user: { id: "family" } }),
    signOut: async () => {},
    subscribe: () => () => {},
    readCache: (uid) => cached.get(uid) ?? null,
    writeCache: (uid, value) => cached.set(uid, value),
    clearCache: async (uid) => { cached.delete(uid); records.delete(uid); },
    readPending: (uid) => records.get(uid) ?? null,
    writePending: (uid, value) => records.set(uid, value),
    clearPending: (uid, operationId) => {
      if (!operationId || records.get(uid)?.operationId === operationId) records.delete(uid);
    },
    commit: async () => ({ status: "saved", garden: snapshot(2) }),
    ...overrides
  };
  const context = vm.createContext({
    window, document, navigator, EventTarget, CustomEvent, crypto: webcrypto,
    setInterval: () => 1
  });
  vm.runInContext(readFileSync("garden-session.js", "utf8"), context);
  const session = new window.GardenSession(store);
  session.user = { id: "family" };
  session.garden = snapshot();
  session.ready = true;
  return { session, store, records, cached, locks, navigator };
}

test("uncertain saves retain their operation and context until a confirmed retry", async () => {
  let calls = 0;
  const requests = [];
  const draft = { form: "customEvent", label: "Shared nicely" };
  const f = fixture({ commit: async (...args) => {
    requests.push(args);
    if (++calls === 1) throw new Error("Response lost");
    return { status: "duplicate", garden: snapshot(2) };
  } });
  assert.equal((await f.session.commit({ value: "new" }, 1, draft)).status, "error");
  assert.equal(f.session.garden.revision, 1);
  assert.equal(f.records.get("family").context, draft);
  assert.equal(f.session.canWrite, false);
  assert.equal((await f.session.retryPending()).status, "duplicate");
  assert.equal(requests[0][1], requests[1][1]);
  assert.equal(f.session.garden.revision, 2);
  assert.equal(f.session.lastResult.context, draft);
  assert.equal(f.records.has("family"), false);
  assert.deepEqual(f.locks, ["star-garden-save-family", "star-garden-save-family"]);
});

test("old operation completion never clears a newer tab's pending request", async () => {
  const newer = { operationId: "newer", expectedRevision: 2, document: {} };
  const f = fixture({ commit: async () => {
    f.records.set("family", newer);
    return { status: "duplicate", garden: snapshot(2) };
  } });
  f.session.pending = { operationId: "older", expectedRevision: 1, document: {} };
  f.records.set("family", f.session.pending);
  await f.session.retryPending();
  assert.equal(f.records.get("family"), newer);
  assert.equal(f.session.pending, newer);
  assert.equal(f.session.status, "checkingSave");
  assert.equal(f.session.canWrite, false);
});

test("reload-restored conflict reports its original form context", async () => {
  const context = { form: "profile", name: "New name" };
  const f = fixture({ commit: async () => ({ status: "conflict", garden: snapshot(3) }) });
  f.session.pending = { operationId: "restored", expectedRevision: 1, document: {}, context };
  f.records.set("family", f.session.pending);
  await f.session.retryPending();
  assert.equal(f.session.lastResult.context, context);
  assert.equal(f.session.conflict, true);
  assert.equal(f.session.pending, null);
  assert.equal(f.session.garden.revision, 3);
});

test("late sign-in completion cannot restore an account after sign-out", async () => {
  const login = deferred();
  const f = fixture({ signIn: () => login.promise });
  const signingIn = f.session.signIn("family@example.com", "password");
  await f.session.signOut();
  login.resolve({ user: { id: "family" } });
  await signingIn;
  assert.equal(f.session.user, null);
  assert.equal(f.session.garden, null);
  assert.equal(f.session.status, "accountSignedOut");
});

test("late reads after sign-out cannot restore cached data", async () => {
  const read = deferred();
  const f = fixture({ load: () => read.promise });
  const refreshing = f.session.refresh();
  await f.session.signOut();
  read.resolve(snapshot(8));
  await refreshing;
  assert.equal(f.session.garden, null);
  assert.equal(f.cached.has("family"), false);
});

test("a queued browser lock cannot send an old account's document after switching", async () => {
  let acquire;
  let writes = 0;
  const f = fixture({ commit: async () => { writes += 1; return {}; } });
  f.navigator.locks.request = (_name, _options, callback) => {
    return new Promise((resolve) => {
      acquire = () => Promise.resolve(callback({})).then(resolve);
    });
  };
  const saving = f.session.commit({ oldAccount: true });
  await f.session.setSession({ user: { id: "different-family" } });
  await acquire();
  assert.equal((await saving).status, "stale");
  assert.equal(writes, 0);
});

test("background refresh preserves the saving status while a write is pending", async () => {
  const write = deferred();
  const f = fixture({ commit: () => write.promise });
  const saving = f.session.commit({ value: "new" });
  await f.session.refresh();
  assert.equal(f.session.status, "saving");
  assert.equal(f.session.garden.revision, 1);
  write.resolve({ status: "saved", garden: snapshot(2) });
  await saving;
  assert.equal(f.session.status, "synced");
});

test("a read begun before initialization cannot erase its confirmed garden", async () => {
  const read = deferred();
  const f = fixture({
    load: () => read.promise,
    initialize: async () => ({ status: "initialized", garden: snapshot() })
  });
  f.session.garden = null;
  const refreshing = f.session.refresh();
  assert.equal(await f.session.initialize({ child: {} }), true);
  read.resolve(null);
  await refreshing;
  assert.equal(f.session.garden.revision, 1);
});

test("missing cloud garden clears the old cached snapshot and disables writes", async () => {
  const f = fixture({ load: async () => null });
  f.cached.set("family", snapshot());
  await f.session.refresh();
  assert.equal(f.session.garden, null);
  assert.equal(f.store.readCache("family"), null);
  assert.equal(f.session.canWrite, false);
});

test("failed initial auth lookup cannot replace the status of a newer session", async () => {
  const auth = deferred();
  const f = fixture({ getSession: () => auth.promise });
  f.session.user = null;
  const starting = f.session.start();
  await f.session.setSession({ user: { id: "different-family" } });
  auth.reject(new Error("Old auth error"));
  await starting;
  assert.equal(f.session.user.id, "different-family");
  assert.equal(f.session.status, "synced");
});

for (const code of ["22023", "23514", "42501"]) {
  test(`definitive database rejection ${code} clears only its pending request and retains context`, async () => {
    const context = { form: "profile", name: "Correctable draft" };
    const f = fixture({ commit: async () => { throw Object.assign(new Error("Rejected"), { code }); } });
    const result = await f.session.commit({ value: "invalid" }, 1, context);
    assert.equal(result.status, "rejected");
    assert.equal(f.session.lastResult.context, context);
    assert.equal(f.session.pending, null);
    assert.equal(f.records.has("family"), false);
    assert.equal(f.session.garden.revision, 1);
    assert.equal(f.session.status, "saveFailed");
    assert.equal(f.session.canWrite, code !== "42501");
    if (code !== "42501") {
      f.store.commit = async () => ({ status: "saved", garden: snapshot(2) });
      assert.equal((await f.session.commit({ value: "corrected" }, 1, context)).status, "saved");
    }
  });
}

test("a rejected stale retry preserves a newer tab's pending request", async () => {
  const newer = { operationId: "newer", expectedRevision: 2, document: {} };
  const f = fixture({ commit: async () => {
    f.records.set("family", newer);
    throw Object.assign(new Error("Rejected"), { code: "22023" });
  } });
  f.session.pending = { operationId: "older", expectedRevision: 1, document: {} };
  f.records.set("family", f.session.pending);
  await f.session.retryPending();
  assert.equal(f.records.get("family"), newer);
  assert.equal(f.session.pending, newer);
  assert.equal(f.session.canWrite, false);
});
