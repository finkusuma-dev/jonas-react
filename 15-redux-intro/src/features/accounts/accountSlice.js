import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isLoading: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    convertingCurrency(state) {
      state.isLoading = true;
    },
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdrawal(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(loanAmount, loanPurpose) {
        return {
          payload: {
            loanAmount,
            loanPurpose,
          },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.loanAmount;
        state.loanPurpose = action.payload.loanPurpose;
        state.balance += action.payload.loanAmount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = '';
    },
  },
});

function deposit(amount, currency) {
  if (currency === 'USD') return { type: 'account/deposit', payload: amount };

  /// Using thunk middleware to fetch API to get converted amount of currency.
  return async function (dispatch, getState) {
    dispatch({ type: 'account/convertingCurrency' });

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const convertedAmount = await data.rates.USD;
    dispatch({ type: 'account/deposit', payload: convertedAmount });
    console.log('getState', getState());
  };
}

export const AccountActions = { ...accountSlice.actions, deposit };
export default accountSlice.reducer;

// function accountReducer(state = initialStateAccount, action) {
//   switch (action.type) {
//     case 'account/convertingCurrency':
//       return { ...state, isLoading: true };
//     case 'account/deposit':
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case 'account/withdrawal':
//       return { ...state, balance: state.balance - action.payload };
//     case 'account/requestLoan':
//       if (state.loan > 0) return state;

//       return {
//         ...state,
//         loan: action.payload.loan,
//         loanPurpose: action.payload.purpose,
//         balance: state.balance + action.payload.loan,
//       };
//     case 'account/payLoan':
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: '',
//         balance: state.balance - state.loan,
//       };

//     default:
//       return state;
//   }
// }

// class AccountAction {
//   static deposit(amount, currency) {
//     if (currency === 'USD') return { type: 'account/deposit', payload: amount };

//     /// Using thunk middleware to fetch API to get converted amount of currency.
//     return async function (dispatch, getState) {
//       dispatch({ type: 'account/convertingCurrency' });

//       const res = await fetch(
//         `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
//       );
//       const data = await res.json();
//       const convertedAmount = await data.rates.USD;
//       dispatch({ type: 'account/deposit', payload: convertedAmount });
//       console.log('getState', getState());
//     };
//   }
//   static withdrawal(amount) {
//     return { type: 'account/withdrawal', payload: amount };
//   }
//   static requestLoan(loan, purpose) {
//     return {
//       type: 'account/requestLoan',
//       payload: {
//         loan,
//         purpose,
//       },
//     };
//   }

//   static payLoan() {
//     return { type: 'account/payLoan' };
//   }
// }

// export default accountReducer;
// export { AccountAction };
