import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const initialized = useSelector(selectAuthInitialized);
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}