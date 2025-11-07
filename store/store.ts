import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import userSearchReducer from "./slices/user.search.slice";
import followReducer from "./slices/follow.slice";
import userPostReducer from "./slices/user.post.slice";
import commentReducer from "./slices/comment.slice";
import otherUserPostReducer from "./slices/other.post.slice";
import otherProfileReducer from "./slices/other.profile.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: userSearchReducer,
    otherProfile: otherProfileReducer,
    comment: commentReducer,
    follow: followReducer,
    userPost: userPostReducer,
    otherUserPost: otherUserPostReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
