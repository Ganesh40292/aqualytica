package com.waterquality.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
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
public class PredictionRequest {

    @NotNull(message = "pH is required")
    @DecimalMin(value = "0.0", message = "pH must be at least 0")
    @DecimalMax(value = "14.0", message = "pH cannot exceed 14")
    private Double ph;

    @NotNull(message = "Temperature is required")
    private Double temperature;

    @NotNull(message = "Turbidity is required")
    @DecimalMin(value = "0.0", message = "Turbidity cannot be negative")
    private Double turbidity;

    @NotNull(message = "Total Dissolved Solids is required")
    @DecimalMin(value = "0.0", message = "TDS cannot be negative")
    private Double totalDissolvedSolids;

    @NotNull(message = "Conductivity is required")
    @DecimalMin(value = "0.0", message = "Conductivity cannot be negative")
    private Double conductivity;

}