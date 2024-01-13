import { useState, useEffect } from 'react';

export function useLocalStorageState(initialState, storageKey) {
  const [value, setValue] = useState(function () {
    const serData = localStorage.getItem(storageKey);
    if (serData.length) {
      return JSON.parse(serData);
    }
    return initialState;
  });

  useEffect(
    /// put watched to localstorage
    function () {
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    [value, storageKey]
  );

  return [ value, setValue ];
}
