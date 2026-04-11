import axiosInstance from "./axiosInstance";
import { isValidObjectId } from "../utils/isValidObjectId";

const cleanTogglePayload = (payload) => {
  const body = { ...payload };
  if (!isValidObjectId(body.tripId)) {
    delete body.tripId;
  }
  return body;
};

export const addFavoriteAPI = async (payload) => {
  const { data } = await axiosInstance.post("/favorites", cleanTogglePayload(payload));
  return data;
};

export const getMyFavoritesAPI = async () => {
  const { data } = await axiosInstance.get("/favorites/my");
  return data;
};

export const removeFavoriteAPI = async (favoriteId) => {
  const { data } = await axiosInstance.delete(`/favorites/${favoriteId}`);
  return data;
};

export const toggleFavoriteAPI = async (payload) => {
  const { data } = await axiosInstance.post(
    "/favorites/toggle",
    cleanTogglePayload(payload)
  );
  return data;
};
