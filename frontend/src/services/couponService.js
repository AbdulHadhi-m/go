import axiosInstance from "./axiosInstance";

export const applyCouponAPI = async (payload) => {
  const { data } = await axiosInstance.post("/coupons/apply", payload);
  return data;
};

export const createCouponAPI = async (payload) => {
  const { data } = await axiosInstance.post("/coupons", payload);
  return data;
};

export const getAdminCouponsAPI = async () => {
  const { data } = await axiosInstance.get("/coupons");
  return data;
};

export const toggleCouponAPI = async (couponId) => {
  const { data } = await axiosInstance.patch(`/coupons/${couponId}/toggle`);
  return data;
};
