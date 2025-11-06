import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { likeService } from "../../services/like.service";
import { LikeRequest, LikeResponse } from "../../types/like";

export const toggleLike = createAsyncThunk<
  LikeResponse, // Kiểu dữ liệu trả về
  LikeRequest, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu trả về khi bị lỗi
>("like/toggleLike", async (payload, { rejectWithValue }) => {
  try {
    const response = await likeService.toggleLike(payload);
    return response;
  } catch (error) {
    return rejectWithValue("Failed to toggle like");
  }
});

const initialState: any = {};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
});

export default likeSlice.reducer;
