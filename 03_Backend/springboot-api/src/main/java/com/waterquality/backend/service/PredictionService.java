package com.waterquality.backend.service;

import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PredictionResponse;

public interface PredictionService {

    PredictionResponse predictWaterQuality(
            PredictionRequest request);

}