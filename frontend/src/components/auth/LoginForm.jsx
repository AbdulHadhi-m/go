// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearAuthError,
//   loginUser,
// } from "../../features/auth/authSlice";
// import {
//   selectAuthError,
//   selectAuthLoading,
//   selectIsAuthenticated,
// } from "../../features/auth/authSelectors";

// export default function LoginForm() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const loading = useSelector(selectAuthLoading);
//   const error = useSelector(selectAuthError);
//   const isAuthenticated = useSelector(selectIsAuthenticated);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const from = location.state?.from?.pathname || "/";

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearAuthError());
//     }
//   }, [error, dispatch]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       toast.success("Login successful");
//       navigate(from, { replace: true });
//     }
//   }, [isAuthenticated, navigate, from]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(loginUser(formData));
//   };

//   const handleGoogleLogin = () => {
//     const apiBase =
//       import.meta.env.VITE_API_URL?.replace("/api", "") ||
//       "http://localhost:5000";

//     window.location.href = `${apiBase}/api/auth/google`;
//   };

//   return (
//     <div className="mx-auto max-w-md">
//       <div className="mb-8">
//         <h1 className="text-3xl font-extrabold text-slate-900">Log in to your account
// </h1>
//         <p className="mt-2 text-sm text-slate-500">
//           Enter your details to continue your booking journey.
//         </p>
//       </div>

//       <button
//         type="button"
//         onClick={handleGoogleLogin}
//         className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
//       >
//         <img src="/images/google.svg" alt="google" className="h-6"/>
//         Continue with Google
//       </button>

//       <div className="my-6 flex items-center gap-3">
//         <div className="h-px flex-1 bg-slate-200" />
//         <span className="text-sm text-slate-400">or continue with email</span>
//         <div className="h-px flex-1 bg-slate-200" />
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full rounded-2xl border border-red-100 px-4 py-3"
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full rounded-2xl border border-red-100 px-4 py-3"
//         />

//         <div className="flex justify-between text-sm">
//           <label className="flex gap-2">
//             <input type="checkbox" />
//             Remember me
//           </label>

//           <Link to="/forgot-password" className="text-red-700">
//             Forgot password?
//           </Link>
//         </div>

//         <button
//           disabled={loading}
//           className="w-full rounded-2xl bg-red-700 py-3 text-white hover:bg-red-800 disabled:opacity-60"
//         >
//           {loading ? "Signing In..." : "Sign In"}
//         </button>
//       </form>

//       <p className="mt-6 text-center text-sm text-slate-500">
//         Don’t have an account?{" "}
//         <Link to="/register" className="text-red-700 font-semibold">
//           Create account
//         </Link>
//       </p>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuthError,
  loginUser,
} from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
} from "../../features/auth/authSelectors";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "operator") {
        navigate("/operator/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
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
        <h1 className="text-3xl font-extrabold text-slate-900">
          Log in to your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your details to continue your booking journey.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <img src="/images/google.svg" alt="google" className="h-6" />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-400">or continue with email</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-red-100 px-4 py-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-2xl border border-red-100 px-4 py-3"
        />

        <div className="flex justify-between text-sm">
          <label className="flex gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <Link to="/forgot-password" className="text-red-700">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-2xl bg-red-700 py-3 text-white hover:bg-red-800 disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don’t have an account?{" "}
        <Link to="/register" className="font-semibold text-red-700">
          Create account
        </Link>
      </p>
    </div>
  );
}