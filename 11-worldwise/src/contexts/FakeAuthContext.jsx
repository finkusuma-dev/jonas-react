import React from 'react';
import PropTypes from 'prop-types';
import { useReducer } from 'react';
import { useContext } from 'react';

const FakeAuthContext = React.createContext();

const initialState = {
  user: {},
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'logout':
      return { ...state, user: {}, isAuthenticated: false };

    default:
      throw new Error('Action is unknown');
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

FakeAuthProvider.propTypes = {
  children: PropTypes.any,
};

function FakeAuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login({ email, password }) {
    if (email === FAKE_USER.email && password == FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER });
    }
  }
  function logout() {    
    dispatch({ type: 'logout'});    
  }

  return (
    <FakeAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </FakeAuthContext.Provider>
  );
}

const useAuth = () => useContext(FakeAuthContext);

export { FakeAuthProvider, useAuth };
