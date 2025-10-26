import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userSearchReducer from "./slices/user.search.slice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Thêm các reducer khác tại đây
    search: userSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
