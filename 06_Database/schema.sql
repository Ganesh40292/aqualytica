-- Water Quality Monitoring System Database Schema
-- DBMS: MySQL 8.x / 5.x

CREATE DATABASE IF NOT EXISTS water_quality_monitoring;
USE water_quality_monitoring;

-- 1. Sensor Data Table (Stores 5 physical parameter inputs)
CREATE TABLE IF NOT EXISTS sensor_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ph DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL,
    turbidity DOUBLE NOT NULL,
    total_dissolved_solids DOUBLE NOT NULL,
    conductivity DOUBLE NOT NULL,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0950_ai_ci;

-- 2. Prediction History Table (Stores Random Forest model classifications)
CREATE TABLE IF NOT EXISTS prediction_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sensor_data_id BIGINT UNIQUE,
    prediction VARCHAR(50) NOT NULL,
    confidence DOUBLE NOT NULL,
    predicted_at DATETIME NOT NULL,
    FOREIGN KEY (sensor_data_id) REFERENCES sensor_data(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0950_ai_ci;

-- 3. Users Table (Stores registered analysts and password tokens)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0950_ai_ci;

