-- Aqualytica - Supabase PostgreSQL Database Schema
-- Run this script in your Supabase Dashboard -> SQL Editor

-- 1. Sensor Data Table (Stores 5 physical parameters from ESP32 telemetry)
CREATE TABLE IF NOT EXISTS sensor_data (
    id BIGSERIAL PRIMARY KEY,
    ph DOUBLE PRECISION NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    turbidity DOUBLE PRECISION NOT NULL,
    total_dissolved_solids DOUBLE PRECISION NOT NULL,
    conductivity DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Prediction History Table (Stores Random Forest ML classifications)
CREATE TABLE IF NOT EXISTS prediction_history (
    id BIGSERIAL PRIMARY KEY,
    sensor_data_id BIGINT UNIQUE REFERENCES sensor_data(id) ON DELETE CASCADE,
    prediction VARCHAR(50) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    predicted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Users Table (Stores user profiles)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Supabase Realtime WebSocket broadcasting for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE sensor_data;
ALTER PUBLICATION supabase_realtime ADD TABLE prediction_history;
