// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import { useEffect } from 'react';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Spinner from './Spinner';
import Message from './Message';

const BASE_URL_GEOCODING =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [errorGeocoding, setErrorGeocoding] = useState('');
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  // const [searchParams] = useSearchParams();
  // const lat = searchParams.get('lat');
  // const lng = searchParams.get('lng');

  useEffect(
    function () {
      async function fetchGeocoding() {
        setIsLoadingGeocoding(true);
        setErrorGeocoding('');
        try {
          const res = await fetch(
            `${BASE_URL_GEOCODING}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          // console.log('geocoding data', !data.countryCode);
          
          if (!data.countryCode) {
            throw new Error(
              "It doesn't seems to be a city. Click somewhere else 😉!"
            );
          }
          
          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setCountryCode(convertToEmoji(data.countryCode));
        } catch (err) {
          console.log(err);
          setErrorGeocoding(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchGeocoding();
    },
    [lat, lng]
  );

  if (isLoadingGeocoding) return <Spinner />;

  if (errorGeocoding) return <Message message={errorGeocoding} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{countryCode}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {`${cityName}`}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
