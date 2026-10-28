package com.waterquality.backend.client;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PythonPredictionResponse;

/**
 * Resilient HTTP REST client communicating with the Python Flask Machine Learning microservice.
 * Configured with timeouts, retries, health checking, and graceful heuristic fallback.
 */
@Component
public class PythonMlClient {

    private static final Logger log = LoggerFactory.getLogger(PythonMlClient.class);

    private final RestClient restClient;
    private final String mlServiceUrl;

    public PythonMlClient(@Value("${ml.service.url:http://127.0.0.1:5000}") String mlServiceUrl) {
        this.mlServiceUrl = mlServiceUrl;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(3));

        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public PythonPredictionResponse getPrediction(PredictionRequest request) {
        int maxRetries = 2;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return restClient.post()
                        .uri("/predict")
                        .body(request)
                        .retrieve()
                        .body(PythonPredictionResponse.class);
            } catch (Exception ex) {
                lastException = ex;
                log.warn("Attempt {} to invoke ML service at {} failed: {}", attempt, mlServiceUrl, ex.getMessage());
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        log.error("ML service unreachable at {} after {} attempts. Falling back to heuristic water safety model.", mlServiceUrl, maxRetries, lastException);
        return generateHeuristicFallback(request);
    }

    public boolean isHealthy() {
        try {
            String response = restClient.get()
                    .uri("/health")
                    .retrieve()
                    .body(String.class);
            return response != null && response.contains("UP");
        } catch (Exception e) {
            return false;
        }
    }

    private PythonPredictionResponse generateHeuristicFallback(PredictionRequest req) {
        boolean isSafe = req.getPh() >= 6.5 && req.getPh() <= 8.5
                && req.getTurbidity() <= 5.0
                && req.getTotalDissolvedSolids() <= 600.0;

        return PythonPredictionResponse.builder()
                .prediction(isSafe ? "Potable" : "Not Potable")
                .confidence(72.5)
                .build();
    }
}