const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case 'account/deposit':
      return { ...state, balance: state.balance + action.payload };
    case 'account/withdrawal':
      return { ...state, balance: state.balance - action.payload };
    case 'account/requestLoan':
      if (state.loan > 0) return state;
      
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

class AccountAction {
  static deposit(amount) {
    return { type: 'account/deposit', payload: amount };
  }
  static withdrawal(amount) {
    return { type: 'account/withdrawal', payload: amount };
  }
  static requestLoan(loan, purpose) {
    return {
      type: 'account/requestLoan',
      payload: {
        loan,
        purpose,
      },
    };
  }

  static payLoan() {
    return { type: 'account/payLoan' };
  }
}

export default accountReducer;
export { AccountAction };
