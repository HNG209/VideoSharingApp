import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/post";
import { fetchPostsByUserService } from "../../services/post.service";
import { toggleLike } from "./like.slice";
import { createComment } from "./comment.slice";

export const fetchOtherUserPost = createAsyncThunk<
  Post[],
  string,
  { state: any }
>(
  "otherUserPost/fetchOtherUserPost",
  async (userId, thunkAPI) => {
    try {
      return await fetchPostsByUserService(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Fetch other user post thất bại\n${error.message}`
      );
    }
  },
  {
    condition: (userId, { getState }) => {
      const state = getState().otherUserPost;

      // nếu userId đã có dữ liệu, không fetch lại
      if (
        state.postsByUser[userId] &&
        state.postsByUser[userId].posts.length > 0
      ) {
        return false; // cancel thunk
      }

      return true; // fetch
    },
  }
);

interface UserPostEntry {
  posts: Post[];
  status: "idle" | "loading" | "success" | "error";
}

interface OtherUserPostState {
  postsByUser: Record<string, UserPostEntry>;
}

const initialState: OtherUserPostState = {
  postsByUser: {},
};

const otherUserPostSlice = createSlice({
  name: "otherUserPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (action.meta.arg.onModel !== "post") return;

        const postId = action.meta.arg.targetId;

        // duyệt mọi user trong dictionary
        for (const userId in state.postsByUser) {
          const entry = state.postsByUser[userId];
          const index = entry.posts.findIndex((p) => p._id === postId);
          if (index !== -1) {
            entry.posts[index].isLikedByCurrentUser = action.payload.liked;
            break;
          }
        }
      })

      // Comment count increase
      .addCase(createComment.fulfilled, (state, action) => {
        const postId = action.meta.arg.post;

        for (const userId in state.postsByUser) {
          const entry = state.postsByUser[userId];
          const index = entry.posts.findIndex((p) => p._id === postId);

          if (index !== -1) {
            entry.posts[index].commentCount += 1;
            break;
          }
        }
      })

      // Fetch posts
      .addCase(fetchOtherUserPost.pending, (state, action) => {
        const userId = action.meta.arg;

        if (!state.postsByUser[userId]) {
          state.postsByUser[userId] = { posts: [], status: "loading" };
        } else {
          state.postsByUser[userId].status = "loading";
        }
      })

      .addCase(fetchOtherUserPost.fulfilled, (state, action) => {
        const userId = action.meta.arg;

        const posts = action.payload;

        state.postsByUser[userId] = {
          posts,
          status: "success",
        };
      })

      .addCase(fetchOtherUserPost.rejected, (state, action) => {
        const userId = action.meta.arg;

        if (!state.postsByUser[userId]) return;

        state.postsByUser[userId].status = "error";
      });
  },
});

export default otherUserPostSlice.reducer;
