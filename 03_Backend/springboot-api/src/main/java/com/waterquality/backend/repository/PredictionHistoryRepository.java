package com.waterquality.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.waterquality.backend.entity.PredictionHistory;

@Repository
public interface PredictionHistoryRepository
        extends JpaRepository<PredictionHistory, Long> {

    Long countByPrediction(String prediction);

    @Query("SELECT AVG(p.confidence) FROM PredictionHistory p")
    Double getAverageConfidence();

    List<PredictionHistory>
    findTop10ByOrderByPredictedAtDesc();

}