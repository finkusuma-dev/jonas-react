import { createStore, combineReducers, compose } from 'redux';
import accountReducer from './features/accounts/accountSlice';
import customerReducer from './features/customers/customerSlice';
import { applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() /// enable browser extension
);

export default store;
