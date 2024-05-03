import PropTypes from 'prop-types';
import Options from './Options';

Question.propTypes = {
  question: PropTypes.object
}

function Question({question}) {
  console.log('question', question);
  return (
    <div>
      <h4>{question.question}</h4>
      <Options options={question.options}/>
    </div>
  )
}

export default Question
