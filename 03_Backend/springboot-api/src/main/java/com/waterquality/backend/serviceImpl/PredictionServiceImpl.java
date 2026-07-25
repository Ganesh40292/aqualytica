package com.waterquality.backend.serviceImpl;

import org.springframework.stereotype.Service;

import com.waterquality.backend.client.PythonMlClient;
import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PredictionResponse;
import com.waterquality.backend.dto.PythonPredictionResponse;
import com.waterquality.backend.entity.PredictionHistory;
import com.waterquality.backend.entity.SensorData;
import com.waterquality.backend.repository.PredictionHistoryRepository;
import com.waterquality.backend.repository.SensorDataRepository;
import com.waterquality.backend.service.PredictionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final SensorDataRepository sensorDataRepository;

    private final PredictionHistoryRepository predictionHistoryRepository;

    private final PythonMlClient pythonMlClient;

    @Override
    public PredictionResponse predictWaterQuality(
            PredictionRequest request) {

        // Save Sensor Data

        SensorData sensorData = SensorData.builder()

                .ph(request.getPh())

                .temperature(request.getTemperature())

                .turbidity(request.getTurbidity())

                .totalDissolvedSolids(request.getTotalDissolvedSolids())

                .conductivity(request.getConductivity())

                .nitrate(request.getNitrate())

                .chloride(request.getChloride())

                .build();

        sensorData = sensorDataRepository.save(sensorData);

        // Call Python ML API

        PythonPredictionResponse pythonResponse =
                pythonMlClient.getPrediction(request);

        // Save Prediction History

        PredictionHistory history = PredictionHistory.builder()

                .sensorData(sensorData)

                .prediction(pythonResponse.getPrediction())

                .confidence(pythonResponse.getConfidence())

                .build();

        predictionHistoryRepository.save(history);

        // Return Final Response

        return PredictionResponse.builder()

                .prediction(pythonResponse.getPrediction())

                .confidence(pythonResponse.getConfidence())

                .timestamp(history.getPredictedAt().toString())

                .build();

    }

}