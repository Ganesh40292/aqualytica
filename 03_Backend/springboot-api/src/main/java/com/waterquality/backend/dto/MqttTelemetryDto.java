package com.waterquality.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object mapping inbound telemetry payloads received from the ESP32
 * over the Mosquitto MQTT broker (topic: aqualytica/sensors).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MqttTelemetryDto {

    @JsonProperty("device_id")
    private String deviceId;

    @JsonProperty("requestId")
    private String requestId;

    private Double ph;

    private Double turbidity;

    private Double tds;

    private Double ec;

    private Double temperature;

    @JsonProperty("temperature_valid")
    private Boolean temperatureValid;

    private String error;

}
