import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthUser, fetchCurrentUser } from "../features/auth/authSlice";

export default function LoginSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");

    if (token) {
      dispatch(
        setAuthUser({
          token,
          email,
          firstName,
          lastName,
        })
      );
      
      dispatch(fetchCurrentUser()).finally(() => {
        navigate("/", { replace: true });
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Completing login...
        </h2>
        <p className="mt-2 text-slate-500">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
