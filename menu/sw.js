const CACHE_NAME = 'app-assets-v1';
// Assets to cache immediately
const PRECACHE_ASSETS = ['/menu', '/menu/index.html', '/menu/style.css', '/menu/index.js', '/menu/obrajs.js', '/menu/sst.ttf', '/menu/templates/app_item.html','/menu/templates/app_layout.html','/menu/templates/header_layout.html'];

// Install: Cache core files
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_ASSETS)));
});

// Activate: Clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
});

// Fetch: Intercept requests, store dynamically
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET') cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});