import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = React.createContext();

CitiesProvider.propTypes = {
  children: PropTypes.any,
};

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        setIsLoading,
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
