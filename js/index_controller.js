/* eslint linebreak-style: ["error", "windows"] */
/* global navigator */

/**
 * Represents the controller that initialises the service worker
 * and other utilities
 * @class
 */
function IndexController() {
  this.registerSW();
}

IndexController.prototype.registerSW = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/root_service_worker.js', { scope: '/' })
      .then(sw => console.log('registration successful'))
      .catch(err => console.log(`registration unsuccessful for reason: ${err}`));
  }
};

(function main() {
  const controller = new IndexController();
}());
