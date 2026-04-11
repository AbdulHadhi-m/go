import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  User,
  LogOut,
  Search,
  Home,
  CalendarDays,
  ShieldAlert,
  BadgeCheck,
  Menu,
} from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../features/auth/authSelectors";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email || "User";

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=d44208&color=fff`;

  const userAvatar = user?.avatar || fallbackAvatar;

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-red-500"
        >
          GoPath
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-600"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <div
                className="relative flex items-center gap-3"
                ref={dropdownRef}
              >
                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none"
                >
                  <Menu size={20} />
                </button>

                {/* Avatar */}
                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-red-200">
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackAvatar;
                    }}
                  />
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="border-b border-red-50 bg-red-50/30 px-4 py-3 md:hidden">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {displayName}
                      </p>
                      <p className="truncate text-xs font-semibold uppercase tracking-wider text-red-500">
                        {user?.role || "user"}
                      </p>
                    </div>

                    <div className="p-2">
                      <NavLink
                        to="/"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Home
                          size={16}
                          className="text-slate-400 group-hover:text-red-500"
                        />
                        Home
                      </NavLink>

                      <NavLink
                        to="/search-results"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Search
                          size={16}
                          className="text-slate-400 group-hover:text-red-500"
                        />
                        Search
                      </NavLink>

                      <NavLink
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <User
                          size={16}
                          className="text-slate-400 group-hover:text-red-500"
                        />
                        Profile
                      </NavLink>

                      <NavLink
                        to="/my-bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <CalendarDays
                          size={16}
                          className="text-slate-400 group-hover:text-red-500"
                        />
                        My Bookings
                      </NavLink>

                      <NavLink
                        to="/favorites"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Heart
                          size={16}
                          className="text-slate-400 group-hover:text-red-500"
                        />
                        Wishlist
                      </NavLink>

                      {user?.role === "admin" && (
                        <NavLink
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 hover:text-red-800"
                        >
                          <ShieldAlert size={16} className="text-red-500" />
                          Admin Dashboard
                        </NavLink>
                      )}

                      {(user?.role === "operator" ||
                        user?.role === "admin") && (
                        <NavLink
                          to="/operator/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group mt-1 flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 hover:text-red-800"
                        >
                          <BadgeCheck size={16} className="text-red-500" />
                          Operator Dashboard
                        </NavLink>
                      )}
                    </div>

                    <div className="border-t border-red-50 p-2">
                      <button
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut
                          size={16}
                          className="group-hover:text-red-700"
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}