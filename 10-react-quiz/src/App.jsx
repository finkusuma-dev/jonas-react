import Header from './Header';
import Content from './Content';
import { useEffect } from 'react';
import { useReducer } from 'react';

let initialData = {
  questions: {},
  status: 'Loading',
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
    default:
      throw new Error('Action is unknown');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialData);

  useEffect(function () {
    fetch('http://localhost:6700/questions')
      .then((res) => res.json())
      .then((data) => {
        console.log('json', data);
        dispatch({ type: 'dataReceived', payload: data });
      })
      .catch((err) => {
        console.error(err);
        dispatch({type: 'dataFailed'});
      });
  }, []);

  return (
    <main className="main">
      <Header />
      <Content>
        <p>1/5</p>
        <p>Question</p>
      </Content>
    </main>
  );
}

export default App;
