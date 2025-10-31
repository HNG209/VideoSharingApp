import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/post";
import {
  fetchUserPostService,
  uploadPostService,
} from "../../services/post.service";

interface UserPost {
  posts: Post[];
  status: "idle" | "loading" | "success" | "error";
}

const initialState: UserPost = {
  posts: [],
  status: "idle",
};

export const uploadPost = createAsyncThunk<
  Post, // Kiểu dữ liệu trả về
  { formData: FormData; onProgress?: (p: number) => void }, // Kiểu tham số đầu vào
  { rejectValue: string } // Kiểu giá trị khi reject
>(
  "userPost/uploadPost",
  async ({ formData, onProgress }, thunkAPI) => {
    try {
      const result = await uploadPostService(formData, onProgress);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`Upload post thất bại\n${error.message}`);
    }
  }
);

export const fetchUserPost = createAsyncThunk<Post[], void>(
  "userPost/fetchUserPost",
  async (_, thunkAPI) => {
    try {
      return await fetchUserPostService();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        `Fetch user post thất bại\n${error.message}`
      );
    }
  }
);

const userPostSlice = createSlice({
  name: "userPost",
  initialState,
  reducers: {},
  extraReducers: (builber) => {
    builber
      // Upload post
      .addCase(uploadPost.pending, (state: UserPost) => {
        state.status = "loading";
      })
      .addCase(
        uploadPost.fulfilled,
        (state: UserPost, action: PayloadAction<Post>) => {
          state.posts.push(action.payload);
          state.status = "success";
        }
      )
      .addCase(uploadPost.rejected, (state: UserPost) => {
        state.status = "error";
      })

      // Fetch user post
      .addCase(fetchUserPost.pending, (state: UserPost) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserPost.fulfilled,
        (state: UserPost, action: PayloadAction<Post[]>) => {
          // TODO: thêm phân trang, throttle tải mới khi lướt
          state.posts = action.payload;
          state.status = "success";
        }
      )
      .addCase(fetchUserPost.rejected, (state: UserPost) => {
        state.status = "error";
      });
  },
});

export default userPostSlice.reducer;
