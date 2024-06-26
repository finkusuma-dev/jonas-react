import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullname: '',
  nationalID: '',
  createdAt: '',
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    create: {
      prepare(fullName, nationalId){
        return {
          payload: {
            fullName: fullName,
            nationalId,
            createdAt: new Date().toDateString(),
          }
        }
      },      
      reducer(state, action) {
        console.log('customer/create action', action);
        state.fullname = action.payload.fullName;
        state.nationalID = action.payload.nationalId;
        state.createdAt = action.payload.createdAt;
      },
    },
    updateName(state, action) {
      state.fullname = action.payload;
    },
  },
});

export const { actions: CustomerActions } = customerSlice;
export default customerSlice.reducer;

// function customerReducer(state = initialStateCustomer, action) {
//   switch (action.type) {
//     case 'customer/create':
//       return {
//         ...state,
//         fullname: action.payload.fullname,
//         nationalID: action.payload.nationalID,
//         createdAt: action.payload.createdAt,
//       };
//     case 'customer/updateName':
//       return {
//         ...state,
//         fullname: action.payload,
//       };
//     default:
//       return state;
//   }
// }

// class CustomerAction {
//   static create(fullname, nationalID) {
//     return {
//       type: 'customer/create',
//       payload: {
//         fullname,
//         nationalID,
//         createdAt: new Date().toISOString(),
//       },
//     };
//   }
//   static updateName(fullname) {
//     return {
//       type: 'customer/updateName',
//       payload: fullname,
//     };
//   }
// }

// export default customerReducer;
// export { CustomerAction };
