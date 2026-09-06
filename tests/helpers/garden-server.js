const { expect } = require('@playwright/test');

const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
const USER = { id: '11111111-1111-4111-8111-111111111111', email: 'coflier320@gmail.com' };

function sampleDocument() {
  return {
    child: { id: 'child-1', name: 'Little Star', avatar: '🦁', currentStars: 10, activeRewardId: 'reward-sleep' },
    rewards: [{ id: 'reward-sleep', label: 'Parents accompany to sleep', cost: 5, icon: '🌙', active: true, redeemedAt: null }],
    activityPresets: [{ id: 'meal', label: 'Eat a meal well', defaultStarChange: 2, icon: '🍽️', category: 'earning', visibleToKid: true }],
    events: [{ id: 'event-start', timestamp: new Date().toISOString(), label: 'Starting stars', starChange: 10, category: 'adjustment', note: 'A private parent note', visibleToKid: false }]
  };
}

// This transport double models the database CAS/operation ledger. Browser tests run
// the real application/session code; separate database tests prove the SQL semantics.
class GardenServer {
  constructor(document = sampleDocument()) {
    this.garden = document ? { document, revision: 1, schema_version: 1, updated_at: new Date().toISOString() } : null;
    this.operations = new Map();
    this.pages = new Set();
    this.commits = 0;
    this.commitAttempts = [];
    this.photos = new Map();
    this.failCommit = false;
    this.loseCommitResponse = false;
    this.failUpload = false;
  }

  synchronizeNextCommits(count) {
    const barrier = { count, arrived: 0 };
    barrier.promise = new Promise(resolve => { barrier.release = resolve; });
    this.commitBarrier = barrier;
  }

  async notify(except) {
    await Promise.all([...this.pages].filter((page) => page !== except && !page.isClosed()).map((page) =>
      page.evaluate(() => window.__gardenChanged?.()).catch(() => {})));
  }

  async connect(context, { signedIn = true, legacy = null } = {}) {
    await context.addInitScript(({ signedIn, legacy, user }) => {
      if (!location.href.startsWith('http://127.0.0.1:8000')) return;
      if (!localStorage.getItem('test-seeded')) {
        localStorage.setItem('test-seeded', 'true');
        if (signedIn) localStorage.setItem('test-session', JSON.stringify({ user }));
        if (legacy) localStorage.setItem('star-garden-v1', JSON.stringify(legacy));
      }
    }, { signedIn, legacy, user: USER });
    await context.exposeBinding('__gardenRpc', async ({ page }, method, args) => {
      this.pages.add(page);
      if (method === 'load') return clone(this.garden);
      if (method === 'initialize') {
        if (this.garden) return { status: 'exists', garden: clone(this.garden) };
        this.garden = { document: clone(args[0]), revision: 1, schema_version: 1, updated_at: new Date().toISOString() };
        await this.notify(page);
        return { status: 'initialized', garden: clone(this.garden) };
      }
      if (method === 'commit') {
        const [revision, operationId, document] = args;
        if (this.commitBarrier) {
          const barrier = this.commitBarrier;
          barrier.arrived += 1;
          if (barrier.arrived === barrier.count) { this.commitBarrier = null; barrier.release(); }
          await barrier.promise;
        }
        this.commitAttempts.push({ revision, operationId, document: clone(document) });
        if (this.failCommit) throw new Error('Save failed');
        if (this.operations.has(operationId)) return { status: 'duplicate', garden: clone(this.garden) };
        if (this.garden.revision !== revision) return { status: 'conflict', garden: clone(this.garden) };
        this.garden = { ...this.garden, document: clone(document), revision: revision + 1, updated_at: new Date().toISOString() };
        this.operations.set(operationId, clone(this.garden));
        this.commits += 1;
        await this.notify(page);
        if (this.loseCommitResponse) {
          this.loseCommitResponse = false;
          throw new Error('Connection lost after server accepted save');
        }
        return { status: 'saved', garden: clone(this.garden) };
      }
      if (method === 'uploadPhoto') {
        if (this.failUpload) throw new Error('Upload failed');
        const path = `${USER.id}/${crypto.randomUUID()}.png`;
        this.photos.set(path, args[0]);
        return path;
      }
      if (method === 'getPhoto') return this.photos.get(args[0]);
      if (method === 'removePhoto') this.photos.delete(args[0]);
      return null;
    });
    await context.route('**/storage.js', (route) => route.fulfill({ contentType: 'application/javascript', body: `
      (() => {
        let authListener;
        let changeListener;
        const rpc = (method, ...args) => window.__gardenRpc(method, args);
        const read = (key) => JSON.parse(localStorage.getItem(key) || 'null');
        const key = (kind, uid) => 'test-' + kind + '-' + uid;
        const getSession = async () => read('test-session');
        const clearCache = async (uid) => {
          localStorage.removeItem(key('cache', uid));
          localStorage.removeItem(key('pending', uid));
          const names = await caches.keys();
          await Promise.all(names.filter(name => name.includes(uid)).map(name => caches.delete(name)));
        };
        window.__gardenChanged = () => changeListener?.();
        window.__expireSession = () => { localStorage.removeItem('test-session'); authListener?.(null); };
        window.GardenStore = function GardenStore() { return ({
          configured: true,
          getSession,
          onAuthChange: (callback) => { authListener = callback; return () => { authListener = null; }; },
          signIn: async (email, password) => {
            if (password !== 'family-password') throw new Error('Invalid login credentials');
            const session = { user: ${JSON.stringify(USER)} };
            localStorage.setItem('test-session', JSON.stringify(session));
            authListener?.(session);
            return session;
          },
          signOut: async () => { localStorage.removeItem('test-session'); authListener?.(null); },
          load: () => rpc('load'),
          initialize: (document) => rpc('initialize', document),
          commit: (revision, operationId, document) => rpc('commit', revision, operationId, document),
          subscribe: (uid, callback, status) => { changeListener = callback; queueMicrotask(() => status?.('SUBSCRIBED')); return () => { changeListener = null; }; },
          readCache: (uid) => read(key('cache', uid)),
          writeCache: (uid, value) => localStorage.setItem(key('cache', uid), JSON.stringify(value)),
          clearCache,
          readPending: (uid) => read(key('pending', uid)),
          writePending: (uid, value) => localStorage.setItem(key('pending', uid), JSON.stringify(value)),
          clearPending: (uid) => localStorage.removeItem(key('pending', uid)),
          uploadPhoto: async (blob) => rpc('uploadPhoto', { type: blob.type, bytes: Array.from(new Uint8Array(await blob.arrayBuffer())) }),
          getPhoto: async (path) => { const data = await rpc('getPhoto', path); if (!data) throw new Error('Missing photo'); return new Blob([new Uint8Array(data.bytes)], { type: data.type }); },
          removePhoto: (path) => rpc('removePhoto', path)
        }); };
        window.GardenStore.create = config => new window.GardenStore(config);
      })();
    ` }));
  }
}

async function unlock(page) {
  await page.locator('.tab-button[data-view="parent"]').click();
  await page.locator('#pinInput').fill('1234');
  await page.locator('#pinForm button').click();
  await expect(page.locator('#parentTools')).toBeVisible();
}

async function openGarden(page) {
  await page.goto('/');
  await expect(page.locator('#kidGardenContent')).toBeVisible();
}

module.exports = { GardenServer, sampleDocument, unlock, openGarden, USER };
