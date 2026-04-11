import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  approveOperatorAPI,
  deleteAnyBusAPI,
  getAdminStatsAPI,
  getAllBookingsAPI,
  getAllBusesAPI,
  getAllOperatorsAPI,
  getAllUsersAPI,
  getComplaintsAPI,
  rejectOperatorAPI,
  toggleUserBlockAPI,
  updateComplaintAPI,
} from "../../services/adminService";

const initialState = {
  stats: null,
  dailyBookings: [],
  users: [],
  operators: [],
  buses: [],
  bookings: [],
  complaints: [],
  loading: false,
  error: null,
  successMessage: "",
};

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const [stats, users, operators, buses, bookings, complaints] = await Promise.all([
        getAdminStatsAPI(),
        getAllUsersAPI(),
        getAllOperatorsAPI(),
        getAllBusesAPI(),
        getAllBookingsAPI(),
        getComplaintsAPI(),
      ]);
      return {
        stats: stats.stats,
        dailyBookings: stats.dailyBookings || [],
        users: users.users || [],
        operators: operators.operators || [],
        buses: buses.buses || [],
        bookings: bookings.bookings || [],
        complaints: complaints.complaints || [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load admin dashboard"
      );
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  "admin/toggleUserBlock",
  async (userId, thunkAPI) => {
    try {
      return await toggleUserBlockAPI(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

export const approveOperator = createAsyncThunk(
  "admin/approveOperator",
  async (userId, thunkAPI) => {
    try {
      return await approveOperatorAPI(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to approve operator");
    }
  }
);

export const rejectOperator = createAsyncThunk(
  "admin/rejectOperator",
  async ({ userId, reason }, thunkAPI) => {
    try {
      return await rejectOperatorAPI(userId, reason);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to reject operator");
    }
  }
);

export const deleteAnyBus = createAsyncThunk(
  "admin/deleteAnyBus",
  async (busId, thunkAPI) => {
    try {
      return { ...(await deleteAnyBusAPI(busId)), busId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete bus");
    }
  }
);

export const updateComplaint = createAsyncThunk(
  "admin/updateComplaint",
  async ({ complaintId, status, resolutionNote }, thunkAPI) => {
    try {
      return await updateComplaintAPI(complaintId, { status, resolutionNote });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update complaint");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminMessage: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.dailyBookings = action.payload.dailyBookings;
        state.users = action.payload.users;
        state.operators = action.payload.operators;
        state.buses = action.payload.buses;
        state.bookings = action.payload.bookings;
        state.complaints = action.payload.complaints;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.users = state.users.map((u) =>
          u._id === action.payload.user._id ? { ...u, isBlocked: action.payload.user.isBlocked } : u
        );
      })
      .addCase(approveOperator.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(rejectOperator.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(deleteAnyBus.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.buses = state.buses.filter((b) => b._id !== action.payload.busId);
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.complaints = state.complaints.map((c) =>
          c._id === action.payload.complaint._id ? action.payload.complaint : c
        );
      })
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
