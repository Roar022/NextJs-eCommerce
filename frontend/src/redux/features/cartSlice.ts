import { Games } from "@/models/games";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CartState {
  showCart: boolean;
  cartItems: Games[];
}

const cartFromLocalStorage =
  typeof localStorage !== "undefined" && localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")!)
    : [];

const initialState: CartState = {
  showCart: false,
  cartItems: cartFromLocalStorage,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart(state) {
      state.showCart = !state.showCart;
    },
    addItemToCart: (state, action: PayloadAction<Games>) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );
      if (existingItem) {
        existingItem.quantity = newItem.quantity;
      } else {
        state.cartItems.push(newItem);
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    removeItemFromCart: (state, action: PayloadAction<{ _id: string }>) => {
      const itemId = action.payload._id;
      // const updatedState = state.cartItems.filter((item) => item._id !== itemId);
      // state.cartItems.splice(0, state.cartItems.length, ...updatedState);
      state.cartItems = state.cartItems.filter((item)=>item._id!==itemId);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
  },
});
export const { toggleCart, addItemToCart, removeItemFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;

