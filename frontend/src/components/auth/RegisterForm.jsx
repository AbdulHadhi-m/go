import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  clearAuthError,
  registerUser,
} from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = (data) => {
    dispatch(registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
    }));
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
        <h1 className="text-3xl font-extrabold text-slate-900">Create account</h1>
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <div>
          <input
            {...register("firstName")}
            placeholder="First name"
            className={`w-full rounded-2xl border ${errors.firstName ? 'border-red-500' : 'border-red-100'} px-4 py-3 outline-none focus:ring-2 focus:ring-red-100`}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
           <input
             {...register("lastName")}
             placeholder="Last name"
             className={`w-full rounded-2xl border ${errors.lastName ? 'border-red-500' : 'border-red-100'} px-4 py-3 outline-none focus:ring-2 focus:ring-red-100`}
           />
           {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>

        <div className="md:col-span-2">
           <input
             {...register("email")}
             type="email"
             placeholder="Email"
             className={`w-full rounded-2xl border ${errors.email ? 'border-red-500' : 'border-red-100'} px-4 py-3 outline-none focus:ring-2 focus:ring-red-100`}
           />
           {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="md:col-span-2">
           <input
             {...register("password")}
             type="password"
             placeholder="Password"
             className={`w-full rounded-2xl border ${errors.password ? 'border-red-500' : 'border-red-100'} px-4 py-3 outline-none focus:ring-2 focus:ring-red-100`}
           />
           {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="md:col-span-2">
           <input
             {...register("confirmPassword")}
             type="password"
             placeholder="Confirm password"
             className={`w-full rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-red-100'} px-4 py-3 outline-none focus:ring-2 focus:ring-red-100`}
           />
           {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <label className="md:col-span-2 flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" className="mt-1 rounded" required />
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