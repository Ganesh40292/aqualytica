package com.waterquality.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waterquality.backend.dto.HistoryResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.HistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

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

}