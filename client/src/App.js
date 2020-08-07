import React, { useState, useEffect } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './views/home';
import moment from 'moment';
import { getPlaces } from './api/getPlaces';
import Categories from './views/Categories';
import MapItinerary from './views/MapItinerary';
import Recommendation from './views/Recommendation';

function App({ categoryStates }) {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [destination, setDestination] = useState('');
  const [places, setPlaces] = useState([]);
  const [exploreplaces, setExplorePlaces] = useState([]);
  const [placeEntities, setPlaceEntities] = useState({});
  const [filteredCategories, setCategories] = useState([]);

  useEffect(() => {
    setPlaceEntities({});
  }, []);

  useEffect(() => {
    const filterCategory = categoryStates
      .filter((categoryState) => categoryState.selected)
      .map((categoryState) => categoryState.text);
    setCategories(filterCategory);
  }, [categoryStates]);

  const placesPerType = () => {
    const duration = tripDuration();
    return Math.ceil(((duration + 1) * 4) / filteredCategories.length);
  };

  const tripDuration = () => {
    const momentStart = moment(startDate);
    const momentEnd = moment(endDate);
    return momentEnd.diff(momentStart, 'days');
  };

  const loadPlaces = () => {
    filteredCategories.map((category) => {
      console.log(category);
      const loadPlacesPerCategory = async (destination, category) => {
        getPlaces(`${destination}/${category}`).then((allPlaces) => {
          const len = allPlaces.length;
          const placeNum = placesPerType();

          let extraPlaces = allPlaces.slice(Math.min(len, placeNum));
          const exploreEntites = extraPlaces.reduce((acc, place) => {
            return {
              ...acc,
              [place.place_id]: Object.assign(
                place,
                { inMyList: false },
                { day: 0 }
              ),
            };
          }, {});
          setPlaceEntities(Object.assign(placeEntities, exploreEntites));

          let recommendedPlaces = allPlaces.slice(0, Math.min(len, placeNum));
          const newEntites = recommendedPlaces.reduce((acc, place) => {
            return {
              ...acc,
              [place.place_id]: Object.assign(
                place,
                { inMyList: true },
                { day: 0 }
              ),
            };
          }, {});

          setPlaceEntities(Object.assign(placeEntities, newEntites));

          const placeIds = Object.keys(placeEntities);

          const newPlacesOnList = placeIds.filter((placeKey) => {
            return placeEntities[placeKey].inMyList === true;
          });

          const newExplorePlaces = placeIds.filter((placeKey) => {
            return placeEntities[placeKey].inMyList === false;
          });

          setPlaces((places) => [...places, ...newPlacesOnList]);
          setExplorePlaces((exploreplaces) => [
            ...exploreplaces,
            ...newExplorePlaces,
          ]);
        });
      };
      return loadPlacesPerCategory(destination, category);
    });
  };

  const helper = (place_id, trueOrFalse) => {
    const newEntities = { ...placeEntities };
    newEntities[place_id].inMyList = trueOrFalse;
    setPlaceEntities(newEntities);
  };

  const addPlace = (id) => {
    helper(id, true);
    setPlaces([...places, id]);
    setExplorePlaces(exploreplaces.filter((place_id) => place_id !== id));
  };

  const removePlace = (place_id) => {
    helper(place_id, false);
    setPlaces(places.filter((id) => place_id !== id));
    setExplorePlaces([...exploreplaces, place_id]);
  };

  const handleAsssignDay = (day, id) => {
    const newEntities = { ...placeEntities };
    newEntities[id].day = day;
    setPlaceEntities(newEntities);
  };

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Home
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setDestination={setDestination}
              startDate={startDate}
              endDate={endDate}
              destination={destination}
            />
          )}
        />
        <Route path="/Categories" component={Categories} />
        <Route
          path="/Recommendation"
          render={() => (
            <Recommendation
              loadPlaces={loadPlaces}
              places={places.map((id) => placeEntities[id])}
              exploreplaces={exploreplaces.map((id) => placeEntities[id])}
              addPlace={addPlace}
              removePlace={removePlace}
            />
          )}
        />
        <Route
          path="/MapItinerary"
          render={() => (
            <MapItinerary
              places={places.map((id) => placeEntities[id])}
              removePlace={removePlace}
              tripDuration={tripDuration}
              handleAsssignDay={handleAsssignDay}
            />
          )}
        />
      </Switch>
    </Router>
  );
}

function mapStateToProps(state) {
  return {
    categoryStates: state,
  };
}

export default connect(mapStateToProps)(App);
