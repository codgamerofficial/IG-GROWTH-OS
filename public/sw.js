// =============================================================================
// Service Worker Unregister & Cache Purge Protocol
// Ensures fresh Next.js webpack chunks load without stale CacheStorage interference
// =============================================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[SW Purge] Deleting cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Pass-through fetch handler ensuring zero interception while de-registering
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
