// ============================================================
// Service Worker - ToolBox PWA
// Cache First for static assets, Network First for pages
// ============================================================

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `toolbox-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `toolbox-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `toolbox-offline-${CACHE_VERSION}`;

// Pre-cache critical resources
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/dark.css',
  '/assets/css/tools.css',
  '/assets/css/blog.css',
  '/assets/js/app.js',
  '/assets/js/i18n.js',
  '/assets/js/utils.js',
  '/manifest.json',
  '/assets/images/favicon.svg',
  '/404.html'
];

// Install event - pre-cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker, version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching critical resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Pre-cache failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker, version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('toolbox-') &&
                     name !== STATIC_CACHE &&
                     name !== DYNAMIC_CACHE &&
                     name !== OFFLINE_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - routing strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except CDN resources)
  if (url.origin !== location.origin) {
    // Cache CDN resources with Cache First
    if (url.hostname.includes('unpkg.com') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cdn.jsdelivr.net')) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  // Strategy selection based on resource type
  if (isStaticAsset(request)) {
    // Cache First for static assets (CSS, JS, images, fonts)
    event.respondWith(cacheFirst(request));
  } else if (isPageRequest(request)) {
    // Network First for HTML pages
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate for other resources
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ============================================================
// Caching Strategies
// ============================================================

// Cache First: Serve from cache, fall back to network
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] CacheFirst fetch failed:', request.url);
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Network First: Try network, fall back to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline fallback page
    const offlinePage = await caches.match('/404.html');
    if (offlinePage) {
      return offlinePage;
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Stale While Revalidate: Serve from cache, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// ============================================================
// Helper Functions
// ============================================================

function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.woff', '.woff2', '.ttf', '.eot', '.ico', '.json'
  ];
  return staticExtensions.some((ext) => url.pathname.endsWith(ext));
}

function isPageRequest(request) {
  const url = new URL(request.url);
  const acceptHeader = request.headers.get('Accept') || '';
  return acceptHeader.includes('text/html') ||
         url.pathname.endsWith('/') ||
         url.pathname.endsWith('.html');
}

// ============================================================
// Message Handler - for cache version updates
// ============================================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name.startsWith('toolbox-')) {
          caches.delete(name);
        }
      });
    });
  }
});
