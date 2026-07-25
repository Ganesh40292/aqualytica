import api from "./api";

export const predictWaterQuality = async (predictionData) => {

    const response = await api.post(
        "/predict",
        predictionData
    );

    return response.data.data;

};