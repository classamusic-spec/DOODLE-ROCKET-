// Doodle Rocket offline cache. Everything the app needs is precached on install and served cache-first,
// so the game works with no connection. Bump VERSION whenever any of these files change.
const VERSION = 'doodle-rocket-v5';
const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'fonts/andika-400-latin.woff2', 'fonts/andika-700-latin.woff2', 'fonts/gaegu-700-latin.woff2',
  'icons/icon.svg', 'icons/icon-32.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Page loads: try the network first so updates arrive, fall back to the cached copy offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
