const CACHE_NAME = "star-garden-v13";
const APP_FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./config.js",
  "./storage.js", "./garden-session.js", "./ui-translations.js",
  "./vendor/supabase.js", "./manifest.webmanifest", "./icon.svg"
];
const SHELL_URLS = new Set(APP_FILES.map((path) => new URL(path, self.registration.scope).href));
const CONFIG_URL = new URL("./config.js", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(APP_FILES))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  // Account-owned photo caches are managed by sign-out, never by shell upgrades.
  event.waitUntil(caches.keys().then((names) => Promise.all(names
    .filter((name) => /^star-garden-v\d+$/.test(name) && name !== CACHE_NAME)
    .map((name) => caches.delete(name))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  // Only the exact static application allowlist may enter the shared shell cache.
  // Supabase requests and private photos bypass this service worker entirely.
  if (event.request.method !== "GET" || !SHELL_URLS.has(event.request.url)) return;
  event.respondWith(caches.open(CACHE_NAME).then(async (cache) => {
    const cached = await cache.match(event.request);
    // Owner setup may change just the public project configuration, without a
    // code release. Fetch it afresh online and retain the last copy for offline.
    if (event.request.url === CONFIG_URL) {
      try {
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response.ok || !cached ? response : cached;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }
    return cached || fetch(event.request);
  }));
});
