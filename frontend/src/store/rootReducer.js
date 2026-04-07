import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import tripReducer from "../features/trips/tripSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
   trips: tripReducer,

});

export default rootReducer;