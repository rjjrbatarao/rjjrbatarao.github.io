const CACHE_NAME = 'app-assets-v1';
// Assets to cache immediately
const ASSETS_TO_CACHE = [
    '/sloader2',
    '/sloader2/index.html',
    '/sloader2/style.css',
    '/sloader2/script.js',
    '/sloader2/obrajs.js',
    '/sloader2/midori.umd.js',
    '/sloader2/three.min.js',
    '/sloader2/settings.js',
    '/sloader2/sst.ttf',
    '/sloader2/templates/coin_modal.html',
    '/sloader2/templates/user_timer.html',
    '/sloader2/templates/settings.html',
    '/sloader2/beep.mp3',
];

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