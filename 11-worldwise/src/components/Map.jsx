import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Map.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useEffect } from 'react';

function Map() {
  // const navigate = useNavigate();
  const { cities } = useCities();

  const [searchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const lat = Number.parseFloat(searchParams.get('lat'));
  const lng = Number.parseFloat(searchParams.get('lng'));

  useEffect(
    function () {
      if (!(lat && lng)) return;
      // const position = [lat, lng];
      // console.log('map pos', position);
      setMapPosition([lat, lng]);
    },
    [lat, lng]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={5}
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

export default Map;
