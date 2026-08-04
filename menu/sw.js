const CACHE_NAME = 'app-assets-v1';
// Assets to cache immediately
const ASSETS_TO_CACHE = ['/menu', '/menu/index.html', '/menu/style.css', '/menu/index.js', '/menu/obrajs.js', '/menu/sst.ttf', '/menu/templates/app_item.html', '/menu/templates/app_layout.html', '/menu/templates/header_layout.html', '/menu/templates/app_icon.html', '/menu/templates/marqueue_layout.html', '/menu/ps4-select-button.mp3', '/menu/slide.mp3'];

// 1. Install & Cache
self.addEventListener('install', (event) => {
    // Force activating immediately without waiting for existing clients to close
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching lockscreen assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate & Claim Clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Claim any un-controlled clients immediately
            self.clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
        ])
    );
});

// 3. Keep-Alive Message Listener
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PING') {
        // Keeps the SW process awake and responsive
        console.log('Service Worker Heartbeat Received');
    }
});

// 4. Cache-First Fetch Strategy (Offline Fallback)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // Return from cache if present
            }
            // Otherwise try fetching from network
            return fetch(event.request).catch(() => {
                // Return offline fallback page if network fails
                return caches.match('/index.html');
            });
        })
    );
});