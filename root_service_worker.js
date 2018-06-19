/* eslint linebreak-style: ["error", "windows"] */
/* global self */
self.addEventListener('fetch', (event) => {
  console.log(event.request);
});
