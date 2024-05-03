import PropTypes from 'prop-types';

Options.propTypes = {
  question: PropTypes.object,
  dispatch: PropTypes.any,
  answer: PropTypes.number,
};

function Options({ question, dispatch, answer }) {
  return (
    <div className="options">
      {question.options.map((option, i) => {
        let classCorrectOrWrong =
          answer != null &&
          (i === question.correctOption ? 'correct' : 'wrong');
        let classAnswer = i === answer ? 'answer' : '';
        return (
          <button
            className={`btn btn-option ${classCorrectOrWrong} ${classAnswer}`}
            key={option}
            disabled={answer !== null}
            onClick={() => dispatch({ type: 'newAnswer', payload: i })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
