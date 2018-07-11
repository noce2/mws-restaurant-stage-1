/* eslint linebreak-style: ["error", "windows"] */
/* global self */
/* global caches */
/* global fetch */
self.addEventListener('install', (event) => {
  self.importScripts('/js/indexeddbstore.class.js', '/js/idb.js'); // needed because SW has own scope, does not share window
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
  if ((/(\/restaurants)/g).test(event.request.url)) {
    console.log('not fetching from CacheAPI because indexedDB is used further down the line');
  } else {
    event.respondWith(fetchFromCache(event.request)
      .catch(err => console.log(`fetch operation failed because of: ${err}`)));
  }
});

/**
 * fetches the response object from the cache. If the
 * object is not there, it fetches it from the network
 * and stores it for later.
 * @param {Request} request
 */
function fetchFromCache(request) {
  return caches.open('mws-restaurant-v5')
    .then(cache => cache.match(request))
    .then((res) => {
      if (res) return res;
      return fetch(request).then(response =>
        caches.open('mws-restaurant-v5')
          .then(cache => cache.put(request, response.clone()))
          .then(() => response));
    });
}
