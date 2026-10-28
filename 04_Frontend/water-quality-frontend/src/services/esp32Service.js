import api from "./api";

/**
 * Service to fetch real-time hardware status and heartbeat data of the ESP32 node.
 */
export const getEsp32Status = async () => {
  const response = await api.get("/esp32/status");
  return response.data.data;
};
