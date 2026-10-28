# Aqualytica - Database Configuration

This directory contains the database schemas, seed datasets, migration scripts, and optimization guidelines for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## Schema Setup

### 1. Database Engine
- **Engine**: Supabase Cloud PostgreSQL 17.6 (AWS Mumbai region)
- **Realtime Engine**: Supabase Realtime Change-Data-Capture (CDC) via WebSockets
- **Connection Mode**: Session Pooler on port 5432 via HikariCP

### 2. Table Layouts
- **`sensor_data`**: Stores physical metrics received from ESP32 telemetry nodes:
  - `id` (BIGSERIAL Primary Key)
  - `ph`, `temperature`, `turbidity`, `total_dissolved_solids`, `conductivity`
  - `created_at` (TIMESTAMPTZ default NOW())
- **`prediction_history`**: Stores machine learning output logs matched with sensor data keys:
  - `id` (BIGSERIAL Primary Key)
  - `sensor_data_id` (Foreign Key referencing `sensor_data(id)`)
  - `prediction` (VARCHAR(32): "Potable" or "Not Potable")
  - `confidence` (DOUBLE PRECISION: ML model confidence score)
  - `predicted_at` (TIMESTAMPTZ default NOW())
- **`users`**: Stores authenticated analyst credentials:
  - `id` (BIGSERIAL Primary Key)
  - `username`, `email`, `password` (BCrypt hash)
  - `auth_provider` ("LOCAL" or "GOOGLE"), `google_id`, `profile_picture`
  - `created_at` (TIMESTAMPTZ default NOW())

---

## Migration Scripts in this Directory
- [supabase_schema.sql](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/06_Database/supabase_schema.sql): Complete DDL definitions for PostgreSQL tables, constraints, and indexes.
- [supabase_rls_fix.sql](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/06_Database/supabase_rls_fix.sql): Row Level Security policies permitting anonymous/authenticated access for realtime telemetry.
- [drop_nitrate_chloride.sql](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/06_Database/drop_nitrate_chloride.sql): Migration script aligning the schema strictly to the 5 core telemetry parameters.
