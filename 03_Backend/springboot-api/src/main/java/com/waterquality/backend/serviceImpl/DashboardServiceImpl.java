package com.waterquality.backend.serviceImpl;

import org.springframework.stereotype.Service;

import com.waterquality.backend.dto.DashboardResponse;
import com.waterquality.backend.repository.PredictionHistoryRepository;
import com.waterquality.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PredictionHistoryRepository predictionHistoryRepository;

    @Override
    public DashboardResponse getDashboardStatistics() {

        Long totalPredictions =
                predictionHistoryRepository.count();

        Long potableCount =
                predictionHistoryRepository.countByPrediction("Potable");

        Long notPotableCount =
                predictionHistoryRepository.countByPrediction("Not Potable");

        Double averageConfidence =
                predictionHistoryRepository.getAverageConfidence();

        if (averageConfidence == null) {
            averageConfidence = 0.0;
        }

        averageConfidence =
                Math.round(averageConfidence * 100.0) / 100.0;

        return DashboardResponse.builder()

                .totalPredictions(totalPredictions)

                .potableCount(potableCount)

                .notPotableCount(notPotableCount)

                .averageConfidence(averageConfidence)

                .build();

    }

}