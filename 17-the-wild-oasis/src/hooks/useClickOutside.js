import { useRef } from 'react';
import { useEffect } from 'react';

function useClickOutside(onClick, listenInCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          onClick();
        }
      }

      document.addEventListener('click', handleClick, listenInCapturing);

      return () => document.removeEventListener('click', handleClick);
    },
    [onClick, listenInCapturing]
  );

  return ref;
}

export default useClickOutside;
