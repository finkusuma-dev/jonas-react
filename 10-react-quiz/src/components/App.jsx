import Header from './Header';
import Content from './Content';
import { useEffect } from 'react';
import { useReducer } from 'react';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Timer from './Timer';

const SECONDS_PER_QUESTION= 15;

let initialData = {
  questions: [],
  /// loading, error, ready, active, finished
  status: 'loading',
  questionIndex: 0,
  answer: null,
  points: 0,
  highscore: 20,
  secondsRemaining: null,
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
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
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
    case 'nextQuestion':
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        answer: null,
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialData,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore      
      };
    case 'decreaseSecondsRemaining': {      
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining - 1 === 0 ? 'finished' : state.status,
      };
    }
    default:
      throw new Error('Action is unknown');
  }
}

function App() {
  const [
    {
      questions,
      status,
      questionIndex,
      answer,
      points,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialData);

  let overallPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

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
          <>
            <Progress
              answer={answer}
              index={questionIndex}
              numQuestions={questions.length}
              points={points}
              overallPoints={overallPoints}
            />
            <Question
              question={questions[questionIndex]}
              dispatch={dispatch}
              answer={answer}
              points={points}
            />
            <footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                answer={answer}
                dispatch={dispatch}
                questionIndex={questionIndex}
                numQuestions={questions.length}
              />
            </footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            overallPoints={overallPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Content>
    </div>
  );
}

export default App;
