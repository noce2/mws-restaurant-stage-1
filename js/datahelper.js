/* eslint linebreak-style: ["error", "windows"] */
/* global self */

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
        if (!response.ok) throw (new Error('response was not a 200'));
        return response.json();
      })
      .catch(err => console.log(`the data could not be fetched because of ${err}`));
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
}
