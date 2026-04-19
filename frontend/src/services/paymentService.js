import axiosInstance from "./axiosInstance";

export const createOrderAPI = async (payload, token) => {
  const { data } = await axiosInstance.post(
    `/payments/create-order`,
    payload,
    {
      headers: token ? {
        Authorization: `Bearer ${token}`,
      } : undefined,
    }
  );

  return data;
};

export const verifyPaymentAPI = async (payload, token) => {
  const { data } = await axiosInstance.post(`/payments/verify`, payload, {
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : undefined,
  });

  return data;
};