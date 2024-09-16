export function processTimeout(refTimeout, callback, ms = 700) {
  // if (refTimeout.current) {
  //   // console.log('clear timeout', refTimeout.current);
  //   clearTimeout(refTimeout.current);
  //   refTimeout.current = undefined;
  // }
  cancelTimeout(refTimeout);

  refTimeout.current = setTimeout(() => {
    callback();
    refTimeout.current = undefined;
  }, ms);
  // console.log('set timeout', refTimeout.current);
}

export function cancelTimeout(refTimeout) {
  if (refTimeout.current) {
    clearTimeout(refTimeout.current);
    refTimeout.current = undefined;
  }
}
