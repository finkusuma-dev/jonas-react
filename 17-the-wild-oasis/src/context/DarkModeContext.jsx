import { createContext } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useContext } from 'react';

const DarkModeContext = createContext();

DarkModeProvider.propTypes = {
  children: PropTypes.any,
};

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    console.log('toggleDarkMode');

    setIsDarkMode((dark) => {
      // console.log('isDarkMode', isDarkMode);

      return !dark;
    });

    if (!isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);

export default DarkModeProvider;
