const cacheName = 'ioc_static';

const staticAssets = [
  './',
  './app.js',
  './error.html',
  './manifest.json',
  './static/fontawesome/js/fontawesome-all.js',
  './static/bootstrap/css/bootstrap.min.css',
  './static/bootstrap/css/mdb.min.css',
  './static/bootstrap/css/style.css',
  './static/img/favicon.png',
  './static/bootstrap/js/jquery-3.2.1.min.js',
  './static/bootstrap/js/popper.min.js',
  './static/bootstrap/js/bootstrap.min.js',
  './static/bootstrap/js/mdb.min.js',
  './custom.js'
];

self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then((response) => {
        var responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn(request.url + ': ' + err.message);
            });
          }); 

        return response;
      });
    })
  );
});