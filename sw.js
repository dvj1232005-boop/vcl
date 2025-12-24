/* =====================================================
   SERVICE WORKER – AN QUY CHẾ
   Chỉ cache file tĩnh, KHÔNG cache Firebase
===================================================== */

const CACHE_NAME = "an-quy-che-cache-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

/* ===== INSTALL ===== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* ===== ACTIVATE ===== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* ===== FETCH ===== */
self.addEventListener("fetch", event => {
  // KHÔNG cache Firebase / API
  if (event.request.url.includes("firebase")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
