const CACHE_NAME = 'app-assets-v1';
// Assets to cache immediately
const ASSETS_TO_CACHE = [
    '/smenu2',
    '/smenu2/index.html',
    '/smenu2/style.css',
    '/smenu2/index.js',
    '/smenu2/obrajs.js',
    '/smenu2/midori.umd.js',
    '/smenu2/three.min.js',
    '/smenu2/sst.ttf',
    '/smenu2/templates/app_icon.html',
    '/smenu2/templates/app_info.html',
    '/smenu2/templates/app_item.html',
    '/smenu2/templates/app_layout.html',
    '/smenu2/templates/app_recents_item.html',
    '/smenu2/templates/app_recents_layout.html',
    '/smenu2/templates/header_layout.html',
    '/smenu2/templates/marqueue_layout.html',
    '/smenu2/templates/modal_game_mode.html',
    '/smenu2/templates/coin_modal.html',
    '/smenu2/templates/user_time.html',
    '/smenu2/ps4-select-button.mp3',
    '/smenu2/slide.mp3',
    '/smenu2/beep.mp3'];

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