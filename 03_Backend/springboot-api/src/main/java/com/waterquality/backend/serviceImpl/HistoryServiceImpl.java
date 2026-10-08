package com.waterquality.backend.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.waterquality.backend.dto.HistoryResponse;
import com.waterquality.backend.entity.PredictionHistory;
import com.waterquality.backend.repository.PredictionHistoryRepository;
import com.waterquality.backend.service.HistoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final PredictionHistoryRepository predictionHistoryRepository;

    @Override
    public List<HistoryResponse> getAllHistory() {

        List<PredictionHistory> historyList =
                predictionHistoryRepository.findAll();

        return historyList.stream()

                .map(this::convertToHistoryResponse)

                .collect(Collectors.toList());

    }

    @Override
    public List<HistoryResponse> getRecentHistory() {

        List<PredictionHistory> historyList =
                predictionHistoryRepository
                        .findTop10ByOrderByPredictedAtDesc();

        return historyList.stream()

                .map(this::convertToHistoryResponse)

                .collect(Collectors.toList());

    }

    private HistoryResponse convertToHistoryResponse(
            PredictionHistory history) {

        return HistoryResponse.builder()

                .id(history.getId())

                .prediction(history.getPrediction())

                .confidence(history.getConfidence())

                .predictedAt(
                        history.getPredictedAt().toString())

                .ph(history.getSensorData().getPh())

                .temperature(
                        history.getSensorData().getTemperature())

                .turbidity(
                        history.getSensorData().getTurbidity())

                .totalDissolvedSolids(
                        history.getSensorData().getTotalDissolvedSolids())

                .conductivity(
                        history.getSensorData().getConductivity())

                .build();

    }

}