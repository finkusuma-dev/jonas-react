import PropTypes from 'prop-types';
import styles from './Map.module.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  const { cities } = useCities();
  const navigate = useNavigate();
  const [lat,lng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    getPosition: getGeoLocationPosition,
    position: geoLocationPosition,
  } = useGeolocation();
  

  console.log('params lat,lng', lat, lng);
  console.log('geoLocationPosition', geoLocationPosition);

  useEffect(
    function () {      
      if (lat !== null && lng != null){        
        setMapPosition([lat, lng]);
      }
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
        // navigate(
        //   `form?lat=${geoLocationPosition.lat}&lng=${geoLocationPosition.lng}`
        // );
    },
    [geoLocationPosition, navigate]
  );

  console.log('mapPosition', mapPosition);

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={() => getGeoLocationPosition()}>{`${
        isLoadingPosition ? 'Loading...' : 'Use your position'
      }`}</Button>
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>{' '}
              <span>
                {city.cityName}, {city.country}
              </span>
              {/* <br />              
              {city.notes} */}
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <MapEvent />
      </MapContainer>
    </div>
  );
}

ChangeCenter.propTypes = {
  position: PropTypes.array,
};

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return <></>;
}

function MapEvent() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      // console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
