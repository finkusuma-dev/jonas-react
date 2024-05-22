import { useParams , useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './City.module.css';
import { useCities } from '../contexts/CitiesContext';
import Spinner from './Spinner';
import BackButton from './BackButton';
import Button from './Button';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function City() {
  const { isLoading, getCity, currentCity } = useCities();
  const navigate = useNavigate();

  const { id } = useParams();
  // console.log('cityId', id);

  useEffect(() => {
    if (id) {
      getCity(id);
    }
  }, [id]); /// Warning: add getCity on dependencies array made it loop

  const [searchParams, setSearchParams] = useSearchParams();

  const cityAdded = searchParams.get('added');

  if (isLoading) return <Spinner />;

  const { cityName, country, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}, {country}
        </h3>
      </div>
      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>
      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}
      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        {cityAdded ? (
          <Button
            type="back"
            onClick={(e) => {
              e.preventDefault();
              navigate('/app/cities');
            }}
          >
            &larr; Back
          </Button>
        ) : (
          <BackButton />
        )}
      </div>
    </div>
  );
}

export default City;
