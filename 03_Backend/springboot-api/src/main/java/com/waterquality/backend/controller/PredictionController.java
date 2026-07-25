package com.waterquality.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waterquality.backend.dto.PredictionRequest;
import com.waterquality.backend.dto.PredictionResponse;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.PredictionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping("/predict")
    public ApiResponse<PredictionResponse> predict(

            @Valid
            @RequestBody PredictionRequest request) {

        PredictionResponse response =
                predictionService.predictWaterQuality(request);

        return ApiResponse.<PredictionResponse>builder()

                .success(true)

                .message("Prediction Generated Successfully")

                .data(response)

                .build();

    }

}