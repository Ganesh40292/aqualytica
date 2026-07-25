package com.waterquality.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_history")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PredictionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "sensor_data_id")
    private SensorData sensorData;

    @Column(nullable = false)
    private String prediction;

    @Column(nullable = false)
    private Double confidence;

    @Column(nullable = false)
    private LocalDateTime predictedAt;

    @PrePersist
    public void prePersist() {
        this.predictedAt = LocalDateTime.now();
    }

}