package com.waterquality.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Esp32StatusDto {

    private boolean connected;
    private String connectionStatus;
    private String lastUpdate;
    private long lastSeenSecondsAgo;
    private String samplingInterval;
    private Integer signalStrength;
    private String firmwareVersion;
    private String ipAddress;
    private String macAddress;

}
