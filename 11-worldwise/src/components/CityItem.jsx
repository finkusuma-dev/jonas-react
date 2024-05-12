import PropTypes from 'prop-types';
import styles from './CityItem.module.css';
// import { NavLink } from 'react-router-dom';


const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // weekday: "long",
  }).format(new Date(date));

CityItem.propTypes = {
  city: PropTypes.object,
};

function CityItem({ city }) {

  // console.log('city', city);

  return (
    <li className={styles.cityItem}>
      {/* <NavLink to={`app/cities/${city.id}`}> */}
        <span className={styles.emoji}>{city.emoji}</span> 
        <span className={styles.name}>{city.cityName}</span> 
        <span className={styles.date}>({formatDate(city.date)})</span>
        <button className={styles.deleteBtn}>&times;</button>
      {/* </NavLink> */}
    </li>
  );
}

export default CityItem;
