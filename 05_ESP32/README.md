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
   - C++ / Arduino IDE structure located in [firmware/firmware.ino](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/05_ESP32/firmware/firmware.ino).
   - Implements analog-to-digital conversions with 20-sample rolling digital averaging filters.
   - Temperature compensation applied to electrical conductivity and TDS.
   - Establishes a local WiFi connection.
   - Pushes sensor telemetry packets to the backend API (`http://192.168.1.100:8080/api/telemetry`) periodically using JSON payloads.

---

## Pin Connection Mapping

| Sensor Probe | Pin Name | ESP32 GPIO Port | Power Input |
| :--- | :--- | :--- | :--- |
| **pH Sensor** | Analog Out | `GPIO 34` (ADC1) | `3.3V` |
| **TDS Probe** | Analog Out | `GPIO 35` (ADC1) | `3.3V` |
| **Turbidity Sensor** | Analog Out | `GPIO 32` (ADC1) | `5.0V` |
| **DS18B20 Temp** | Data Out | `GPIO 4` (1-Wire Pullup) | `3.3V` |
