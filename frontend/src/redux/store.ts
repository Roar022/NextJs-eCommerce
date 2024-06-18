import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
export const store = configureStore({
  // takes  and previous state and change it to new value
  reducer: {
    cart:cartSlice,
  },
  devTools: process.env.NODE_ENV !== "production",

});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
