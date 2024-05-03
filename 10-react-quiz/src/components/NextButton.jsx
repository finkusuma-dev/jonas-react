import PropTypes from 'prop-types';

NextButton.propTypes = {
  answer: PropTypes.number,
  dispatch: PropTypes.any,
};

function NextButton({ answer, dispatch }) {
  
  return answer !== null && (
    <div
      className="btn btn-ui"
      onClick={() => dispatch({ type: 'nextQuestion' })}
    >
      Next
    </div>
  );
}

export default NextButton;
