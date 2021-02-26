const CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
var urlsToCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];



self.addEventListener("install", (event) => {
    event.waitUntil(
       caches.open(CACHE_NAME).then(cache => {
           return cache.addAll(urlsToCache)
       })
        // Setting {cache: 'reload'} in the new request will ensure that the
        // response isn't fulfilled from the HTTP cache; i.e., it will be from
        // the network.
       
    )})
    // Force the waiting service worker to become the active service worker.
   
  
  self.addEventListener("fetch", (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            // First, try to use the navigation preload response if it's supported.
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }
  
            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // catch is only triggered if an exception is thrown, which is likely
            // due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log("Fetch failed; returning offline page instead.", error);
  
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(OFFLINE_URL);
            return cachedResponse;
          }
        })()
      );
    }
});