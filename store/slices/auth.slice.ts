import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangePasswordValues, LoginValues, User } from "../../types/user";
import {
  changePasswordService,
  checkAuthService,
  loginUserService,
  logoutUserService,
  testAuthService,
  updateProfileService,
} from "../../services/user.service";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const response = await checkAuthService();

      return response; // user info
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Token không hợp lệ"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await updateProfileService(formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Cập nhật thông tin thất bại"
      );
    }
  }
);

export const testAuth = createAsyncThunk(
  "auth/testAuth",
  async (_, thunkAPI) => {
    try {
      const response = await testAuthService();

      return response; // user info
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Token không hợp lệ"
      );
    }
  }
);

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

export const changePassword = createAsyncThunk<
  string, // Kiểu dữ liệu trả về (message từ server)
  ChangePasswordValues, // Kiểu dữ liệu đầu vào
  { rejectValue: string } // Kiểu dữ liệu khi bị lỗi
>("auth/changePassword", async (values, thunkAPI) => {
  try {
    const message = await changePasswordService(values);
    return message; // Trả về thông báo thành công
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Đổi mật khẩu thất bại"
    );
  }
});

interface AuthState {
  status: "idle" | "loading" | "success" | "error";
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  status: "idle",
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Check Auth (auto login on app entry)
      .addCase(checkAuth.pending, (state: AuthState) => {
        state.status = "loading";
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state: AuthState, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state: AuthState, action) => {
        state.status = "error";
        state.isLoggedIn = false;
        state.user = null;
      })

      // Test Auth
      .addCase(testAuth.fulfilled, (state: AuthState, action) => {
        console.log("test auth done");
      })

      .addCase(updateProfile.fulfilled, (state: AuthState, action) => {
        state.user = action.payload;
      })

      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.status = "loading";
      })
      .addCase(
        login.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.status = "success";
          state.isLoggedIn = true;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state: AuthState, action) => {
        state.status = "error";
        state.isLoggedIn = false;
        state.user = null;
      })

      // Logout
      .addCase(logout.pending, (state: AuthState) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state: AuthState) => {
        state.status = "success";
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state: AuthState) => {
        state.status = "error";
      })

      // Change password (might remove update status)
      .addCase(changePassword.pending, (state: AuthState) => {
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state: AuthState, action) => {
        state.status = "success";
      })
      .addCase(changePassword.rejected, (state: AuthState, action) => {
        state.status = "error";
      });
  },
});

export default authSlice.reducer;
