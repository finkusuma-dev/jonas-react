import { createContext } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useContext } from 'react';
import { useEffect } from 'react';

const DarkModeContext = createContext();

DarkModeProvider.propTypes = {
  children: PropTypes.any,
};

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
    'isDarkMode'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  function toggleDarkMode() {
    // console.log('toggleDarkMode');

    setIsDarkMode((dark) => !dark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export default DarkModeProvider;
