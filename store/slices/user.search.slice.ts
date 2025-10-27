import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchService } from "../../services/user.service";
import { Friend, User } from "../../types/user";
import { followUser, unfollowUser } from "./follow.slice";

interface SearchState {
  users: Friend[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  users: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

// Thunk: Fetch trang đầu tiên
export const fetchSearchResults = createAsyncThunk<
  { users: Friend[]; total: number; page: number; totalPages: number },
  { query: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "search/fetchSearchResults",
  async ({ query, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const result = await searchService(query, page, limit);
      return {
        users: result.users,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi tìm kiếm"
      );
    }
  }
);

// Thunk: Fetch thêm trang tiếp theo
export const fetchMoreSearchResults = createAsyncThunk<
  { users: Friend[]; page: number },
  { query: string; page: number; limit?: number },
  { rejectValue: string }
>(
  "search/fetchMoreSearchResults",
  async ({ query, page, limit = 10 }, thunkAPI) => {
    try {
      const result = await searchService(query, page, limit);
      return {
        users: result.users,
        page: result.page,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải thêm kết quả"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults(state) {
      state.users = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trang đầu tiên
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      })

      // Fetch thêm trang tiếp theo
      .addCase(fetchMoreSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMoreSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = [...state.users, ...action.payload.users];
        state.page = action.payload.page;
      })
      .addCase(fetchMoreSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Lỗi không xác định";
      })

      // lắng nghe bên follow slice

      // Follow
      .addCase(followUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.meta.arg);

        if (index == -1) return;

        state.users[index].isFollowed = true;
      })
      // Unfollow
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.meta.arg);

        if (index == -1) return;

        state.users[index].isFollowed = false;
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
