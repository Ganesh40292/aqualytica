package com.waterquality.backend.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.waterquality.backend.dto.Esp32StatusDto;
import com.waterquality.backend.entity.SensorData;
import com.waterquality.backend.repository.SensorDataRepository;

/**
 * Service tracking active hardware telemetry heartbeats and connection availability
 * for the physical ESP32 NodeMCU microcontroller.
 */
@Service
public class Esp32StatusService {

    private final SensorDataRepository sensorDataRepository;
    private volatile LocalDateTime lastHeartbeatTime;
    private volatile String lastIpAddress = "192.168.1.105";
    private volatile String deviceId = "ESP32-NODE-01";
    private volatile Integer lastRssi = -52;

    public Esp32StatusService(SensorDataRepository sensorDataRepository) {
        this.sensorDataRepository = sensorDataRepository;
    }

    public synchronized void recordHeartbeat(String ipAddress, String deviceId, Integer rssi) {
        this.lastHeartbeatTime = LocalDateTime.now();
        if (ipAddress != null && !ipAddress.isBlank()) {
            this.lastIpAddress = ipAddress;
        }
        if (deviceId != null && !deviceId.isBlank()) {
            this.deviceId = deviceId;
        }
        if (rssi != null) {
            this.lastRssi = rssi;
        }
    }

    public Esp32StatusDto getStatus() {
        LocalDateTime lastTime = lastHeartbeatTime;
        if (lastTime == null) {
            // Check latest database record if in-memory timestamp is not set yet
            Optional<SensorData> latest = sensorDataRepository.findTopByOrderByCreatedAtDesc();
            if (latest.isPresent()) {
                lastTime = latest.get().getCreatedAt();
            }
        }

        long secondsAgo = lastTime != null 
                ? Duration.between(lastTime, LocalDateTime.now()).getSeconds() 
                : 999999;

        // Considered connected if telemetry received within 25 seconds (ESP32 interval: 10s)
        boolean isConnected = secondsAgo <= 25;

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm:ss a");
        String formattedLastUpdate = lastTime != null ? lastTime.format(timeFormatter) : "No telemetry received";

        return Esp32StatusDto.builder()
                .connected(isConnected)
                .connectionStatus(isConnected ? "Connected" : "Offline")
                .lastUpdate(formattedLastUpdate)
                .lastSeenSecondsAgo(secondsAgo)
                .samplingInterval("10 seconds")
                .signalStrength(isConnected ? lastRssi : -95)
                .firmwareVersion("v3.2.1")
                .ipAddress(lastIpAddress)
                .macAddress(deviceId)
                .build();
    }
}
