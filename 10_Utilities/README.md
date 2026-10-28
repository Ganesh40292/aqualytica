# Aqualytica - Scripts and Utility Tools

This directory contains scripts, database backups, calibration values, and configuration helpers for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## Utility Tools

1. **Telemetry Mock Senders**:
   - [mock_telemetry_sender.py](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/10_Utilities/mock_telemetry_sender.py): Simulates physical ESP32 telemetry transmissions with safe/unsafe presets to test the Spring Boot REST backend and Machine Learning classification without needing hardware connected.

2. **Database Seed Scripts**:
   - Migration and seed scripts configured in `06_Database/`.

3. **Calibration Helpers**:
   - Script guides and math formulas mapping raw analog voltage inputs from physical probes to calibrated pH, TDS, and NTU values (documented in root `README.md`).
