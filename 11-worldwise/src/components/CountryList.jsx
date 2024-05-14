import PropTypes from 'prop-types';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Spinner from './Spinner';
// import Message from './Message';

CountryList.propTypes = {
  isLoading: PropTypes.bool,
  cities: PropTypes.array,
};

function CountryList({ isLoading, cities }) {
  if (isLoading) return <Spinner />;

  const countries = cities.reduce(
    (acc, city) =>
      !acc.find((accEl) => accEl.country === city.country)
        ? [...acc, { emoji: city.emoji, country: city.country }]
        : acc,
    []
  );

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
