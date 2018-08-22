/* eslint linebreak-style: ["error", "windows"] */
/* global document */
/* global window */
/* global alert */
/* global confirm */

let restaurant;

document.addEventListener('DOMContentLoaded', () => {
  fetchRestaurantFromURL()
    .then(_restaurant => fillReviewHTML(_restaurant))
    .catch(err => console.error(err));
});

document.addEventListener('submit', (event) => {
  // first get the data to be submitted:
  const restaurantId = document.getElementById('restaurant_id').value;
  const reviewerName = document.getElementById('reviewer_name').value;
  let rating;

  document.getElementsByName('rating').forEach((each) => {
    if (each.checked) {
      rating = each.value;
    }
  });

  const comments = document.getElementById('comment_text').value;
  console.log(`${JSON.stringify({
    restaurantId,
    reviewerName,
    rating,
    comments,
  })}`);
  // next stop the event from progressing

  event.preventDefault();
  // using fetch as per http2

  fetch('http://localhost:1337/reviews/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `restaurant_id=${restaurantId}&name=${reviewerName}&rating=${rating}&comments=${comments}`,
  })
    .then(response => response.status)
    .then((responseStatus) => {
      console.log(`response from the server is ${JSON.stringify(responseStatus)}`);
      if (responseStatus === 201 &&
        confirm('Your review has successfully been submitted so this window will now close. Click ok to close.')) {
        window.close();
      } else {
        alert('Your review has not been successfully posted but the app will retry a submission later');
      }
    })
    .catch(err => console.log(`fetch failed because of ${err}`));
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
