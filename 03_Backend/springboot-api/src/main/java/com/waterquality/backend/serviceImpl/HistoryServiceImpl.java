package com.waterquality.backend.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.waterquality.backend.dto.HistoryResponse;
import com.waterquality.backend.entity.PredictionHistory;
import com.waterquality.backend.repository.PredictionHistoryRepository;
import com.waterquality.backend.service.HistoryService;

/**
 * Service implementation for fetching prediction history and recent telemetry tests.
 */
@Service
public class HistoryServiceImpl implements HistoryService {

    private final PredictionHistoryRepository predictionHistoryRepository;

    public HistoryServiceImpl(PredictionHistoryRepository predictionHistoryRepository) {
        this.predictionHistoryRepository = predictionHistoryRepository;
    }

    @Override
    public List<HistoryResponse> getAllHistory() {
        List<PredictionHistory> historyList = predictionHistoryRepository.findAll();
        return historyList.stream()
                .map(this::convertToHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<HistoryResponse> getRecentHistory() {
        List<PredictionHistory> historyList = predictionHistoryRepository.findTop10ByOrderByPredictedAtDesc();
        return historyList.stream()
                .map(this::convertToHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<HistoryResponse> getPaginatedHistory(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PredictionHistory> pageResult = predictionHistoryRepository.findAllByOrderByPredictedAtDesc(pageable);
        return pageResult.map(this::convertToHistoryResponse);
    }

    private HistoryResponse convertToHistoryResponse(PredictionHistory history) {
        return HistoryResponse.builder()
                .id(history.getId())
                .prediction(history.getPrediction())
                .confidence(history.getConfidence())
                .predictedAt(history.getPredictedAt().toString())
                .ph(history.getSensorData().getPh())
                .temperature(history.getSensorData().getTemperature())
                .turbidity(history.getSensorData().getTurbidity())
                .totalDissolvedSolids(history.getSensorData().getTotalDissolvedSolids())
                .conductivity(history.getSensorData().getConductivity())
                .isAnomaly(history.getSensorData().getIsAnomaly())
                .anomalyReason(history.getSensorData().getAnomalyReason())
                .build();
    }
}