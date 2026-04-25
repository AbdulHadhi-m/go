import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getRewardBalanceAPI,
  getRewardHistoryAPI,
  redeemPreviewAPI,
} from "../../services/rewardService";

const initialState = {
  balance: 0,
  history: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getRewardBalance = createAsyncThunk(
  "reward/getRewardBalance",
  async (_, thunkAPI) => {
    try {
      return await getRewardBalanceAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load balance"
      );
    }
  }
);

export const getRewardHistory = createAsyncThunk(
  "reward/getRewardHistory",
  async (_, thunkAPI) => {
    try {
      return await getRewardHistoryAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load history"
      );
    }
  }
);

export const getRedeemPreview = createAsyncThunk(
  "reward/getRedeemPreview",
  async (totalAmount, thunkAPI) => {
    try {
      return await redeemPreviewAPI(totalAmount);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to get redemption preview"
      );
    }
  }
);

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    clearRewardState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRewardBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRewardBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.coins;
      })
      .addCase(getRewardBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRewardHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRewardHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.history = action.payload.history;
      })
      .addCase(getRewardHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearRewardState } = rewardSlice.actions;
export default rewardSlice.reducer;
