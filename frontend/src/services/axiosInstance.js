import axios from "axios";

const normalizeApiBase = (url) => {
  const defaultBase = "http://localhost:5000/api";
  if (!url) return defaultBase;

  const raw = String(url).trim();
  if (!raw) return defaultBase;

  // If someone configured VITE_API_URL as "/api", "api", or another relative path,
  // force it to backend origin so requests do not hit Vite (5173).
  if (raw.startsWith("/")) {
    return raw === "/api" ? "http://localhost:5000/api" : `http://localhost:5000${raw.replace(/\/+$/, "")}`;
  }
  if (raw === "api" || raw === "api/") {
    return "http://localhost:5000/api";
  }

  const trimmed = raw.replace(/\/+$/, "");
  const normalized = trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;

  // Guard: if API URL accidentally points to Vite dev server, redirect to backend.
  if (normalized.includes("localhost:5173") || normalized.includes("127.0.0.1:5173")) {
    return normalized
      .replace("localhost:5173", "localhost:5000")
      .replace("127.0.0.1:5173", "127.0.0.1:5000");
  }

  return normalized;
};

const axiosInstance = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_URL),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;