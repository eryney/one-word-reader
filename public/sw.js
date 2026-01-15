// Network-first service worker that always checks for updates
// This ensures users always get the latest version

const CACHE_NAME = 'one-word-reader-v1';

// Install - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate - take control of all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Clear all old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      // Force page reload on all clients to get fresh content
      return self.clients.claim();
    })
  );
});

// Fetch - always go to network first
self.addEventListener('fetch', (event) => {
  // For HTML files, ALWAYS fetch from network (never cache)
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For JS/CSS assets, use network first but cache as fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});
