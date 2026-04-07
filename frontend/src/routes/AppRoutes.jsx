import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import SearchResultsPage from "../pages/SearchResultsPage";
import TripDetailsPage from "../pages/TripDetailsPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import CheckoutPage from "../pages/CheckoutPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/trip/:id" element={<TripDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/trip/:id/seats" element={<SeatSelectionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}