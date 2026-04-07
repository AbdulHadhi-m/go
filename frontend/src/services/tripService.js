import axiosInstance from "./axiosInstance";

export const getTripsAPI = async (searchData = {}) => {
  const params = new URLSearchParams();

  if (searchData.from) params.append("from", searchData.from);
  if (searchData.to) params.append("to", searchData.to);
  if (searchData.date) params.append("date", searchData.date);

  const { data } = await axiosInstance.get(`/trips?${params.toString()}`);
  return data;
};

export const getTripByIdAPI = async (tripId) => {
  const { data } = await axiosInstance.get(`/trips/${tripId}`);
  return data;
};

export const getTripSeatsAPI = async (tripId) => {
  const { data } = await axiosInstance.get(`/trips/${tripId}/seats`);
  return data;
};