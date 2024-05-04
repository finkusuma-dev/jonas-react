import PropTypes from 'prop-types';
import { useEffect } from 'react';

Timer.propTypes = {
  secondsRemaining: PropTypes.number,
  dispatch: PropTypes.any,
};

function Timer({ secondsRemaining, dispatch }) {

  const minutes= Math.floor(secondsRemaining / 60).toString().padStart(2,'0');
  const seconds = (secondsRemaining % 60).toString().padStart(2,'0');

  const timeRemaining = `${minutes} : ${seconds}`;

  useEffect(() => {
    // console.log('Timer useEffect');
    const id = setInterval(function () {
      // console.log('interval');
      dispatch({type: 'decreaseSecondsRemaining'})
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch]);

  return <div className="timer">{timeRemaining}</div>;
}

export default Timer;
