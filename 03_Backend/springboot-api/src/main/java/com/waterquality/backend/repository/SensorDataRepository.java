package com.waterquality.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.waterquality.backend.entity.SensorData;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {

}