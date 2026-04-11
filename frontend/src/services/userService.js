import axiosInstance from "./axiosInstance";

export const getMyProfileAPI = async () => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};

export const updateMyProfileAPI = async (payload) => {
  const { data } = await axiosInstance.put("/users/profile", payload);
  return data;
};

export const changePasswordAPI = async (payload) => {
  const { data } = await axiosInstance.put("/users/change-password", payload);
  return data;
};

export const uploadAvatarAPI = async (payload) => {
  const { data } = await axiosInstance.put("/users/avatar", payload);
  return data;
};
