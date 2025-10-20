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
      // console.log("loginValues", loginValues);
      return loginUserService(loginValues);
    } catch (error) {
      console.error("Login error:", error);
      return thunkAPI.rejectWithValue("Đăng nhập thất bại");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return logoutUserService();
  } catch (error) {
    return thunkAPI.rejectWithValue("Đăng xuất thất bại");
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
          console.log("action.payload", action.payload);
          state.isLoggedIn = true;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state: AuthState, action) => {
        console.error("Login rejected:", action.payload);
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
