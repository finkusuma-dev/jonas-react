const initialStateCustomer = {
  fullname: '',
  nationalID: '',
  createdAt: '',
};

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case 'customer/create':
      return {
        ...state,
        fullname: action.payload.fullname,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case 'customer/updateName':
      return {
        ...state,
        fullname: action.payload,
      };
    default:
      return state;
  }
}

class CustomerAction {
  static create(fullname, nationalID) {
    return {
      type: 'customer/create',
      payload: {
        fullname,
        nationalID,
        createdAt: new Date().toISOString(),
      },
    };
  }
  static updateName(fullname) {
    return {
      type: 'customer/updateName',
      payload: fullname,
    };
  }
}

export default customerReducer;
export { CustomerAction };
