// =============================================================================
// PujaHop Kolkata: Service Worker
// Offline Caching for Festival Network Congestion • Stale-While-Revalidate APIs
// Push Notification Event Listeners
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

const CACHE_NAME = 'pujahop-cache-v1.2';
const API_CACHE_NAME = 'pujahop-api-v1.2';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/offline.html',
  '/icon',
];

// 1. Install & Precache Critical Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PujaHop SW] Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate & Purge Stale Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First with Timeout Fallback for Congested Kolkata Cell Towers
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Stale-While-Revalidate Strategy for Critical Read-Only PujaHop APIs
  if (
    url.pathname.startsWith('/api/pandals') ||
    url.pathname.startsWith('/api/calendar') ||
    url.pathname.startsWith('/api/metro') ||
    url.pathname.startsWith('/api/places') ||
    url.pathname.startsWith('/api/traffic') ||
    url.pathname.startsWith('/api/weather')
  ) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);

        // Fetch network with 3.5s timeout for congested puja crowds
        const fetchPromise = new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            if (cachedResponse) resolve(cachedResponse);
            else reject(new Error('Network timeout in congested crowd'));
          }, 3500);

          fetch(event.request)
            .then((networkResponse) => {
              clearTimeout(timeoutId);
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              resolve(networkResponse);
            })
            .catch((err) => {
              clearTimeout(timeoutId);
              if (cachedResponse) resolve(cachedResponse);
              else reject(err);
            });
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Cache-First for static assets, fonts, icons, and images
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2|woff|css|js)$/) ||
    url.hostname.includes('basemaps.cartocdn.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Navigation requests: Network first with /offline.html fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedPage = await cache.match(event.request);
        if (cachedPage) return cachedPage;
        return cache.match('/offline.html');
      })
    );
    return;
  }

  // Default: Network with Cache fallback
  event.respondWith(
    fetch(event.request).catch(async () => {
      const match = await caches.match(event.request);
      if (match) return match;
      throw new Error('Offline and not cached');
    })
  );
});

// 4. Web Push Notification Listener for Emergency Traffic & Weather Broadcasts
self.addEventListener('push', (event) => {
  let data = {
    title: 'PujaHop Kolkata Alert',
    body: 'Durga Puja 2026 emergency advisory from Kolkata Police.',
    url: '/',
    tag: 'pujahop-alert',
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon',
    badge: '/icon',
    tag: data.tag || 'pujahop-emergency',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'View Route & Directives' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
