import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userSearchReducer from "./slices/user.search.slice";
import followReducer from "./slices/follow.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: userSearchReducer,
    follow: followReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
