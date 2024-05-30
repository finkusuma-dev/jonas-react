import { useState } from 'react';
import { useEffect } from 'react';

function formatTime(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

function useTime() {
  const [time, setTime] = useState(formatTime(new Date()));


  useEffect(function () {
    const id = setInterval(function () {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return { time };
}

export default useTime;
