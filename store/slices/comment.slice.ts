import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentCreateRequest, CommentModel } from "../../types/comment";
import {
  createCommentService,
  fetchCommentsByPostService,
} from "../../services/comment.service";

export const createComment = createAsyncThunk<
  CommentModel, // Kiểu dữ liệu trả về
  CommentCreateRequest, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("comment/createComment", async (comment, thunkAPI) => {
  try {
    const result = await createCommentService(comment);
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      `Create comment thất bại\n${error.message}`
    );
  }
});

export const fetchCommentsByPost = createAsyncThunk<
  CommentModel[], // Kiểu dữ liệu trả về
  string, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("comment/fetchCommentsByPost", async (postId, thunkAPI) => {
  try {
    const result = await fetchCommentsByPostService(postId);
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      `Fetch comments thất bại\n${error.message}`
    );
  }
});

interface CommentState {
  commentsByPostId: Record<string, CommentModel[]>;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: CommentState = {
  commentsByPostId: {},
  status: "idle",
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.fulfilled, (state: CommentState, action) => {
        const postId = action.meta.arg.post;
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [];
        }
        state.commentsByPostId[postId].push(action.payload);
      })

      .addCase(fetchCommentsByPost.fulfilled, (state: CommentState, action) => {
        const postId = action.meta.arg;
        state.commentsByPostId[postId] = action.payload;
      });
  },
});

export default commentSlice.reducer;
