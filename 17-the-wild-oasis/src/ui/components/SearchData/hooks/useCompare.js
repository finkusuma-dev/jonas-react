import { useEffect } from 'react';

function useCompare({ newValue, prevValue, callbackFn }) {
  const isSameData = JSON.stringify(newValue) === JSON.stringify(prevValue);

  useEffect(() => {
    if (!isSameData) {
      callbackFn(newValue);
    }
  }, [isSameData, newValue, callbackFn]);
}

export default useCompare;
