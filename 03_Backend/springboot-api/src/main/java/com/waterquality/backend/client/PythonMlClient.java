package com.waterquality.backend.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PythonPredictionResponse;

@Component
public class PythonMlClient {

    private final RestClient restClient;

    public PythonMlClient() {

        this.restClient = RestClient.builder()
                .baseUrl("http://127.0.0.1:5000")
                .build();

    }

    public PythonPredictionResponse getPrediction(
            PredictionRequest request) {

        return restClient.post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(PythonPredictionResponse.class);

    }

}