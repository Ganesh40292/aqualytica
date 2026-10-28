package com.waterquality.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PredictionResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.Esp32StatusService;
import com.waterquality.backend.service.PredictionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * REST controller for water quality assessment, telemetry ingestion, rate limiting, and ML classification.
 */
@RestController
@RequestMapping("/api")
public class PredictionController {

    private final PredictionService predictionService;
    private final Esp32StatusService esp32StatusService;
    private final Map<String, Long> clientLastRequestMap = new ConcurrentHashMap<>();

    public PredictionController(PredictionService predictionService, Esp32StatusService esp32StatusService) {
        this.predictionService = predictionService;
        this.esp32StatusService = esp32StatusService;
    }

    @PostMapping({"/predict", "/telemetry"})
    public ApiResponse<PredictionResponse> predict(
            @Valid @RequestBody PredictionRequest request,
            HttpServletRequest servletRequest,
            @RequestHeader(value = "X-Device-ID", required = false) String deviceId,
            @RequestHeader(value = "X-Device-RSSI", required = false) Integer rssi) {

        String clientIp = extractClientIp(servletRequest);
        checkRateLimit(clientIp);

        // Record active telemetry heartbeat for live node monitor
        esp32StatusService.recordHeartbeat(clientIp, deviceId, rssi);

        PredictionResponse response = predictionService.predictWaterQuality(request);
        return ApiResponse.<PredictionResponse>builder()
                .success(true)
                .message("Prediction Generated Successfully")
                .data(response)
                .build();
    }

    @PostMapping("/telemetry/batch")
    public ApiResponse<List<PredictionResponse>> ingestBatch(
            @Valid @RequestBody List<PredictionRequest> batchRequests,
            HttpServletRequest servletRequest,
            @RequestHeader(value = "X-Device-ID", required = false) String deviceId,
            @RequestHeader(value = "X-Device-RSSI", required = false) Integer rssi) {

        String clientIp = extractClientIp(servletRequest);
        esp32StatusService.recordHeartbeat(clientIp, deviceId, rssi);

        List<PredictionResponse> results = new ArrayList<>();
        for (PredictionRequest req : batchRequests) {
            results.add(predictionService.predictWaterQuality(req));
        }

        return ApiResponse.<List<PredictionResponse>>builder()
                .success(true)
                .message("Batch Telemetry Processed (" + results.size() + " records)")
                .data(results)
                .build();
    }

    private void checkRateLimit(String clientIp) {
        long now = System.currentTimeMillis();
        Long lastTime = clientLastRequestMap.get(clientIp);
        // Minimum interval of 1200ms between requests to prevent runaway loops
        if (lastTime != null && (now - lastTime) < 1200) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Telemetry ingestion rate limit exceeded. Please wait at least 2 seconds between packets."
            );
        }
        clientLastRequestMap.put(clientIp, now);
    }

    private String extractClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}