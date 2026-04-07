import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTripByIdAPI, getTripsAPI, getTripSeatsAPI } from "../../services/tripService";

const initialState = {
  trips: [],
  trip: null,
  seatsData: null,
  loading: false,
  error: null,
};

export const getTrips = createAsyncThunk(
  "trips/getTrips",
  async (searchData, thunkAPI) => {
    try {
      return await getTripsAPI(searchData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getTripById = createAsyncThunk(
  "trips/getTripById",
  async (tripId, thunkAPI) => {
    try {
      return await getTripByIdAPI(tripId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getTripSeats = createAsyncThunk(
  "trips/getTripSeats",
  async (tripId, thunkAPI) => {
    try {
      return await getTripSeatsAPI(tripId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(getTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(getTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTripSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seatsData = action.payload;
      })
      .addCase(getTripSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tripSlice.reducer;