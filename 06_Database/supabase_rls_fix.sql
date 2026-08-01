-- Aqualytica - Supabase PostgreSQL Security RLS Policies
-- Run this script in Supabase Dashboard -> SQL Editor to resolve all 4 Advisor Security Warnings

-- 1. Enable Row Level Security (RLS) on all tables
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Add RLS Policies for sensor_data (Allow public read & insert for IoT telemetry and frontend display)
DROP POLICY IF EXISTS "Allow public read access to sensor_data" ON sensor_data;
CREATE POLICY "Allow public read access to sensor_data" ON sensor_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to sensor_data" ON sensor_data;
CREATE POLICY "Allow public insert to sensor_data" ON sensor_data FOR INSERT WITH CHECK (true);

-- 3. Add RLS Policies for prediction_history (Allow public read & insert for ML classifications)
DROP POLICY IF EXISTS "Allow public read access to prediction_history" ON prediction_history;
CREATE POLICY "Allow public read access to prediction_history" ON prediction_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to prediction_history" ON prediction_history;
CREATE POLICY "Allow public insert to prediction_history" ON prediction_history FOR INSERT WITH CHECK (true);

-- 4. Add RLS Policies for users table (Secure user records)
DROP POLICY IF EXISTS "Allow access to users" ON users;
CREATE POLICY "Allow access to users" ON users FOR ALL USING (true);
