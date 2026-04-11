import axiosInstance from "./axiosInstance";

export const getAdminStatsAPI = async () => {
  const { data } = await axiosInstance.get("/admin/dashboard/stats");
  return data;
};

export const getAllUsersAPI = async () => {
  const { data } = await axiosInstance.get("/admin/users");
  return data;
};

export const toggleUserBlockAPI = async (userId) => {
  const { data } = await axiosInstance.patch(`/admin/users/${userId}/block`);
  return data;
};

export const getAllOperatorsAPI = async () => {
  const { data } = await axiosInstance.get("/admin/operators");
  return data;
};

export const approveOperatorAPI = async (userId) => {
  const { data } = await axiosInstance.patch(`/admin/operators/${userId}/approve`);
  return data;
};

export const rejectOperatorAPI = async (userId, reason) => {
  const { data } = await axiosInstance.patch(`/admin/operators/${userId}/reject`, {
    reason,
  });
  return data;
};

export const getAllBusesAPI = async () => {
  const { data } = await axiosInstance.get("/admin/buses");
  return data;
};

export const deleteAnyBusAPI = async (busId) => {
  const { data } = await axiosInstance.delete(`/admin/buses/${busId}`);
  return data;
};

export const getAllBookingsAPI = async () => {
  const { data } = await axiosInstance.get("/admin/bookings");
  return data;
};

export const getComplaintsAPI = async () => {
  const { data } = await axiosInstance.get("/admin/complaints");
  return data;
};

export const updateComplaintAPI = async (complaintId, payload) => {
  const { data } = await axiosInstance.patch(`/admin/complaints/${complaintId}`, payload);
  return data;
};
