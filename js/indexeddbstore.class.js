/* eslint linebreak-style: ["error", "windows"] */

/**
 * Helper Functions for IndexedDB api.
 */
class IndexedDBStore {
  static get objectStoreName() {
    return 'restaurant-data';
  }
  /**
   * Static method that holds a promise to the db
   */
  static get dbPromise() {
    const dbPromise = (() => idb.open('mws-restaurant-db', 1, (upgradeDB) => {
      console.log(`old db version is ${upgradeDB.oldVersion}`);
      upgradeDB.createObjectStore(IndexedDBStore.objectStoreName);
    }))();
    return (dbPromise);
  }
  /**
   * Static method that puts a key and value in the db.
   * @param key
   * @param value
   */
  static put(key, value) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(IndexedDBStore.objectStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(IndexedDBStore.objectStoreName);
        restaurantDataStore.put(value, key);
        return transaction.complete;
      });
  }

  /**
   * Static method that gets a value from the db.
   * @param key
   */
  static get(key) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(IndexedDBStore.objectStoreName);
        const restaurantDataStore = transaction.objectStore(IndexedDBStore.objectStoreName);
        restaurantDataStore.get(key);
        return transaction.complete;
      });
  }

  /**
   * Static method that deltes a value and its key from the db.
   * @param key
   */
  static delete(key) {
    return IndexedDBStore.dbPromise
      .then((db) => {
        const transaction = db.transaction(IndexedDBStore.objectStoreName, 'readwrite');
        const restaurantDataStore = transaction.objectStore(IndexedDBStore.objectStoreName);
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

 self.IndexedDBStore = IndexedDBStore;