import api from "./api";

/**
 * Sends manually entered sample parameters to the Spring Boot /predict endpoint.
 */
export const predictWaterQuality = async (predictionData) => {
  const response = await api.post(
    "/predict",
    predictionData
  );
  return response.data.data;
};

/**
 * Triggers an on-demand hardware water quality measurement on the physical ESP32 node
 * via the Spring Boot MQTT bridge endpoint.
 *
 * Calls: POST /api/telemetry/trigger-test
 * Includes an automatic 1-time recovery retry for transient 500 bridge dispatches.
 * Returns: { success: true, message: "...", data: { ph, temperature, ... } }
 */
export const triggerHardwareTest = async (retryCount = 1) => {
  try {
    const response = await api.post("/telemetry/trigger-test");
    return response.data;
  } catch (error) {
    // If a transient 500 error occurred and retries remain, attempt recovery after 1200ms
    if (retryCount > 0 && error.response?.status === 500) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return triggerHardwareTest(retryCount - 1);
    }
    throw error;
  }
};
