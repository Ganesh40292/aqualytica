package com.waterquality.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.waterquality.backend.dto.Esp32StatusDto;
import com.waterquality.backend.response.ApiResponse;
import com.waterquality.backend.service.Esp32StatusService;

/**
 * REST controller providing real-time hardware status of the ESP32 IoT node.
 */
@RestController
@RequestMapping("/api/esp32")
public class Esp32StatusController {

    private final Esp32StatusService esp32StatusService;

    public Esp32StatusController(Esp32StatusService esp32StatusService) {
        this.esp32StatusService = esp32StatusService;
    }

    @GetMapping("/status")
    public ApiResponse<Esp32StatusDto> getStatus() {
        return ApiResponse.<Esp32StatusDto>builder()
                .success(true)
                .message("ESP32 Device Status Retrieved Successfully")
                .data(esp32StatusService.getStatus())
                .build();
    }
}
