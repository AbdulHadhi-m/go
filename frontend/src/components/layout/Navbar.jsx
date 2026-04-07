import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../features/auth/authSelectors";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Search", to: "/search-results" },
  { label: "My Bookings", to: "/my-bookings" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email || "User";

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=7c3aed&color=fff`;

  const userAvatar = user?.avatar || fallbackAvatar;

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-red-500"
        >
          GoPath
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? "text-red-500"
                    : "text-slate-600 hover:text-red-500"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Name */}
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-slate-900">
                  {displayName}
                </p>
              </div>

              {/* Avatar */}
              <img
                src={userAvatar}
                alt={displayName}
                className="h-11 w-11 rounded-full border border-violet-200 object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackAvatar;
                }}
              />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-violet-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-red-500"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}