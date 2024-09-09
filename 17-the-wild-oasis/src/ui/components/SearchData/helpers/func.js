export function processTimeout(refTimeout, callback, ms = 500) {
  if (refTimeout.current) {
    // console.log('clear timeout', refTimeout.current);
    clearTimeout(refTimeout.current);
  }

  refTimeout.current = setTimeout(() => {
    callback();
    refTimeout.current = null;
  }, ms);
  // console.log('set timeout', refTimeout.current);
}
