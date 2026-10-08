-- Aqualytica - Database Migration Script: Remove Nitrate & Chloride
-- Run this optional script in your Supabase SQL Editor (or PostgreSQL client)
-- to drop the deprecated nitrate and chloride columns from the sensor_data table.

ALTER TABLE sensor_data DROP COLUMN IF EXISTS nitrate;
ALTER TABLE sensor_data DROP COLUMN IF EXISTS chloride;
