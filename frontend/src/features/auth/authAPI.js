// src/features/auth/authAPI.js
import axiosInstance from "../../services/axiosInstance";

export const registerRequest = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

export const loginRequest = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data;
};

export const getMeRequest = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const logoutRequest = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};