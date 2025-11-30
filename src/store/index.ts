import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import productsReducer from "./slices/productsSlice";
import sliderReducer from "./slices/sliderSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer,
    sliders: sliderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
