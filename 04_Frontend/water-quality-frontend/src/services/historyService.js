import api from "./api";

export const getAllHistory = async () => {
  const response = await api.get("/history");
  return response.data.data;
};

export const getRecentHistory = async () => {
  const response = await api.get("/history/recent");
  return response.data.data;
};
