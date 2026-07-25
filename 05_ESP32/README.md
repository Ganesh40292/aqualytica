# Aqualytica - ESP32 Hardware Firmware

This directory houses the microcontroller firmware and hardware integration specifications for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## IoT Architecture
1. **Sensors Interface**:
   - Analog pH probe (calibrated using calibration powders at pH 4.0 and 7.0).
   - TDS (Total Dissolved Solids) conductivity probe.
   - Infrared Turbidity sensor (measuring light scattering in NTU).
   - DS18B20 waterproof temperature probe.
2. **Microcontroller**: ESP32 NodeMCU.
3. **Firmware Implementation**:
   - C++ / Arduino IDE structure.
   - Implements analog-to-digital conversions with multi-sample averaging filters.
   - Establishes a local WiFi connection.
   - Pushes sensor telemetry packets to the backend API (`http://localhost:8080/api/telemetry`) periodically using JSON payloads.
