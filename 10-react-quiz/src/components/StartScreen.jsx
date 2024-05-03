import PropTypes from 'prop-types';

StartScreen.propTypes = {
  numQuestions: PropTypes.number,
  dispatch: PropTypes.any,
};

function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz</h2>
      <h3>{numQuestions} questions to test your React master</h3>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: 'start' });
        }}
      >
        Let&apos;s Start
      </button>
    </div>
  );
}

export default StartScreen;
