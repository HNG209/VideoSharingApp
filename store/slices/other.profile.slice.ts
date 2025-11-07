import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserProfileService } from "../../services/user.service";
import { Friend, User } from "../../types/user";

export const fetchOtherUserProfile = createAsyncThunk<Friend, string>(
  "otherProfile/fetch",
  async (userId: string) => {
    const response = await fetchUserProfileService(userId);
    return response;
  }
);

interface OtherProfileState {
  user: Friend | null;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: OtherProfileState = {
  user: null,
  status: "idle",
};

const otherProfileSlice = createSlice({
  name: "otherProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOtherUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOtherUserProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default otherProfileSlice.reducer;
