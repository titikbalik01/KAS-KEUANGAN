const CACHE = 'pembukuan-v3';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './fonts/plus-jakarta-sans-latin-400-normal.woff2', './fonts/plus-jakarta-sans-latin-500-normal.woff2', './fonts/plus-jakarta-sans-latin-600-normal.woff2', './fonts/plus-jakarta-sans-latin-700-normal.woff2', './fonts/plus-jakarta-sans-latin-800-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// network dulu (update langsung terbaca), kalau offline pakai cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
