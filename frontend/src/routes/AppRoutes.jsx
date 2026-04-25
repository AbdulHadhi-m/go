import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import LoginSuccessPage from "../pages/LoginSuccessPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import SearchResultsPage from "../pages/SearchResultsPage";
import TripDetailsPage from "../pages/TripDetailsPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";
import CheckoutPage from "../pages/CheckoutPage";
import FavoritesPage from "../pages/FavoritesPage";
import ProfilePage from "../pages/ProfilePage";
import OperatorDashboardPage from "../pages/operator/OperatorDashboardPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import CareersPage from "../pages/CareersPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import CancellationPage from "../pages/CancellationPage";
import RefundPolicyPage from "../pages/RefundPolicyPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-success" element={<LoginSuccessPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/trip/:id" element={<TripDetailsPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/trip/:id/seats" element={<SeatSelectionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={["operator", "admin"]} />}>
        <Route path="/operator/dashboard" element={<OperatorDashboardPage />} />
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/cancellation" element={<CancellationPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}