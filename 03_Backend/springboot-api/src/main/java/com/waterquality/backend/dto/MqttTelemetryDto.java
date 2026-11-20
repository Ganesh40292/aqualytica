package com.waterquality.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
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
    @JsonAlias({"deviceId", "device_name", "macAddress", "node_id"})
    private String deviceId;

    @JsonProperty("requestId")
    @JsonAlias({"request_id", "reqId", "id"})
    private String requestId;

    private Double ph;

    private Double turbidity;

    @JsonProperty("tds")
    @JsonAlias({"totalDissolvedSolids", "TDS", "total_dissolved_solids"})
    private Double tds;

    @JsonProperty("ec")
    @JsonAlias({"conductivity", "EC", "electrical_conductivity"})
    private Double ec;

    private Double temperature;

    @JsonProperty("temperature_valid")
    @JsonAlias({"temperatureValid", "temp_valid"})
    private Boolean temperatureValid;

    private String error;

    public Double getEffectiveEc() {
        if (ec != null && ec > 0) return ec;
        if (tds != null && tds > 0) return tds * 2.0;
        return 300.0;
    }

    public Double getEffectiveTds() {
        if (tds != null && tds > 0) return tds;
        if (ec != null && ec > 0) return ec / 2.0;
        return 150.0;
    }
}
