import { createSlice } from '@reduxjs/toolkit';

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
// ];

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  initialState,
  name: 'cart',
  reducers: {
    addItem: function (state, action) {
      /* 
        payload: {
          pizzaId,
          name,
          quantity,
          unitPrice,
          totalPrice
        }
      */

      state.cart.push(action.payload);
    },
    deleteItem: function (state, action) {
      /**
       *  payload = pizzaId
       */
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    clearCart: function (state) {
      state.cart = [];
    },
    incItemQuantity: function (state, action) {
      /**
       * payload = pizzaId
       */

      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decItemQuantity: function (state, action) {
      /**
       * payload = id
       */
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
  },
});

// NOTE: Using selectors like this can decrease performance in a big app, so you should use `reselect` for that.
const getCart = (store) => store.cart.cart;
const getTotalCartQuantity = (store) =>
  store.cart.cart.reduce((acc, item) => acc + item.quantity, 0);
const getTotalCartPrice = (store) =>
  store.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0);
const getItemQuantityById = (id) => (store) =>
  store.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;

export const cartGetters = {
  getCart,
  getTotalCartPrice,
  getTotalCartQuantity,
  getItemQuantityById,
};
export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
