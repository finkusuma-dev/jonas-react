import { useState, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "inc": return state + 1;
    case "dec": return state - 1;
    case "setCount": return action.payload;
  }
}

function DateCounter() {
  // const [count, setCount] = useState(0);
  const [count, dispatch] = useReducer(reducer, 0);
  const [step, setStep] = useState(1);

  // This mutates the date object.
  const date = new Date();
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
    dispatch({'type': 'dec'});
  };
  
  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);
    dispatch({'type': 'dec'});
  };
  
  const defineCount = function (e) {
    // setCount(Number(e.target.value));
    dispatch({'type': 'setCount', payload: Number(e.target.value)});
  };

  const defineStep = function (e) {
    setStep(Number(e.target.value));
  };

  const reset = function () {
    // setCount(0);
    dispatch({'type': 'setCount', payload: 0 });
    setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
