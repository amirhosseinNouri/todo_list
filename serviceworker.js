const assets = [
  '/src',
  '/src/fonts/Montserrat-Regular.otf',
  '/src/style.css',
  '/src/app.js',
  '/src/sw-register.js',
];

self.addEventListener('install', (e) => {
  caches.open('assets').then((cache) => {
    cache.addAll(assets);
  });
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open('assets').then((cache) => {
      cache.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        } else {
          return fetch(e.request.url);
        }
      });
    }),
  );
});
