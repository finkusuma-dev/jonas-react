import { useParams, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
import styles from './City.module.css';
import { useCities } from '../contexts/CitiesContext';
import Spinner from './Spinner';
import { useEffect } from 'react';
import Button from './Button';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function City() {
  const navigate = useNavigate();
  const { isLoading, getCity, currentCity } = useCities();

  const { id } = useParams();
  // console.log('cityId', id);

  useEffect(() => {
    if (id) {
      getCity(id);
    }
  }, [id]); /// Warning: add getCity on dependencies array made it loop

  // const [searchParams, setSearchParams] = useSearchParams();

  // const lat = searchParams.get('lat');
  // const lng = searchParams.get('lng');
  // console.log('id', params.id);

  // TEMP DATA
  // const currentCity = {
  //   cityName: 'Lisbon',
  //   emoji: '🇵🇹',
  //   date: '2027-10-31T15:59:59.138Z',
  //   notes: 'My favorite city so far!',
  // };

  if (isLoading) return <Spinner />;

  // return (
  //   <>
  //     <div className={styles.city}>City {id}</div> <div>lat= {lat}</div>
  //     <div>lng= {lng}</div>
  //   </>
  // );

  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
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
      
      <Button
        type="back"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        &larr; Back
      </Button>
    </div>
  );
}

export default City;
