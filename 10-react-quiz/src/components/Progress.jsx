import PropTypes from 'prop-types';

Progress.propTypes = {
  index: PropTypes.number,
  numQuestions: PropTypes.number,
  points: PropTypes.number,
  overallPoints: PropTypes.number,
  answer: PropTypes.number,
};

function Progress({ answer, index, numQuestions, points, overallPoints }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong>/{overallPoints}
      </p>
    </header>
  );
}

export default Progress;
