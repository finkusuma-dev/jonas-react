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

  useEffect(function () {
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
    
    fetchCities();
  }, []);
  
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

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        setIsLoading,
        currentCity,
        getCity,
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
