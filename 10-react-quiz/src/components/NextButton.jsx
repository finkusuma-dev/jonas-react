import PropTypes from 'prop-types';

NextButton.propTypes = {
  answer: PropTypes.number,
  dispatch: PropTypes.any,
  questionIndex: PropTypes.number,
  numQuestions: PropTypes.number,
};

function NextButton({ answer, dispatch, questionIndex, numQuestions }) {
  if (questionIndex + 1 === numQuestions) {    
    return (
      answer !== null && (
        <div
          className="btn btn-ui"
          onClick={() => dispatch({ type: 'finish' })}
        >
          Finish
        </div>
      )
    );
  }

  return (
    answer !== null && (
      <div
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </div>
    )
  );
}

export default NextButton;
