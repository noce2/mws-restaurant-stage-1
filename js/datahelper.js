/* eslint linebreak-style: ["error", "windows"] */
/* global self */
/* global google */

/**
 * Common database helper functions.
 */
class DataHelper {
  /**
   * Server URL.
   * Address to the live server that has the restaurant data.
   */
  static get SERVER_URL() {
    const port = 1337;
    return `http://localhost:${port}/restaurants/`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return self.fetch(DataHelper.SERVER_URL)
      .then((response) => {
        if (!response.ok) throw (new Error(`response was not a 200, because ${response.body}`));
        return response.json();
      })
      .catch(err => console.log(`the data could not be fetched because of ${err}`));
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return self.fetch(`${DataHelper.SERVER_URL}/${id}`)
      .then((response) => {
        if (!response.ok) throw (new Error(`response was not a 200, because ${response.body}`));
        return response.json();
      })
      .catch((err) => {
        throw new Error(`the data could not be fetched because of ${err}`);
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DataHelper.fetchRestaurants()
      .then(_restaurants =>
      // Filter restaurants to have only given cuisine type
        _restaurants.filter(r => r.cuisine_type === cuisine))
      .catch((err) => {
        console.error(`the data could not be fetched because of ${err}`);
        return null;
      });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DataHelper.fetchRestaurants()
      .then(_restaurants =>
      // Filter restaurants to have only given neighborhood
        _restaurants.filter(r => r.neighborhood === neighborhood))
      .catch((err) => {
        console.error(`the data could not be fetched because of ${err}`);
        throw new Error(`the data could not be fetched because of ${err}`);
      });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return DataHelper.fetchRestaurants()
      .then((_restaurants) => {
        let results = _restaurants;
        if (cuisine !== 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type === cuisine);
        }
        if (neighborhood !== 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood === neighborhood);
        }
        return results;
      })
      .catch((err) => {
        console.error(`the data could not be fetched because of ${err}`);
        return null;
      });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return DataHelper.fetchRestaurants()
      .then((restaurants) => {
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
        return uniqueNeighborhoods;
      })
      .catch(err => `there was an error fetching the neighbourhoods: ${err}`);
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return DataHelper.fetchRestaurants()
      .then((restaurants) => {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
        return uniqueCuisines;
      })
      .catch(err => `there was an error fetching the neighbourhoods: ${err}`);
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DataHelper.urlForRestaurant(restaurant),
      map,
      animation: google.maps.Animation.DROP,
    });
    return marker;
  }
}
