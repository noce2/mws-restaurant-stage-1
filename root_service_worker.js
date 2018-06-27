/* eslint linebreak-style: ["error", "windows"] */
/* global self */
/* global caches */
/* global fetch */
self.addEventListener('install', (event) => {
  self.importScripts('/js/indexeddbstore.class.js', '/js/idb.js'); // needed because SW has own scope, does not share window
  console.log(typeof IndexedDBStore);
  IndexedDBStore.put('hello', 'world')
    .then(() => console.log('hello world added'))
    .catch(err => console.error(`hello world not added because of ${err}`));
  const imgUrlsToAdd = Array(10).fill('').map((each, index) => `img/${index + 1}.jpg`);
  const urlsToCache = [
    '/',
    // 'data/restaurants.json', no longer needed as data fetched from server and cached in indexedDB
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
  ].concat(imgUrlsToAdd);
  event.waitUntil(caches.open('mws-restaurant-v5')
    .then(cache => cache.addAll(urlsToCache))
    .then(() => console.log('assets fully cached'))
    .catch(err => console.log(`cache failed to open because of: ${err}`)));
});

self.addEventListener('activate', () => {
  console.log('service worker activating');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('mws-restaurant-v5')
      .then(cache => cache.match(event.request))
      .then((res) => {
        if (res) return res;
        return fetch(event.request).then(response =>
          caches.open('mws-restaurant-v5')
            .then(cache => cache.put(event.request, response.clone()))
            .then(() => response));
      })
      .catch(err => console.log(`fetch operation failed because of: ${err}`))
  );
});
