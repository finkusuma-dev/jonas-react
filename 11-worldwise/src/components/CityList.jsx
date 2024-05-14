import PropTypes from 'prop-types';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';

CityList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool
};


function CityList({ isLoading, cities }) {
  if (isLoading) {
    return <Spinner />
  }
  if (!cities.length)
    return <Message message='Add your first city by start clicking on the Map' />

  return (
    <ul className={styles.cityList}>
      {cities.map(function (city) {
        return <CityItem key={city.id} city={city} />
      })}
    </ul>
  );
}

export default CityList;
