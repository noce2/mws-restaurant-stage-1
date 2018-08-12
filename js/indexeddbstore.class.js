/* eslint linebreak-style: ["error", "windows"] */

/**
 * Helper Functions for IndexedDB api.
 */
class IndexedDBStore {
  static get restaurantDataStoreName() {
    return 'restaurant-data';
  }

  static get queueForNewReviews() {
    return 'new-reviews-outbox';
  }
  /**
   * Static method that holds a promise to the db
   */
  static get dbPromise() {
    const dbPromise = (() => idb.open('mws-restaurant-db', 2, (upgradeDB) => {

      switch (upgradeDB.oldVersion) {
        case 0:
          upgradeDB.createObjectStore(IndexedDBStore.restaurantDataStoreName);
        case 1:
          upgradeDB.createObjectStore('new-reviews-outbox', { autoIncrement: true });
        default:
        console.log(`old db version is ${upgradeDB.oldVersion}`);
      }
    }))();
    return (dbPromise);
  }
  /**
   * Static method that puts a key and value in the db.
   * @param key
   * @param value
   * @param dataStoreName {String} - the name of the store where data will be placed.
   * Defaults to the "restaurant-data" store.
   */
  static put(key, value, dataStoreName = IndexedDBStore.restaurantDataStoreName) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(dataStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(dataStoreName);
        restaurantDataStore.put(value, key);
        return transaction.complete;
      });
  }

  /**
   * Static method that gets a value from the db.
   * @param key
   * @param dataStoreName {String} - the name of the store where data will be placed.
   * Defaults to the "restaurant-data" store.
   */
  static get(key, dataStoreName = IndexedDBStore.restaurantDataStoreName) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(dataStoreName);
        const restaurantDataStore = transaction.objectStore(dataStoreName);
        return restaurantDataStore.get(key);
      });
  }

  /**
   * Static method that deltes a value and its key from the db.
   * @param key
   * @param dataStoreName {String} - the name of the store where data will be placed.
   * Defaults to the "restaurant-data" store.
   */
  static delete(key, dataStoreName = IndexedDBStore.restaurantDataStoreName) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(dataStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(dataStoreName);
        restaurantDataStore.delete(key);
        return transaction.complete;
      });
  }
}
// The below iteration with a constructor and prototypal methods did not work
/* class IndexedDBStore {
  constructor() {
    this.objectStoreName = 'restaurant-data';
    this.dbPromise = idb.open('mws-restaurant-db', 1, (upgradeDB) => {
      console.log(`old db version is ${upgradeDB.oldVersion}`);
      const keyValStore = upgradeDB.createObjectStore(this.objectStoreName);
    });
  }

  put(key, value) {
    return this.dbPromise
      .then((db) => {
        const transaction = db.transaction(this.objectStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(this.objectStoreName);
        restaurantDataStore.put(value, key);
        return transaction.complete;
      });
  }

  get(key) {
    return this.dbPromise
      .then((db) => {
        const transaction = db.transaction(this.objectStoreName);
        const restaurantDataStore = transaction.objectStore(this.objectStoreName);
        restaurantDataStore.get(key);
        return transaction.complete;
      });
  }

  delete(key) {
    return this.dbPromise
      .then((db) => {
        const transaction = db.transaction(this.objectStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(this.objectStoreName);
        restaurantDataStore.delete(key);
        return transaction.complete;
      });
  }
}
 */
