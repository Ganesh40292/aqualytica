package com.waterquality.backend.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.waterquality.backend.dto.LiveTestResponse;
import com.waterquality.backend.dto.MqttTelemetryDto;
import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PredictionResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.Esp32StatusService;
import com.waterquality.backend.service.MqttHardwareService;
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
    private final MqttHardwareService mqttHardwareService;
    private final Map<String, Long> clientLastRequestMap = new ConcurrentHashMap<>();

    public PredictionController(PredictionService predictionService,
                                Esp32StatusService esp32StatusService,
                                MqttHardwareService mqttHardwareService) {
        this.predictionService = predictionService;
        this.esp32StatusService = esp32StatusService;
        this.mqttHardwareService = mqttHardwareService;
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

    /**
     * Triggers an on-demand physical sensor acquisition from the ESP32 hardware via MQTT Mosquitto,
     * performs single-active-test concurrency validation, correlates response via requestId,
     * guards against invalid DS18B20 readings without fabricating temperature,
     * and executes ML potability classification upon successful sensor acquisition.
     */
    @PostMapping("/telemetry/trigger-test")
    public ApiResponse<LiveTestResponse> triggerHardwareTest(HttpServletRequest servletRequest) {
        String clientIp = extractClientIp(servletRequest);
        checkRateLimit(clientIp);

        CompletableFuture<MqttTelemetryDto> future;
        try {
            future = mqttHardwareService.triggerHardwareReading();
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to initiate hardware test: " + ex.getMessage(), ex);
        }

        MqttTelemetryDto telemetry;
        try {
            // Await future with 12s timeout (internal MQTT timeout is 10s)
            telemetry = future.get(12, TimeUnit.SECONDS);
        } catch (TimeoutException te) {
            throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT, "ESP32 hardware did not respond within the 10-second timeout window. Please ensure device is online.", te);
        } catch (ExecutionException ee) {
            Throwable cause = ee.getCause();
            if (cause instanceof ResponseStatusException rse) {
                throw rse;
            } else if (cause instanceof TimeoutException) {
                throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT, "ESP32 hardware did not respond within the 10-second timeout window. Please ensure device is online.", cause);
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Hardware acquisition error: " + cause.getMessage(), cause);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Hardware acquisition was interrupted.", ie);
        }

        // Check if device reported busy
        if ("DEVICE_BUSY".equalsIgnoreCase(telemetry.getError())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "ESP32 hardware is currently busy executing another routine. Please retry shortly.");
        }

        // Record heartbeat
        esp32StatusService.recordHeartbeat(clientIp, telemetry.getDeviceId() != null ? telemetry.getDeviceId() : "AQUALYTICA_ESP32", null);

        // Robust temperature check: valid if explicitly true OR (not explicitly false and within physical water bounds)
        boolean isTempValid = (telemetry.getTemperatureValid() == null || Boolean.TRUE.equals(telemetry.getTemperatureValid()))
                && telemetry.getTemperature() != null
                && telemetry.getTemperature() >= -10.0
                && telemetry.getTemperature() <= 70.0;

        if (!isTempValid) {
            LiveTestResponse faultResponse = LiveTestResponse.builder()
                    .ph(telemetry.getPh())
                    .temperature(telemetry.getTemperature())
                    .turbidity(telemetry.getTurbidity())
                    .totalDissolvedSolids(telemetry.getEffectiveTds())
                    .conductivity(telemetry.getEffectiveEc())
                    .temperatureValid(false)
                    .isHardwareFault(true)
                    .hardwareFaultReason("DS18B20 Temperature Sensor probe disconnected or invalid. Reading rejected to prevent ML distortion.")
                    .isAnomaly(false)
                    .anomalyReason(null)
                    .prediction(null)
                    .confidence(0.0)
                    .timestamp(Instant.now().toString())
                    .build();

            return ApiResponse.<LiveTestResponse>builder()
                    .success(true)
                    .message("Hardware Reading Acquired (Temperature Sensor Fault Detected)")
                    .data(faultResponse)
                    .build();
        }

        // Temperature is valid: construct sanitized PredictionRequest and reuse predictionService
        PredictionRequest request = PredictionRequest.builder()
                .ph(telemetry.getPh() != null ? telemetry.getPh() : 7.2)
                .temperature(telemetry.getTemperature())
                .turbidity(telemetry.getTurbidity() != null ? telemetry.getTurbidity() : 0.5)
                .totalDissolvedSolids(telemetry.getEffectiveTds())
                .conductivity(telemetry.getEffectiveEc())
                .build();

        PredictionResponse predResponse = predictionService.predictWaterQuality(request);

        LiveTestResponse response = LiveTestResponse.builder()
                .ph(request.getPh())
                .temperature(request.getTemperature())
                .turbidity(request.getTurbidity())
                .totalDissolvedSolids(request.getTotalDissolvedSolids())
                .conductivity(request.getConductivity())
                .temperatureValid(true)
                .isHardwareFault(false)
                .hardwareFaultReason(null)
                .isAnomaly(predResponse.getIsAnomaly())
                .anomalyReason(predResponse.getAnomalyReason())
                .prediction(predResponse.getPrediction())
                .confidence(predResponse.getConfidence())
                .timestamp(predResponse.getTimestamp() != null ? predResponse.getTimestamp() : Instant.now().toString())
                .build();

        return ApiResponse.<LiveTestResponse>builder()
                .success(true)
                .message("Hardware Reading Acquired and Classified Successfully")
                .data(response)
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
