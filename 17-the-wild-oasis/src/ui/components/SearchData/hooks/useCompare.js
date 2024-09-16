import { useEffect } from 'react';
/**
 * Custom hook that compares `newValue` and `oldValue` using deep equality, and triggers a callback
 * when the values are different and an optional condition is met.
 *
 * @param {Object} params - The parameters object.
 * @param {*} params.newValue - The new value to compare.
 * @param {*} params.oldValue - The old value to compare.
 * @param {Function} params.callbackFn - The function to call when `newValue` is different from `oldValue`.
 * @param {boolean} [params.additionalCondition=true] - An additional condition that must be true for `callbackFn` to be invoked.
 *
 * @returns {void}
 *
 * @example
 * useCompare({
 *   newValue: currentData,
 *   oldValue: previousData,
 *   callbackFn: handleDataChange,
 *   additionalCondition: isFormValid
 * });
 */
function useCompare({
  newValue,
  oldValue,
  callbackFn,
  additionalCondition = true,
}) {
  const isSameData = JSON.stringify(newValue) === JSON.stringify(oldValue);
  // console.log(
  //   'useCompare condition',
  //   condition,
  //   'isSameData',
  //   isSameData,
  //   JSON.stringify(newValue)
  // );
  // console.log('extraCondition', extraCondition);
  useEffect(() => {
    if (!isSameData && additionalCondition) {
      callbackFn();
    }
  }, [isSameData, additionalCondition, callbackFn]);
}

export default useCompare;
