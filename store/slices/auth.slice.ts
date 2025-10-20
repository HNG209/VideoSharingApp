import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginValues, User } from "../../types/user";
import {
  loginUserService,
  logoutUserService,
} from "../../services/user.service";

export const login = createAsyncThunk<User, LoginValues>(
  "auth/login",
  async (loginValues, thunkAPI) => {
    try {
      return await loginUserService(loginValues);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`Đăng nhập thất bại\n${error.message}`);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await logoutUserService();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(`Đăng xuất thất bại\n${error.message}`);
  }
});

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        login.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.isLoggedIn = true;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state: AuthState, action) => {
        state.isLoggedIn = false;
        state.user = null;
      })

      .addCase(logout.fulfilled, (state: AuthState) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
