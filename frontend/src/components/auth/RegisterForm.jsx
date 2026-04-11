import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  registerUser,
} from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Registration successful");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    dispatch(registerUser(payload));
  };

  const handleGoogleLogin = () => {
    const apiBase =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";

    window.location.href = `${apiBase}/api/auth/google`;
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Create account
</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create your account and start booking in minutes.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <img src="/images/google.svg" alt="google" className="h-6"/>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-400">or register with email</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          className="rounded-2xl border border-red-100 px-4 py-3"
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          className="rounded-2xl border border-red-100 px-4 py-3"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="md:col-span-2 rounded-2xl border border-red-100 px-4 py-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="md:col-span-2 rounded-2xl border border-red-100 px-4 py-3"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="md:col-span-2 rounded-2xl border border-red-100 px-4 py-3"
        />

        <label className="md:col-span-2 flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" className="mt-1 rounded" />
          <span>
            I agree to{" "}
            <span className="text-red-700 font-semibold">Terms</span> and{" "}
            <span className="text-red-700 font-semibold">Privacy Policy</span>
          </span>
        </label>

        <button
          disabled={loading}
          className="md:col-span-2 rounded-2xl bg-red-700 px-5 py-3 text-white hover:bg-red-800 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-red-700 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}