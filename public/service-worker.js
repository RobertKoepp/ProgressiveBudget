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
    if (event.request.url.includes ("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(function(cache){
            return fetch(event.request).then(function(response){
                if(response.status === 200){
                    cache.put(event.request.url, response.clone())
                }
                return response
            }).catch(function(err){
                return cache.match(event.request)
            })
        })
      );
      return;
    }
    event.respondWith(//jeezuz
        fetch(event.request).catch(function() {
          return caches.match(event.request).then(function(response) {
            if (response) {
              return response;
            } else if (event.request.headers.get("accept").includes("text/html")) {
              // return the cached stuff
              return caches.match("/");
            }
          });
        })
      );



});