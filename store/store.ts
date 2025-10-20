import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Thêm các reducer khác tại đây
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
