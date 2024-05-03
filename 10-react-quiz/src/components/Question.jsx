import PropTypes from 'prop-types';
import Options from './Options';

Question.propTypes = {
  question: PropTypes.object,
  dispatch: PropTypes.any,
  answer: PropTypes.number,
  points: PropTypes.number
}

function Question({question, dispatch, answer, points}) {
  console.log('question', question);
  return (
    <div>
      <div>Points= {points}</div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer}/>
    </div>
  )
}

export default Question
