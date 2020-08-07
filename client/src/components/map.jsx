import React from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './map-marker';

function SimpleMap({ uniquePlaces }) {
  let count = 0;

  const defaultProps = {
    center: {
      lat: uniquePlaces[0].geometry.location.lat,
      lng: uniquePlaces[0].geometry.location.lng,
    },
    zoom: 12,
  };

  const K_MARGIN_TOP = 30;
  const K_MARGIN_RIGHT = 30;
  const K_MARGIN_BOTTOM = 30;
  const K_MARGIN_LEFT = 30;

  return (
    <div style={{ height: '600px', width: '600px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        margin={[K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT]}
      >
        {uniquePlaces.map((place) => {
          count++;
          return (
            <MapMarker
              key={count}
              lat={place.geometry.location.lat}
              lng={place.geometry.location.lng}
              text={count}
            />
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default SimpleMap;
