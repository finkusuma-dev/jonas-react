import PropTypes from 'prop-types';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';

CountryList.propTypes = {
  countries: PropTypes.array,
};

function CountryList({ countries }) {
  return (
    <ul className={styles.countryList}>
      {countries.map(country => 
        <CountryItem key={country.country} country={country}/>
      )}
    </ul>
  );
}

export default CountryList;
