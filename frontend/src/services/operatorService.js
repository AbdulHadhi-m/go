import axiosInstance from "./axiosInstance";

export const getOperatorBusesAPI = async () => {
  const { data } = await axiosInstance.get("/operator/buses");
  return data;
};

export const createBusAPI = async (payload) => {
  const { data } = await axiosInstance.post("/operator/buses", payload);
  return data;
};

export const updateBusAPI = async (id, payload) => {
  const { data } = await axiosInstance.put(`/operator/buses/${id}`, payload);
  return data;
};

export const deleteBusAPI = async (id) => {
  const { data } = await axiosInstance.delete(`/operator/buses/${id}`);
  return data;
};

export const getOperatorTripsAPI = async () => {
  const { data } = await axiosInstance.get("/operator/trips");
  return data;
};

export const createTripAPI = async (payload) => {
  const { data } = await axiosInstance.post("/operator/trips", payload);
  return data;
};

export const updateTripAPI = async (id, payload) => {
  const { data } = await axiosInstance.put(`/operator/trips/${id}`, payload);
  return data;
};

export const markTripCompletedAPI = async (id) => {
  const { data } = await axiosInstance.patch(`/operator/trips/${id}/complete`);
  return data;
};

export const cancelTripAPI = async (id, reason) => {
  const { data } = await axiosInstance.patch(`/operator/trips/${id}/cancel`, { reason });
  return data;
};

export const getOperatorBookingsAPI = async () => {
  const { data } = await axiosInstance.get("/operator/bookings");
  return data;
};

export const getRevenueSummaryAPI = async () => {
  const { data } = await axiosInstance.get("/operator/summary/revenue");
  return data;
};

export const getRouteAnalyticsAPI = async () => {
  const { data } = await axiosInstance.get("/operator/analytics/routes");
  return data;
};
