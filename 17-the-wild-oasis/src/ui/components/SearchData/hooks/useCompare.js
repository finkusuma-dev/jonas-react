import { useEffect } from 'react';

function useCompare({
  newValue,
  prevValue,
  callbackFn,
  extraCondition = true,
}) {
  const isSameData = JSON.stringify(newValue) === JSON.stringify(prevValue);
  // console.log(
  //   'useCompare condition',
  //   condition,
  //   'isSameData',
  //   isSameData,
  //   JSON.stringify(newValue)
  // );
  // console.log('extraCondition', extraCondition);
  useEffect(() => {
    if (!isSameData && extraCondition) {
      callbackFn(newValue);
    }
  }, [isSameData, extraCondition, newValue, callbackFn]);
}

export default useCompare;
