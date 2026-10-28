package com.waterquality.backend.serviceImpl;

import org.springframework.stereotype.Service;

import com.waterquality.backend.dto.DashboardResponse;
import com.waterquality.backend.repository.PredictionHistoryRepository;
import com.waterquality.backend.service.DashboardService;

/**
 * Service implementation for aggregating global water telemetry statistics
 * including total tests, potable counts, contaminated counts, and average AI confidence.
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private final PredictionHistoryRepository predictionHistoryRepository;

    public DashboardServiceImpl(PredictionHistoryRepository predictionHistoryRepository) {
        this.predictionHistoryRepository = predictionHistoryRepository;
    }

    @Override
    public DashboardResponse getDashboardStatistics() {
        Long totalPredictions = predictionHistoryRepository.count();
        Long potableCount = predictionHistoryRepository.countByPrediction("Potable");
        Long notPotableCount = predictionHistoryRepository.countByPrediction("Not Potable");
        Double averageConfidence = predictionHistoryRepository.getAverageConfidence();

        if (averageConfidence == null) {
            averageConfidence = 0.0;
        }
        averageConfidence = Math.round(averageConfidence * 100.0) / 100.0;

        return DashboardResponse.builder()
                .totalPredictions(totalPredictions)
                .potableCount(potableCount)
                .notPotableCount(notPotableCount)
                .averageConfidence(averageConfidence)
                .build();
    }
}