import { createSlice } from "@reduxjs/toolkit";

const initialState = { // empty cart!
  isCartOpen: false,
  cart: [],  // state.cart.cart in `Navbar`
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // set items
    setItems: (state, action) => {
      state.items = action.payload;
    },
    // add to cart
    addToCart: (state, action) => {
      state.cart = [...state.cart, action.payload.item];
    },
    // remove from cart
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },

    // increase quantity
    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          item.count++;
        }
        return item;
      });
    },

    // decrease quantity
    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.count > 1) {
          item.count--;
        }
        return item;
      });
    },

    // the cart is open
    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  setItems,
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  setIsCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
