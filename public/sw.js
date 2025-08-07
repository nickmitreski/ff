// Service Worker for Flash Forward Digital
const CACHE_NAME = 'ff-cache-v1';
const STATIC_CACHE = 'ff-static-v1';
const DYNAMIC_CACHE = 'ff-dynamic-v1';
const IMAGE_CACHE = 'ff-images-v1';
const FONT_CACHE = 'ff-fonts-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml'
      ]);
    })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== 'GET') {
    return;
  }

  // Images - cache first
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Fonts - cache first
  if (request.destination === 'font') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // HTML pages - network first
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
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
    
    // Skip external resources that might be blocked by CSP
    const url = new URL(request.url);
    if (url.hostname !== 'localhost' && 
        url.hostname !== '127.0.0.1' &&
        !url.hostname.includes('localhost') && 
        !url.hostname.includes('127.0.0.1') &&
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('cur.cursors-4u.net') &&
        !url.hostname.includes('us.i.posthog.com') &&
        !url.hostname.includes('us-assets.i.posthog.com') &&
        !url.hostname.includes('file.garden') &&
        !url.hostname.includes('ff-eight-gamma.vercel.app')) {
      console.warn('Skipping external resource:', url.href);
      return new Response('External resource blocked', { status: 403 });
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
    // Skip external resources that might be blocked by CSP
    const url = new URL(request.url);
    if (url.hostname !== 'localhost' && 
        url.hostname !== '127.0.0.1' &&
        !url.hostname.includes('localhost') && 
        !url.hostname.includes('127.0.0.1') &&
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('cur.cursors-4u.net') &&
        !url.hostname.includes('us.i.posthog.com') &&
        !url.hostname.includes('us-assets.i.posthog.com') &&
        !url.hostname.includes('file.garden') &&
        !url.hostname.includes('ff-eight-gamma.vercel.app')) {
      console.warn('Skipping external resource:', url.href);
      return new Response('External resource blocked', { status: 403 });
    }
    
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
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE && 
              cacheName !== FONT_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 