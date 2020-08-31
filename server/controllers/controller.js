const fetch = require('node-fetch');
require('dotenv').config();

const fetchRequest = async (queries, option) => {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${queries.type}+in+${queries.location}&key=${process.env.SECRET_API_KEY}`;
  return fetch(`${url}`, option)
    .then((res) => (res.status < 400 ? res : Promise.reject(res)))
    .then((res) => (res.status !== 204 ? res.json() : res))
    .catch((err) => console.log('err:', err));
};

exports.getPlaces = async (req, res) => {
  const categoryArray={
    "Arts&culture": ["museum", "art_gallery", "book_store", "university", "church"],
    "Kids": ["aquarium", "amusement_park", "museum","art_gallery","university", "zoo","park"],
    "Nature":["park", "zoo", "campground", "rv_park"],
    "Sightseeing":["tourist_attraction"],
    "Nightlife": ["night_club", "bar", "casino"],
    "Shopping": ["shopping_mall", "clothing_store"],
  }
  try {
    let allResults=[];
    const types = categoryArray[req.params.type];
 
    for (let type of types) {
      const results = await fetchRequest({
        type: type,
        location: req.params.location,
      });
      allResults = [...allResults, ...results.results];
    }
    const allResultsSet = new Set(allResults);
    res.send(
      [...allResultsSet]
        .filter(
          (place) =>
            parseInt(place.user_ratings_total) >= 500 &&
            parseFloat(place.rating) >= 4.0
        )
        .sort(
          (a, b) =>
          b.user_ratings_total - a.user_ratings_total || b.rating - a.rating
        )
    );
    res.status(200);
  } catch (err) {
    res.sendStatus = 500;
    if (err) throw err;
  }
};
