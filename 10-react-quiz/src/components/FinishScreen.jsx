import PropTypes from 'prop-types';

FinishScreen.propTypes = {
  points: PropTypes.number,
  overallPoints: PropTypes.number,
  highscore: PropTypes.number,
  dispatch: PropTypes.any,
};

function FinishScreen({ points, overallPoints, highscore, dispatch }) {
  let percentage = (points / overallPoints) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {overallPoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className='highscore'>(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'restart' })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
