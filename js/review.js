/* eslint linebreak-style: ["error", "windows"] */
let restaurant;

document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurantFromURL()
    .then(_restaurant => fillReviewHTML(_restaurant))
    .catch(err => console.error(err));
});

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = () => {
  if (self.restaurant) { // restaurant already fetched!
    return Promise.resolve(self.restaurant);
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    const error = 'No restaurant id in URL';
    return Promise.reject(error);
  }
  return DataHelper.fetchRestaurantById(id)
    .then((_restaurant) => {
      if (!_restaurant) {
        throw new Error('no restaurant was found for the given id');
      }
      self.restaurant = _restaurant;
      return Promise.resolve(_restaurant);
    });
};

/**
 * Prefill the title of the restaurant and its id
 */
fillReviewHTML = (restaurant) => {
  const name = document.getElementById('restaurant_name');
  name.innerHTML = restaurant.name;
  
  const id = document.getElementById('restaurant_id');
  id.value = restaurant.id;
  console.log(`The prefilled id is ${id.value}`);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
