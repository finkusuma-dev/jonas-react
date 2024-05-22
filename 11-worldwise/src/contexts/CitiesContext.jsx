import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const BASE_URL = 'http://localhost:8000';

const CitiesContext = React.createContext();

CitiesProvider.propTypes = {
  children: PropTypes.any,
};

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const [error, setError] = useState('');

  useEffect(function () {
    fetchCities();
  }, []);

  async function fetchCities() {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      console.log('data', data);
      setCities(data);
    } catch {
      console.log('Loading cities from api failed!');
    } finally {
      setIsLoading(false);
    }
  }

  async function getCity(id) {
    console.log('> getCity');
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      console.log('res', res);
      const data = await res.json();
      console.log('current city data', data);
      setCurrentCity(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function addCity(newCity) {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      console.log('addCity post data', data);
      setCities((cities) => [...cities, data]);
      return data;
    } catch (err) {
      setError('Failed to add new city!');
    } finally {
      setIsLoading(false);
    }
  }

  async function removeCity(cityId) {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/cities/${cityId}`, {
        method: 'DELETE',
        eaders: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      const data = await res.json();
      console.log('delete city data', data);
      if (currentCity.id === cityId) setCurrentCity({});
      setCities((cities) => cities.filter((city) => city.id !== data.id));
      return data;
    } catch (err) {
      setError('Failed to remove city!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        setIsLoading,
        currentCity,
        fetchCities,
        getCity,
        addCity,
        removeCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}

export { CitiesProvider, useCities };
