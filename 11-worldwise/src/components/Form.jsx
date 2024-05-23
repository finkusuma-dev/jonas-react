// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUrlPosition } from '../hooks/useUrlPosition';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import Spinner from './Spinner';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

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
  const [emoji, setEmoji] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [lat, lng] = useUrlPosition();
  const [errorGeocoding, setErrorGeocoding] = useState('');
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const { addCity, isLoading } = useCities();
  const navigate = useNavigate();

  // const [searchParams] = useSearchParams();
  // const lat = searchParams.get('lat');
  // const lng = searchParams.get('lng');

  useEffect(
    function () {
      async function fetchGeocoding() {
        if (!lat || !lng) return;

        setIsLoadingGeocoding(true);
        setErrorGeocoding('');
        try {
          const res = await fetch(
            `${BASE_URL_GEOCODING}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log('geocoding data', data);

          if (!data.countryCode) {
            throw new Error(
              "It doesn't seems to be a city. Click somewhere else 😉!"
            );
          }

          setCityName(data.city || data.locality || '');
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
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

  async function handleAddCity(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    let newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      },
    };
    newCity = await addCity(newCity);
    
    navigate(`../cities/${newCity.id}?added=true`);
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (errorGeocoding) return <Message message={errorGeocoding} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {`${cityName}, ${country}`}?</label>        
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={'EEE, dd MMM yyyy'}
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
        <Button type="primary" onClick={handleAddCity}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
