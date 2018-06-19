/* eslint linebreak-style: ["error", "windows"] */
/* global self */
/* global caches */
/* global fetch */

self.addEventListener('install', (event) => {
  const imgUrlsToAdd = Array(10).fill('').map((each, index) => `img/${index + 1}.jpg`);
  const urlsToCache = [
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
  ].concat(imgUrlsToAdd);
  event.waitUntil(caches.open('mws-restaurant-v2')
    .then(cache => cache.addAll(urlsToCache))
    .then(() => console.log('assets fully cached'))
    .catch(err => console.log(`cache failed to open because of: ${err}`)));
});

self.addEventListener('activate', (event) => {
  console.log('service worker activating');
});

self.addEventListener('fetch', (event) => {
  console.log(event.request);
  return event.respondWith(caches.match(event.request)
    .then((response) => {
      if (response) return response;
      return fetch(event.request);
    }));
});
