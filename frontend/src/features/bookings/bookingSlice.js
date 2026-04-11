import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelBookingAPI,
  createBookingAPI,
  getMyBookingsAPI,
} from "../../services/bookingService";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  successMessage: "",
};

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, thunkAPI) => {
    try {
      return await createBookingAPI(bookingData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getMyBookings = createAsyncThunk(
  "bookings/getMyBookings",
  async (_, thunkAPI) => {
    try {
      return await getMyBookingsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (bookingId, thunkAPI) => {
    try {
      return await cancelBookingAPI(bookingId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingMessage: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.successMessage = "Booking created successfully";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload?.refundStatus === "pending"
            ? "Booking cancelled successfully. Refund status set to pending."
            : "Booking cancelled successfully";
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.booking._id ? action.payload.booking : booking
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessage } = bookingSlice.actions;
export default bookingSlice.reducer;