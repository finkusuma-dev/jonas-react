import PropTypes from 'prop-types';
import styles from './CityItem.module.css';
import { Link } from 'react-router-dom';
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // weekday: "long",
  }).format(new Date(date));

CityItem.propTypes = {
  city: PropTypes.object,
};

function CityItem({ city }) {
  // console.log('city', city);
  const { currentCity, removeCity } = useCities();

  const position = city.position;

  async function handleRemoveCity(e, cityId) {  
    //e.stopPropagation();
    e.preventDefault();      
    await removeCity(cityId);    
  }

  return (
    <li>
      <Link
        to={`${city.id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          currentCity.id === city.id ? styles['cityItem--active'] : ''
        }`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.date}>({formatDate(city.date)})</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {            
            handleRemoveCity(e, city.id);
          }}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
