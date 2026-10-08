package com.waterquality.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double ph;

    @Column(nullable = false)
    private Double temperature;

    @Column(nullable = false)
    private Double turbidity;

    @Column(nullable = false)
    private Double totalDissolvedSolids;

    @Column(nullable = false)
    private Double conductivity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}