import axiosInstance from "./axiosInstance";

export const createBookingAPI = async (bookingData) => {
  const response = await axiosInstance.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookingsAPI = async () => {
  const response = await axiosInstance.get("/bookings/my");
  return response.data;
};

export const cancelBookingAPI = async (bookingId) => {
  const response = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
  return response.data;
};