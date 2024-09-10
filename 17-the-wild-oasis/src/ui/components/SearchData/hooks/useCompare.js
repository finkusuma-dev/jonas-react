import { useEffect } from 'react';

function useCompare({ newValue, prevValue, callbackFn, condition = true }) {
  const isSameData = JSON.stringify(newValue) === JSON.stringify(prevValue);
  // console.log(
  //   'useCompare condition',
  //   condition,
  //   'isSameData',
  //   isSameData,
  //   JSON.stringify(newValue)
  // );

  useEffect(() => {
    if (!isSameData && condition) {
      callbackFn(newValue);
    }
  }, [isSameData, condition, newValue, callbackFn]);
}

export default useCompare;
