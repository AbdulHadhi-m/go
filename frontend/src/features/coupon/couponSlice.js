import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  applyCouponAPI,
  createCouponAPI,
  getAdminCouponsAPI,
  toggleCouponAPI,
} from "../../services/couponService";

const initialState = {
  coupon: null,
  offerType: "none",
  discountAmount: 0,
  finalAmount: 0,
  selectedOfferReason: "",
  offerApplied: "",
  offerMeta: {},
  originalAmount: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  coupons: [],
};

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (payload, thunkAPI) => {
    try {
      return await applyCouponAPI(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to apply coupon"
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (payload, thunkAPI) => {
    try {
      return await createCouponAPI(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const getAdminCoupons = createAsyncThunk(
  "coupon/getAdminCoupons",
  async (_, thunkAPI) => {
    try {
      return await getAdminCouponsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

export const toggleCoupon = createAsyncThunk(
  "coupon/toggleCoupon",
  async (couponId, thunkAPI) => {
    try {
      return await toggleCouponAPI(couponId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle coupon"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.coupon = null;
      state.offerType = "none";
      state.discountAmount = 0;
      state.finalAmount = 0;
      state.selectedOfferReason = "";
      state.offerApplied = "";
      state.offerMeta = {};
      state.originalAmount = 0;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.coupon = action.payload.couponCode || null;
        state.offerType = action.payload.offerType || "none";
        state.discountAmount = action.payload.discountAmount || 0;
        state.finalAmount = action.payload.finalAmount || 0;
        state.selectedOfferReason = action.payload.selectedOfferReason || "";
        state.offerApplied = action.payload.offerApplied || "";
        state.offerMeta = action.payload.offerMeta || {};
        state.originalAmount = action.payload.originalAmount || 0;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Coupon created";
        if (action.payload.coupon) {
          state.coupons.unshift(action.payload.coupon);
        }
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAdminCoupons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload.coupons || [];
      })
      .addCase(getAdminCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Coupon updated";
        state.coupons = state.coupons.map((coupon) =>
          coupon._id === action.payload.coupon._id ? action.payload.coupon : coupon
        );
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
