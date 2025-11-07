import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/post";
import { fetchPostsByUserService } from "../../services/post.service";
import { toggleLike } from "./like.slice";
import { createComment } from "./comment.slice";

export const fetchOtherUserPost = createAsyncThunk<Post[], string>(
  "userPost/fetchOtherUserPost",
  async (userId, thunkAPI) => {
    try {
      return await fetchPostsByUserService(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Fetch other user post thất bại\n${error.message}`
      );
    }
  }
);

interface UserPost {
  posts: Post[];
  status: "idle" | "loading" | "success" | "error";
}

const initialState: UserPost = {
  posts: [],
  status: "idle",
};

const otherUserPostSlice = createSlice({
  name: "otherUserPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Like update trạng thái
      .addCase(toggleLike.fulfilled, (state: UserPost, action) => {
        const { liked } = action.payload;
        if (action.meta.arg.onModel !== "post") return;
        const index = state.posts.findIndex(
          (p) => p._id === action.meta.arg.targetId
        );
        if (index !== -1) {
          const post = state.posts[index];
          // const likeCount = post.likeCount || 0;
          state.posts[index] = {
            ...post,
            // likeCount: liked ? likeCount + 1 : Math.max(likeCount - 1, 0),
            isLikedByCurrentUser: liked,
          };
        }
      })

      // Tăng comment count khi tạo bình luận
      .addCase(createComment.fulfilled, (state: UserPost, action) => {
        const postId = action.meta.arg.post;
        const index = state.posts.findIndex((p) => p._id === postId);
        if (index !== -1) {
          state.posts[index].commentCount += 1;
        }
      })

      .addCase(fetchOtherUserPost.pending, (state: UserPost) => {
        state.status = "loading";
      })
      .addCase(
        fetchOtherUserPost.fulfilled,
        (state: UserPost, action: PayloadAction<Post[]>) => {
          state.posts = action.payload;
          state.status = "success";
        }
      )
      .addCase(fetchOtherUserPost.rejected, (state: UserPost) => {
        state.status = "error";
      });
  },
});

export default otherUserPostSlice.reducer;
