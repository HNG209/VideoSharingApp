import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserFeedService } from "../../services/user.service";
import { Post } from "../../types/post";
import { fetchUserPostService } from "../../services/post.service";

export const fetchUserFeed = createAsyncThunk<
  Post[], // Kiểu dữ liệu trả về
  void, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("feed/fetchUserFeed", async (_, thunkAPI) => {
  try {
    const result = await fetchUserPostService();
    console.log("Fetched feed posts from service:", result);
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
        console.log("Fetched feed posts:", state.posts);
        state.status = "succeeded";
      })
      .addCase(fetchUserFeed.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export default feedSlice.reducer;
