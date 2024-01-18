const CACHE = '%DEPLOY_HASH%';

const PRECACHE = [
  `/fonts/Comfortaa-logotype.woff2`,
  `/fonts/Sora-Variable.woff2`,
  `/app.min.css?v=${CACHE}`,
  `/cotton.svg`
];

self.addEventListener('install', (ev) => {
  self.skipWaiting();
  ev.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(self.clients.claim());
  const clearCaches = async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) {
        await caches.delete(key);
      }
    }
  };
  ev.waitUntil(clearCaches());
});

self.addEventListener('fetch', async (ev) => {
  if (ev.request.method !== 'GET') {
    return;
  }
  const url = new URL(ev.request.url);
  let cachable = false;
  if (PRECACHE.includes(url.pathname)) {
    cachable = true;
  }
  if (url.pathname.startsWith('/_/immutable/')) {
    cachable = true;
  }
  if (!cachable) {
    return;
  }
  // Try cache first
  const cache = await caches.open(CACHE);
  let response = await cache.match(ev.request);
  if (response) {
    ev.respondWith(response);
    return;
  }
  // Try fetch and cache
  response = await fetch(ev.request);
  if (!response.ok || response.status !== 200 || response.type !== 'basic') {
    ev.respondWith(response);
    return;
  }
  await cache.put(ev.request, response.clone());
  ev.respondWith(response);
});
