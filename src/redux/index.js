import { configureStore } from "@reduxjs/toolkit";
import priceReducer from "./slices/priceSlice";
import alertReducer from "./slices/alertSlice";
import historyReducer from "./slices/historySlice";
import swapReducer from "./slices/swapSlice";

export const store = configureStore({
  reducer: {
    price: priceReducer,
    alert: alertReducer,
    history: historyReducer,
    swap: swapReducer,
  },
});

export default store;
