import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  followUserService,
  unfollowUserService,
} from "../../services/follow.service";
import { Follow } from "../../types/follow";

export const followUser = createAsyncThunk<
  Follow, // Kiểu dữ liệu trả về
  string, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("user/followUser", async (values, thunkAPI) => {
  try {
    const result = await followUserService(values);
    return result; // Trả về thông báo thành công
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Follow fail"
    );
  }
});

export const unfollowUser = createAsyncThunk<
  string, // Kiểu dữ liệu trả về
  string, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("user/unfollowUser", async (values, thunkAPI) => {
  try {
    const message = await unfollowUserService(values);
    return message; // Trả về thông báo thành công
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Unfollow fail"
    );
  }
});

const initialState: any = {};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
});

export default followSlice.reducer;
