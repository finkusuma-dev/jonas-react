import { createStore, combineReducers } from 'redux';

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
};

const initialStateCustomer = {
  fullname: '',
  nationalID: null,
  createdAt: null,
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case 'account/deposit':
      return { ...state, balance: state.balance + action.payload };
    case 'account/withdrawal':
      return { ...state, balance: state.balance - action.payload };
    case 'account/requestLoan':
      return {
        ...state,
        loan: action.payload.loan,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.loan,
      };
    case 'account/payLoan':
      return {
        ...state,
        loan: 0,
        loanPurpose: '',
        balance: state.balance - state.loan,
      };

    default:
      return state;
  }
}

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case 'customer/create':
      return {
        ...state,
        fullname: action.payload.fullname,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };

    default: return state;
  }
}

class Action {
  static accountDeposit(amount) {
    return { type: 'account/deposit', payload: amount };
  }
  static accountWithdrawal(amount) {
    return { type: 'account/withdrawal', payload: amount };
  }
  static accountRequestLoan(loan, purpose) {
    return {
      type: 'account/requestLoan',
      payload: {
        loan,
        purpose,
      },
    };
  }

  static accountPayLoan() {
    return { type: 'account/payLoan' };
  }

  static customerCreate(fullname, nationalID) {
    return {
      type: 'customer/create',
      payload: {
        fullname,
        nationalID,
        createdAt: new Date().toISOString(),
      },
    };
  }
}

const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer
})

const store = createStore(rootReducer);
store.dispatch(Action.customerCreate('Rome','1001'));
console.log('store after customer create', store.getState());
store.dispatch(Action.accountDeposit(500));
console.log('store after deposit', store.getState());
store.dispatch(Action.accountWithdrawal(250));
console.log('store after withdrawal', store.getState());
store.dispatch(Action.accountRequestLoan(1000, 'Buy notebook'));
console.log('store after request loan', store.getState());
store.dispatch(Action.accountPayLoan());
console.log('store after pay loan', store.getState());
