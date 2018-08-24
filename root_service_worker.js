/* eslint linebreak-style: ["error", "windows"] */
/* global self */
/* global caches */
/* global fetch */
const cacheVersion = 'mws-restaurant-v6';

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
  event.waitUntil(caches.open(cacheVersion)
    .then(cache => cache.addAll(urlsToCache))
    .then(() => console.log('assets fully cached'))
    .catch(err => console.log(`cache failed to open because of: ${err}`)));
});

self.addEventListener('activate', (event) => {
  console.log('service worker activating and deleting old caches');
  event.waitUntil((caches.keys())
    .then(cacheNames =>
      (cacheNames.filter(each => each !== cacheVersion)
        .map(eachCacheName => caches.delete(eachCacheName))
        .map((eachResult) => {
          console.log(`one delete was a success - ${eachResult}`);
          return eachResult;
        })))
    .catch(err => console.log(`deletion of old caches failed because of ${err}`)));
});

self.addEventListener('fetch', (event) => {
  /* Not putting restaurant data or review data in the Cache */
  if ((/(\/restaurants)|(\/reviews\/\?restaurant_id)/g).test(event.request.url)) {
    console.log('not fetching from CacheAPI because indexedDB is used further down the line');
  } else if (event.request.method === 'POST') {
    if (!self.navigator.onLine) {
      console.log('browser is offline so caching post request');
      console.log(event);
      event.respondWith(
        event.request.clone().text()
          .then(postBody => IndexedDBStore
          /* the request object needs to be stringified because it has methods attached to it
           * which cause the put operation to fail. Stringification removes the methods and
           * parsing turns the string into an object once more. */
            .put(null, {
              request: {
                body: postBody,
                method: event.request.method,
                url: event.request.url,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                } /* allow comma dangle here, it refuses to commit the object otherwise */
              } /* allow comma dangle here, it refuses to commit the object otherwise */
            }, IndexedDBStore.queueForNewReviews)
            .then((result) => {
              console.log(`result from cache operation is ${result}`);
              return new Response('', {
                status: 202,
                statusText: 'The request has been accepted but the resource is unavailable',
              });
            })));
    } else {
      console.log('do nothing because this is a post request');
    }
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
  return caches.open(cacheVersion)
    .then(cache => cache.match(request))
    .then((res) => {
      if (res) return res;
      return fetch(request).then(response =>
        caches.open(cacheVersion)
          .then(cache => cache.put(request, response.clone()))
          .then(() => response));
    });
}
