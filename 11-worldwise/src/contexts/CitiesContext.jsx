import React, { useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

export const BASE_URL = 'http://localhost:8000';

const CitiesContext = React.createContext();

const initialData = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return { ...state, isLoading: true };
    }
    // case 'setNotLoading': {
    //   return { ...state, isLoading: false };
    // }
    case 'rejected': {
      return { ...state, error: action.payload, isLoading: false };
    }
    case 'cities/loaded': {
      return { ...state, cities: action.payload, isLoading: false };
    }
    case 'currentCity/set': {
      return { ...state, currentCity: action.payload, isLoading: false };
    }
    case 'cities/added': {
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    }
    case 'cities/removed': {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    }
    default:
      throw new Error(`Action ${action.type} is unknown!`);
  }
}

CitiesProvider.propTypes = {
  children: PropTypes.any,
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialData
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  // const [error, setError] = useState('');

  useEffect(function () {
    fetchCities();
  }, []);

  async function fetchCities() {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      // console.log('data', data);
      dispatch({ type: 'cities/loaded', payload: data });
    } catch {
      console.log('Loading cities from api failed!');
    }
  }

  async function getCity(id) {
    if (id === currentCity.id) return;

    console.log('> getCity',id);
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      // console.log('res', res);
      const data = await res.json();
      // console.log('current city data', data);
      dispatch({ type: 'currentCity/set', payload: data }); 
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'Failed to add new city!' });
    }
  }

  async function addCity(newCity) {
    dispatch({ type: 'loading' });
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
      dispatch({
        type: 'cities/added',
        payload: data,
      });
      return data;
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'Failed to add new city!' });
    }
  }

  async function removeCity(cityId) {
    dispatch({ type: 'loading' });
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
      dispatch({ type: 'cities/removed', payload: cityId });
      if (currentCity.id === cityId) {
        dispatch({ type: 'currentCity/set', payload: {} });
      }

      return data;
    } catch (err) {
      dispatch({ type: 'rejected', payload: 'Failed to remove new city!' });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
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
