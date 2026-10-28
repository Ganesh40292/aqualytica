package com.waterquality.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waterquality.backend.dto.HistoryResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.HistoryService;

/**
 * REST controller for retrieving historical water quality evaluations and recent telemetry tests.
 */
@RestController
@RequestMapping("/api")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/history")
    public ApiResponse<List<HistoryResponse>> getHistory() {
        return ApiResponse.<List<HistoryResponse>>builder()
                .success(true)
                .message("Prediction History Retrieved Successfully")
                .data(historyService.getAllHistory())
                .build();
    }

    @GetMapping("/history/recent")
    public ApiResponse<List<HistoryResponse>> getRecentHistory() {
        return ApiResponse.<List<HistoryResponse>>builder()
                .success(true)
                .message("Recent Predictions Retrieved Successfully")
                .data(historyService.getRecentHistory())
                .build();
    }

    @GetMapping("/history/page")
    public ApiResponse<org.springframework.data.domain.Page<HistoryResponse>> getPaginatedHistory(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<org.springframework.data.domain.Page<HistoryResponse>>builder()
                .success(true)
                .message("Paginated Prediction History Retrieved Successfully")
                .data(historyService.getPaginatedHistory(page, size))
                .build();
    }
}