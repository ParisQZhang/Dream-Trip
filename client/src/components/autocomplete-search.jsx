import React, { useState, useEffect, useRef } from 'react';
import '../styles/autocomplete-search.css';

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

function handleScriptLoad(updateQuery, autoCompleteRef, setDestination) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ['(cities)'] }
  );
  autoComplete.setFields(['address_components', 'formatted_address']);
  autoComplete.addListener('place_changed', () =>
    handlePlaceSelect(updateQuery, setDestination)
  );
}

async function handlePlaceSelect(updateQuery, setDestination) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  setDestination(() => query);
}

function SearchLocationInput({ setDestination }) {
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, setDestination)
    );
  }, [setDestination]);

  return (
    <div className="search-location">
      <input
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
    </div>
  );
}

export default SearchLocationInput;
