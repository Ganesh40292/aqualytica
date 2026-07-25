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
public class HistoryResponse {

    private Long id;

    private String prediction;

    private Double confidence;

    private String predictedAt;

    private Double ph;

    private Double temperature;

    private Double turbidity;

    private Double totalDissolvedSolids;

    private Double conductivity;

    private Double nitrate;

    private Double chloride;

}