import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addFavoriteAPI,
  getMyFavoritesAPI,
  removeFavoriteAPI,
  toggleFavoriteAPI,
} from "../../services/favoriteService";
import { isValidObjectId } from "../../utils/isValidObjectId";

const initialState = {
  favorites: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const normalize = (value = "") => value.trim().toLowerCase();

const getFavoriteKey = (favorite) => {
  const tid = favorite?.trip?._id ?? favorite?.trip;
  if (tid && isValidObjectId(tid)) return `trip:${tid}`;
  return `route:${normalize(favorite?.from)}:${normalize(favorite?.to)}`;
};

const optimisticKeyFromPayload = (payload) => {
  if (payload.tripId && isValidObjectId(payload.tripId)) {
    return `trip:${payload.tripId}`;
  }
  return `route:${normalize(payload.from)}:${normalize(payload.to)}`;
};

export const getMyFavorites = createAsyncThunk(
  "favorites/getMyFavorites",
  async (_, thunkAPI) => {
    try {
      return await getMyFavoritesAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load favorites"
      );
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (payload, thunkAPI) => {
    try {
      return await addFavoriteAPI(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add favorite"
      );
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (favoriteId, thunkAPI) => {
    try {
      return await removeFavoriteAPI(favoriteId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove favorite"
      );
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (payload, thunkAPI) => {
    try {
      const response = await toggleFavoriteAPI(payload);
      return { ...response, payload };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update favorite"
      );
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavoriteState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyFavorites.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getMyFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.favorites = action.payload.favorites || [];
      })
      .addCase(getMyFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Added to favorites";
        if (action.payload.favorite) {
          const key = getFavoriteKey(action.payload.favorite);
          const exists = state.favorites.some((item) => getFavoriteKey(item) === key);
          if (!exists) {
            state.favorites.unshift(action.payload.favorite);
          }
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Removed from favorites";
        state.favorites = state.favorites.filter(
          (item) => item._id !== action.payload.favoriteId
        );
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;

        const payload = action.meta.arg;
        const optimisticKey = optimisticKeyFromPayload(payload);

        const exists = state.favorites.some(
          (item) => getFavoriteKey(item) === optimisticKey
        );

        if (exists) {
          state.favorites = state.favorites.filter(
            (item) => getFavoriteKey(item) !== optimisticKey
          );
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Favorites updated";

        if (action.payload.action === "removed" && action.payload.favoriteId) {
          state.favorites = state.favorites.filter(
            (item) => String(item._id) !== String(action.payload.favoriteId)
          );
        } else if (action.payload.action === "added" && action.payload.favorite) {
          const key = getFavoriteKey(action.payload.favorite);
          const exists = state.favorites.some(
            (item) => getFavoriteKey(item) === key
          );
          if (!exists) {
            state.favorites.unshift(action.payload.favorite);
          }
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoriteLoading = (state) => state.favorites.isLoading;
export const selectFavoriteState = (state) => state.favorites;

export const isTripFavorite = (favorites, tripId) =>
  favorites.some((favorite) => {
    if (!tripId || !isValidObjectId(tripId)) return false;
    const tid = favorite?.trip?._id ?? favorite?.trip;
    return tid != null && String(tid) === String(tripId);
  });

/** Heart state: match by trip id when valid, otherwise by from/to route */
export const isFavoriteForTripCard = (favorites, trip) => {
  const rawId = trip?._id ?? trip?.id;
  if (isValidObjectId(rawId)) {
    return isTripFavorite(favorites, String(rawId));
  }
  const key = `route:${normalize(trip?.from)}:${normalize(trip?.to)}`;
  if (key === "route::") return false;
  return favorites.some((f) => getFavoriteKey(f) === key);
};

export const getFavoriteByTrip = (favorites, tripId) =>
  favorites.find((favorite) => {
    if (!tripId) return false;
    return favorite?.trip?._id === tripId || favorite?.trip === tripId;
  });

export const { clearFavoriteState } = favoriteSlice.actions;
export default favoriteSlice.reducer;
