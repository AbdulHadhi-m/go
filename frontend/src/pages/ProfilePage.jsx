import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import {
  changePassword,
  clearUserState,
  getMyProfile,
  updateMyProfile,
} from "../features/user/userSlice";
import { setAuthUser } from "../features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.avatar || "",
      });

      // Keep navbar/auth state and localStorage synced immediately.
      // Only dispatch if data actually differs to avoid infinite re-render loops.
      if (
        user &&
        (user.firstName !== profile.firstName ||
          user.lastName !== profile.lastName ||
          user.avatar !== profile.avatar ||
          user.phone !== profile.phone)
      ) {
        dispatch(
          setAuthUser({
            ...user,
            ...profile,
            token: user?.token,
          })
        );
      }
    }
  }, [profile, dispatch, user]);


  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(clearUserState());
    }
    if (isSuccess && message) {
      toast.success(message);
      dispatch(clearUserState());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim()) {
      toast.error("First name and email are required");
      return;
    }

    const response = await dispatch(updateMyProfile(formData));
    if (updateMyProfile.fulfilled.match(response) && response.payload?.user) {
      dispatch(
        setAuthUser({
          ...user,
          ...response.payload.user,
          token: user?.token,
        })
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please enter current and new password");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const response = await dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (changePassword.fulfilled.match(response)) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-red-700 via-red-700 to-red-700 p-6 text-white shadow-xl shadow-red-200">
            <h1 className="text-3xl font-extrabold md:text-4xl">My Profile</h1>
            <p className="mt-2 text-white/85">
              Manage your account details and security settings.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <form
              onSubmit={handleProfileSubmit}
              className="rounded-[2rem] bg-white p-6 shadow-xl shadow-red-100 ring-1 ring-red-100"
            >
              <h2 className="text-2xl font-bold text-slate-900">Profile Details</h2>

              <div className="mt-6 flex items-center gap-4">
                <img
                  src={
                    formData.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${formData.firstName} ${formData.lastName}`.trim() || "User"
                    )}&background=7c3aed&color=fff`
                  }
                  alt="avatar"
                  className="h-16 w-16 rounded-full border border-red-200 object-cover"
                />
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="Avatar image URL (optional)"
                  className="w-full rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 md:col-span-2"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 md:col-span-2"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 hover:from-red-700 hover:to-red-800 disabled:opacity-60"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>

            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-[2rem] bg-white p-6 shadow-xl shadow-red-100 ring-1 ring-red-100"
            >
              <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep your account secure by updating password regularly.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                  className="w-full rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  className="w-full rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-2xl border border-red-100 px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-2xl border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
