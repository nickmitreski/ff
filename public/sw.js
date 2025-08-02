const CACHE_NAME = 'flash-forward-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const IMAGE_CACHE = 'image-v2';
const FONT_CACHE = 'font-v2';

const urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/sounds/windows95-startup.mp3',
  '/sounds/windows95-error.mp3',
  '/sounds/windows95-maximize.mp3',
  '/sounds/windows95-minimize.mp3',
];

// Cache strategies with different lifetimes
const cacheStrategies = {
  static: 'cache-first', // 1 year
  dynamic: 'network-first', // 1 hour
  api: 'network-first', // 5 minutes
  image: 'cache-first', // 1 month
  font: 'cache-first', // 1 year
};



// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - implement cache strategies with different lifetimes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other unsupported schemes
  if (url.protocol === 'chrome-extension:' || 
      url.protocol === 'chrome:' || 
      url.protocol === 'moz-extension:' ||
      url.protocol === 'safari-extension:') {
    return;
  }

  // Images - long cache (1 month)
  if (url.pathname.includes('.png') || 
      url.pathname.includes('.jpg') || 
      url.pathname.includes('.jpeg') || 
      url.pathname.includes('.gif') || 
      url.pathname.includes('.webp') ||
      url.pathname.includes('.svg')) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Fonts - very long cache (1 year)
  if (url.pathname.includes('.woff') || 
      url.pathname.includes('.woff2') || 
      url.pathname.includes('.ttf') || 
      url.pathname.includes('.eot')) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Static assets - long cache (1 year)
  if (url.pathname.startsWith('/static/') || 
      url.pathname.includes('.mp3') ||
      url.pathname.includes('.wav') ||
      url.pathname.includes('.css') ||
      url.pathname.includes('.js')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // API calls - short cache (5 minutes)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // HTML pages - medium cache (1 hour)
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Default - static cache
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Cache first strategy failed:', error);
    return new Response('Network error', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network first strategy failed:', error);
    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      console.warn('Cache fallback failed:', cacheError);
    }
    return new Response('Network error', { status: 503 });
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 