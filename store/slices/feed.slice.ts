import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserFeedService } from "../../services/user.service";
import { Post } from "../../types/post";
import { fetchUserPostService } from "../../services/post.service";
import { toggleLike } from "./like.slice";
import { createComment } from "./comment.slice";

export const fetchUserFeed = createAsyncThunk<
  Post[], // Kiểu dữ liệu trả về
  void, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("feed/fetchUserFeed", async (_, thunkAPI) => {
  try {
    const result = await fetchUserPostService();
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      `Fetch user feed thất bại\n${error.message}`
    );
  }
});

interface FeedState {
  posts: Post[];
  status?: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: FeedState = {
  posts: [],
  status: "idle",
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserFeed.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserFeed.rejected, (state, action) => {
        state.status = "failed";
      })

      // Like update trạng thái
      .addCase(toggleLike.fulfilled, (state: FeedState, action) => {
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
      .addCase(createComment.fulfilled, (state: FeedState, action) => {
        const postId = action.meta.arg.post;
        const index = state.posts.findIndex((p) => p._id === postId);
        if (index !== -1) {
          state.posts[index].commentCount += 1;
        }
      });
  },
});

export default feedSlice.reducer;
