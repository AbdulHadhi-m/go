import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import favoriteReducer from "../features/favorites/favoriteSlice";
import tripReducer from "../features/trips/tripSlice";
import userReducer from "../features/user/userSlice";
import couponReducer from "../features/coupon/couponSlice";
import operatorReducer from "../features/operator/operatorSlice";
import adminReducer from "../features/admin/adminSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
  favorites: favoriteReducer,
  trips: tripReducer,
  user: userReducer,
  coupon: couponReducer,
  operator: operatorReducer,
  admin: adminReducer,

});

export default rootReducer;