# Aqualytica - Database Configuration

This directory contains the database schemas, seed datasets, migration scripts, and optimization guidelines for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## Schema Setup

### 1. Database Engine
- **Engine**: MySQL 8.0+

### 2. Table Layouts
- **`sensor_data`**: Stores physical metrics received from ESP32 telemetry nodes:
  - `id` (Primary Key)
  - `ph`, `temperature`, `turbidity`, `total_dissolved_solids`, `conductivity`
  - `created_at` (Timestamp)
- **`prediction_history`**: Stores machine learning output logs matched with sensor data keys:
  - `id` (Primary Key)
  - `sensor_data_id` (Foreign Key referencing `sensor_data`)
  - `prediction` (String: Potable or Not Potable)
  - `confidence` (Double: ML model confidence score)
  - `predicted_at` (Timestamp)

---

## Database Connection Settings
Configured via `application.properties` inside the Spring Boot workspace:
- **Connection Pool**: HikariCP (optimized connection threads management)
- **OR mapping**: Hibernate JPA Auto-DDL update
