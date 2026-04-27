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
import axiosInstance from "../../services/axiosInstance";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const { data } = await axiosInstance.get('/notifications/unread-count');
          setUnreadCount(data.count || 0);
        } catch (error) {
          console.error("Failed to fetch unread count", error);
        }
      };
      fetchUnreadCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let socket;
    if (user && user._id) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        socket.emit('join_user_room', user._id);
      });

      socket.on('new_notification', () => {
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (socket) {
        if(user && user._id) socket.emit('leave_user_room', user._id);
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    const handleNotificationsRead = () => setUnreadCount(0);
    window.addEventListener('notifications_read', handleNotificationsRead);
    return () => window.removeEventListener('notifications_read', handleNotificationsRead);
  }, []);

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
  )}&background=f97316&color=fff`;

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
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 focus:outline-none"
                >
                  <Menu size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Avatar */}
                <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-red-200">
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
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
                      {user?.role !== "admin" && user?.role !== "operator" && (
                        <>
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
                        </>
                      )}

                      <NavLink
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <div className="flex items-center gap-3">
                          <User
                            size={16}
                            className="text-slate-400 group-hover:text-red-500"
                          />
                          Profile
                        </div>
                        {unreadCount > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </NavLink>

                      {user?.role !== "admin" && user?.role !== "operator" && (
                        <>
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

                          {user?.role === "operator" && (
                            <NavLink
                              to="/operator/dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="group mt-1 flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 hover:text-red-800"
                            >
                              <BadgeCheck size={16} className="text-red-500" />
                              Operator Dashboard
                            </NavLink>
                          )}
                        </>
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