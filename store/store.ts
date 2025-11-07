import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userSearchReducer from "./slices/user.search.slice";
import followReducer from "./slices/follow.slice";
import userPostReducer from "./slices/user.post.slice";
import commentReducer from "./slices/comment.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: userSearchReducer,
    comment: commentReducer,
    follow: followReducer,
    userPost: userPostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
