package com.waterquality.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waterquality.backend.dto.DashboardResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> getDashboard() {

        return ApiResponse.<DashboardResponse>builder()

                .success(true)

                .message("Dashboard Statistics Retrieved Successfully")

                .data(dashboardService.getDashboardStatistics())

                .build();

    }

}