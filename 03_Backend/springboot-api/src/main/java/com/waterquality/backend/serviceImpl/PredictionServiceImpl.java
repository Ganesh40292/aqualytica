package com.waterquality.backend.serviceImpl;

import java.util.ArrayList;
import java.util.List;

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

/**
 * Service implementation for processing water telemetry, validating physical bounds,
 * persisting measurements, querying the Python ML Random Forest model, and recording prediction history.
 */
@Service
public class PredictionServiceImpl implements PredictionService {

    private final SensorDataRepository sensorDataRepository;
    private final PredictionHistoryRepository predictionHistoryRepository;
    private final PythonMlClient pythonMlClient;

    public PredictionServiceImpl(SensorDataRepository sensorDataRepository,
                                 PredictionHistoryRepository predictionHistoryRepository,
                                 PythonMlClient pythonMlClient) {
        this.sensorDataRepository = sensorDataRepository;
        this.predictionHistoryRepository = predictionHistoryRepository;
        this.pythonMlClient = pythonMlClient;
    }

    @Override
    public PredictionResponse predictWaterQuality(PredictionRequest request) {
        // 1. Run physical sensor plausibility and anomaly checks
        List<String> anomalyReasons = new ArrayList<>();
        if (request.getPh() < 2.0 || request.getPh() > 12.0) {
            anomalyReasons.add("Extreme pH level (" + request.getPh() + ")");
        }
        if (request.getTemperature() < 0.0 || request.getTemperature() > 60.0) {
            anomalyReasons.add("Abnormal water temperature (" + request.getTemperature() + "°C)");
        }
        if (request.getTurbidity() > 500.0) {
            anomalyReasons.add("Extreme turbidity saturation (" + request.getTurbidity() + " NTU)");
        }
        if (request.getTotalDissolvedSolids() > 2500.0) {
            anomalyReasons.add("Elevated TDS saturation (" + request.getTotalDissolvedSolids() + " mg/L)");
        }
        if (request.getConductivity() > 5000.0) {
            anomalyReasons.add("Excessive electrical conductivity (" + request.getConductivity() + " µS/cm)");
        }

        boolean isAnomaly = !anomalyReasons.isEmpty();
        String anomalyReason = isAnomaly ? String.join("; ", anomalyReasons) : null;

        // 2. Persist raw physical-chemical sensor readings with anomaly flags
        SensorData sensorData = SensorData.builder()
                .ph(request.getPh())
                .temperature(request.getTemperature())
                .turbidity(request.getTurbidity())
                .totalDissolvedSolids(request.getTotalDissolvedSolids())
                .conductivity(request.getConductivity())
                .isAnomaly(isAnomaly)
                .anomalyReason(anomalyReason)
                .build();
        sensorData = sensorDataRepository.save(sensorData);

        // 3. Query Python ML microservice for Random Forest classification & confidence
        PythonPredictionResponse pythonResponse = pythonMlClient.getPrediction(request);

        // 4. Persist prediction classification result linked to sensor data
        PredictionHistory history = PredictionHistory.builder()
                .sensorData(sensorData)
                .prediction(pythonResponse.getPrediction())
                .confidence(pythonResponse.getConfidence())
                .build();
        predictionHistoryRepository.save(history);

        // 5. Return unified response
        return PredictionResponse.builder()
                .prediction(pythonResponse.getPrediction())
                .confidence(pythonResponse.getConfidence())
                .timestamp(history.getPredictedAt().toString())
                .isAnomaly(isAnomaly)
                .anomalyReason(anomalyReason)
                .build();
    }
}