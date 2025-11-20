const CACHE_NAME = 'whatsdirect-cache-v1';
const OFFLINE_URL = '/index.html';


self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll([
'/',
OFFLINE_URL,
'/index.html',
'/manifest.json'
]);
})
);
self.skipWaiting();
});


self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys => Promise.all(
keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
))
);
self.clients.claim();
});


self.addEventListener('fetch', event => {
const request = event.request;
// For navigation requests, serve the cached offline page fallback
if (request.mode === 'navigate') {
event.respondWith(
fetch(request).catch(() => caches.match(OFFLINE_URL))
);
return;
}
// For other requests, try cache first then network
event.respondWith(
caches.match(request).then(cached => cached || fetch(request))
);
});