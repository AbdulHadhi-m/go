import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelTripAPI,
  createBusAPI,
  createTripAPI,
  getOperatorBookingsAPI,
  getOperatorBusesAPI,
  getOperatorTripsAPI,
  getRevenueSummaryAPI,
  getRouteAnalyticsAPI,
  markTripCompletedAPI,
} from "../../services/operatorService";

const initialState = {
  buses: [],
  trips: [],
  bookings: [],
  revenueSummary: null,
  routeAnalytics: [],
  loading: false,
  error: null,
  successMessage: "",
};

export const getOperatorDashboardData = createAsyncThunk(
  "operator/getDashboardData",
  async (_, thunkAPI) => {
    try {
      const [buses, trips, bookings, revenue, analytics] = await Promise.all([
        getOperatorBusesAPI(),
        getOperatorTripsAPI(),
        getOperatorBookingsAPI(),
        getRevenueSummaryAPI(),
        getRouteAnalyticsAPI(),
      ]);
      return {
        buses: buses.buses || [],
        trips: trips.trips || [],
        bookings: bookings.bookings || [],
        revenueSummary: revenue.summary || null,
        routeAnalytics: analytics.analytics || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load operator data"
      );
    }
  }
);

export const createBus = createAsyncThunk(
  "operator/createBus",
  async (payload, thunkAPI) => {
    try {
      return await createBusAPI(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create bus"
      );
    }
  }
);

export const createTrip = createAsyncThunk(
  "operator/createTrip",
  async (payload, thunkAPI) => {
    try {
      return await createTripAPI(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create trip"
      );
    }
  }
);

export const markTripCompleted = createAsyncThunk(
  "operator/markTripCompleted",
  async (tripId, thunkAPI) => {
    try {
      return await markTripCompletedAPI(tripId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark trip completed"
      );
    }
  }
);

export const cancelTrip = createAsyncThunk(
  "operator/cancelTrip",
  async ({ tripId, reason }, thunkAPI) => {
    try {
      return await cancelTripAPI(tripId, reason);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel trip"
      );
    }
  }
);

const operatorSlice = createSlice({
  name: "operator",
  initialState,
  reducers: {
    clearOperatorMessage: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOperatorDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOperatorDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload.buses;
        state.trips = action.payload.trips;
        state.bookings = action.payload.bookings;
        state.revenueSummary = action.payload.revenueSummary;
        state.routeAnalytics = action.payload.routeAnalytics;
      })
      .addCase(getOperatorDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBus.fulfilled, (state, action) => {
        state.buses.unshift(action.payload.bus);
        state.successMessage = "Bus created successfully";
      })
      .addCase(createBus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload.trip);
        state.successMessage = "Trip created successfully";
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markTripCompleted.fulfilled, (state, action) => {
        state.trips = state.trips.map((trip) =>
          trip._id === action.payload.trip._id ? action.payload.trip : trip
        );
        state.successMessage = "Trip marked completed";
      })
      .addCase(cancelTrip.fulfilled, (state, action) => {
        state.trips = state.trips.map((trip) =>
          trip._id === action.payload.trip._id ? action.payload.trip : trip
        );
        state.successMessage = "Trip cancelled";
      });
  },
});

export const { clearOperatorMessage } = operatorSlice.actions;
export default operatorSlice.reducer;
