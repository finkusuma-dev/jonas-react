import Header from './Header';
import Content from './Content';
import { useEffect } from 'react';
import { useReducer } from 'react';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';

let initialData = {
  questions: [],
  /// loading, error, ready, active, finished
  status: 'loading',
  questionIndex: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
      };
    case 'newAnswer': {
      let answer = action.payload;
      let answerPoints =
        answer === state.questions[state.questionIndex].correctOption
          ? state.questions[state.questionIndex].points
          : 0;
      return {
        ...state,
        answer: answer,
        points: state.points + answerPoints,
      };
    }
    default:
      throw new Error('Action is unknown');
  }
}

function App() {
  const [{ questions, status, questionIndex, answer, points }, dispatch] =
    useReducer(reducer, initialData);

  useEffect(function () {
    fetch('http://localhost:6700/questions')
      .then((res) => res.json())
      .then((data) => {
        console.log('json', data);
        dispatch({ type: 'dataReceived', payload: data });
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: 'dataFailed' });
      });
  }, []);

  return (
    <div className="app">
      <Header />
      <Content>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={questions.length} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <Question
            question={questions[questionIndex]}
            dispatch={dispatch}
            answer={answer}
            points={points}
          />
        )}
      </Content>
    </div>
  );
}

export default App;
