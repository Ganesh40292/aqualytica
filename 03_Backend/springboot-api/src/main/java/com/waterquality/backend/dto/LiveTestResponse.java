package com.waterquality.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Unified response DTO returned to the React frontend following an on-demand hardware test.
 * Contains measured sensor readings, hardware health flags, physical anomaly evaluations,
 * and machine learning potability classifications.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveTestResponse {

    private Double ph;
    private Double temperature;
    private Double turbidity;
    private Double totalDissolvedSolids;
    private Double conductivity;

    private Boolean temperatureValid;
    private Boolean isHardwareFault;
    private String hardwareFaultReason;

    private Boolean isAnomaly;
    private String anomalyReason;

    private String prediction;
    private Double confidence;
    private String timestamp;

}
