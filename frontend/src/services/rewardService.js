import axiosInstance from "./axiosInstance";

export const getRewardBalanceAPI = async () => {
  const { data } = await axiosInstance.get("/rewards/balance");
  return data;
};

export const getRewardHistoryAPI = async () => {
  const { data } = await axiosInstance.get("/rewards/history");
  return data;
};

export const redeemPreviewAPI = async (totalAmount) => {
  const { data } = await axiosInstance.post("/rewards/redeem-preview", { totalAmount });
  return data;
};
