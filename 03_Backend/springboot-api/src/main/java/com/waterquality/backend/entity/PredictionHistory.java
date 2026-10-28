package com.waterquality.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA Entity mapping the machine learning prediction audit ledger in PostgreSQL.
 */
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