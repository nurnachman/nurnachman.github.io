const CACHE_NAME = "share64-cache-v1";
const urlsToCache = [
  '/share64/',        // תעדכן לפי הפרויקט שלך
  '/share64/index.html',
  '/share64/manifest.json',
  '/share64/icon-192.png',
  '/share64/icon-512.png'
];

// התקנה
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// אקטיבציה
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// פניות
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});