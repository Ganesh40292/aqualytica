/**
 * ==============================================================================
 *  Aqualytica - ESP32 IoT Water Quality Telemetry Node Firmware
 *  Project: Aqualytica – AI-Powered Water Quality Intelligence Platform
 * ==============================================================================
 *  Hardware: ESP32 NodeMCU (32-bit Dual-Core WiFi MCU)
 *  Sensors:
 *    - Analog pH Sensor (GPIO 34 - ADC1_CH6)
 *    - TDS Conductivity Sensor (GPIO 35 - ADC1_CH7)
 *    - Infrared Turbidity Sensor (GPIO 32 - ADC1_CH4)
 *    - DS18B20 1-Wire Digital Temperature Sensor (GPIO 4)
 * ==============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ==============================================================================
//  WiFi & Backend API Configuration
// ==============================================================================
#if __has_include("config.h")
  #include "config.h"
  const char* WIFI_SSID     = WIFI_SSID_CONFIG;
  const char* WIFI_PASSWORD = WIFI_PASSWORD_CONFIG;
  const char* SERVER_URL    = SERVER_URL_CONFIG;
  const unsigned long TELEMETRY_INTERVAL_MS = TELEMETRY_INTERVAL_CONFIG_MS;
#else
  const char* WIFI_SSID     = "YOUR_WIFI_SSID";
  const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
  const char* SERVER_URL    = "http://192.168.1.100:8080/api/telemetry";
  const unsigned long TELEMETRY_INTERVAL_MS = 10000;
#endif

const char* DEVICE_ID = "ESP32-NODE-01";
unsigned long lastTelemetryTime = 0;

// ==============================================================================
//  Offline Telemetry Circular Queue (Buffers readings during WiFi dropouts)
// ==============================================================================
struct WaterReading {
    float ph;
    float temperature;
    float turbidity;
    float totalDissolvedSolids;
    float conductivity;
};

const int OFFLINE_BUFFER_CAPACITY = 30;
WaterReading offlineBuffer[OFFLINE_BUFFER_CAPACITY];
int bufferHead = 0;
int bufferCount = 0;

void bufferReading(float ph, float temp, float turb, float tds, float cond) {
    if (bufferCount < OFFLINE_BUFFER_CAPACITY) {
        int idx = (bufferHead + bufferCount) % OFFLINE_BUFFER_CAPACITY;
        offlineBuffer[idx] = { ph, temp, turb, tds, cond };
        bufferCount++;
        Serial.printf("[BUFFER] Telemetry stored in offline buffer (%d/%d)\n", bufferCount, OFFLINE_BUFFER_CAPACITY);
    } else {
        offlineBuffer[bufferHead] = { ph, temp, turb, tds, cond };
        bufferHead = (bufferHead + 1) % OFFLINE_BUFFER_CAPACITY;
        Serial.println("[BUFFER] Buffer full — replaced oldest sample.");
    }
}

void flushOfflineBuffer() {
    if (bufferCount == 0 || WiFi.status() != WL_CONNECTED) return;

    Serial.printf("[BUFFER] Flushing %d buffered samples to backend batch endpoint...\n", bufferCount);

    String batchUrl = String(SERVER_URL);
    if (batchUrl.endsWith("/telemetry")) {
        batchUrl += "/batch";
    }

    HTTPClient http;
    http.begin(batchUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-ID", DEVICE_ID);
    http.addHeader("X-Device-RSSI", String(WiFi.RSSI()));

    DynamicJsonDocument batchDoc(4096);
    JsonArray array = batchDoc.to<JsonArray>();

    for (int i = 0; i < bufferCount; i++) {
        int idx = (bufferHead + i) % OFFLINE_BUFFER_CAPACITY;
        JsonObject item = array.createNestedObject();
        item["ph"]                   = round(offlineBuffer[idx].ph * 100.0) / 100.0;
        item["temperature"]          = round(offlineBuffer[idx].temperature * 10.0) / 10.0;
        item["turbidity"]            = round(offlineBuffer[idx].turbidity * 100.0) / 100.0;
        item["totalDissolvedSolids"] = round(offlineBuffer[idx].totalDissolvedSolids * 10.0) / 10.0;
        item["conductivity"]         = round(offlineBuffer[idx].conductivity * 10.0) / 10.0;
    }

    String requestBody;
    serializeJson(batchDoc, requestBody);

    int httpCode = http.POST(requestBody);
    if (httpCode >= 200 && httpCode < 300) {
        Serial.printf("[BUFFER SUCCESS] Flushed %d records successfully!\n", bufferCount);
        bufferCount = 0;
        bufferHead = 0;
    } else {
        Serial.printf("[BUFFER WARN] Batch flush returned %d. Retaining in buffer.\n", httpCode);
    }
    http.end();
}

// ==============================================================================
//  GPIO Pin Assignments
// ==============================================================================
const int PIN_PH_SENSOR        = 34; // ADC1 Channel 6
const int PIN_TDS_SENSOR       = 35; // ADC1 Channel 7
const int PIN_TURBIDITY_SENSOR = 32; // ADC1 Channel 4
const int PIN_ONE_WIRE_BUS     = 4;  // DS18B20 digital bus

// ==============================================================================
//  Sensor Calibration Constants
// ==============================================================================
// pH Sensor Calibration: Neutral voltage at pH 7.0 and calibration slope
const float PH_NEUTRAL_VOLTAGE = 1.65;
const float PH_CAL_SLOPE       = 0.18;

// TDS Sensor Calibration
const float TDS_FACTOR         = 500.0;
const float TEMP_COEFFICIENT   = 0.02;

// Initialize 1-Wire and Dallas Temperature libraries
OneWire oneWire(PIN_ONE_WIRE_BUS);
DallasTemperature tempSensors(&oneWire);

// ==============================================================================
//  Helper Function: Digital Averaging ADC Filter
// ==============================================================================
float readSmoothedADC(int pin, int samples = 20) {
    long sum = 0;
    for (int i = 0; i < samples; i++) {
        sum += analogRead(pin);
        delay(10);
    }
    return (float)sum / (float)samples;
}

// ==============================================================================
//  Arduino Setup Routine
// ==============================================================================
void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println();
    Serial.println("==================================================");
    Serial.println("  Aqualytica Telemetry Node Starting Up...");
    Serial.println("==================================================");

    // Initialize DS18B20 temperature probe
    tempSensors.begin();
    Serial.println("[INFO] DS18B20 Temperature Probe initialized.");

    // Connect to local WiFi network
    Serial.printf("[WIFI] Connecting to SSID: %s\n", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 30) {
        delay(500);
        Serial.print(".");
        retries++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n[WIFI] Connected successfully!");
        Serial.printf("[WIFI] Assigned IP: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("[WIFI] RSSI Signal: %d dBm\n", WiFi.RSSI());
    } else {
        Serial.println("\n[WARN] WiFi connection timeout. Will retry during telemetry loop.");
    }
}

// ==============================================================================
//  Arduino Main Loop
// ==============================================================================
void loop() {
    unsigned long currentMillis = millis();

    if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
        lastTelemetryTime = currentMillis;

        // 1. Read DS18B20 Temperature
        tempSensors.requestTemperatures();
        float temperature = tempSensors.getTempCByIndex(0);
        if (temperature == DEVICE_DISCONNECTED_C || temperature < -10.0 || temperature > 80.0) {
            temperature = 25.0; // Fallback to nominal ambient 25°C if disconnected
        }

        // 2. Read Analog pH Sensor
        float rawAdcPH = readSmoothedADC(PIN_PH_SENSOR);
        float voltagePH = rawAdcPH * (3.3 / 4095.0);
        float ph = 7.0 + ((PH_NEUTRAL_VOLTAGE - voltagePH) / PH_CAL_SLOPE);
        if (ph < 0.0) ph = 0.0;
        if (ph > 14.0) ph = 14.0;

        // 3. Read Analog TDS Sensor with Temperature Compensation
        float rawAdcTDS = readSmoothedADC(PIN_TDS_SENSOR);
        float voltageTDS = rawAdcTDS * (3.3 / 4095.0);
        float ecRaw = voltageTDS * 1000.0;
        float ecCompensated = ecRaw / (1.0 + TEMP_COEFFICIENT * (temperature - 25.0));
        float tds = ecCompensated * 0.5;
        if (tds < 0.0) tds = 0.0;

        // 4. Electrical Conductivity (EC in µS/cm derived from compensated EC)
        float conductivity = ecCompensated * 1.5;

        // 5. Read Infrared Optical Turbidity Sensor (Inverse voltage relationship)
        float rawAdcTurb = readSmoothedADC(PIN_TURBIDITY_SENSOR);
        float voltageTurb = rawAdcTurb * (3.3 / 4095.0);
        float turbidity = -1120.4 * (voltageTurb * voltageTurb) + 5742.3 * voltageTurb - 4352.9;
        if (turbidity < 0.0 || voltageTurb >= 3.0) turbidity = 0.2; // Crystal clear threshold

        // Print telemetry to serial monitor
        Serial.println("--------------------------------------------------");
        Serial.printf("[TELEMETRY] pH: %.2f | Temp: %.1f C | TDS: %.1f mg/L | Turbidity: %.2f NTU | EC: %.1f uS/cm\n",
                      ph, temperature, tds, turbidity, conductivity);

        // Transmit JSON to Backend if WiFi is connected
        if (WiFi.status() == WL_CONNECTED) {
            // First flush any previously buffered readings from offline periods
            flushOfflineBuffer();

            HTTPClient http;
            http.begin(SERVER_URL);
            http.addHeader("Content-Type", "application/json");
            http.addHeader("X-Device-ID", DEVICE_ID);
            http.addHeader("X-Device-RSSI", String(WiFi.RSSI()));

            StaticJsonDocument<256> doc;
            doc["ph"]                   = round(ph * 100.0) / 100.0;
            doc["temperature"]          = round(temperature * 10.0) / 10.0;
            doc["turbidity"]            = round(turbidity * 100.0) / 100.0;
            doc["totalDissolvedSolids"] = round(tds * 10.0) / 10.0;
            doc["conductivity"]         = round(conductivity * 10.0) / 10.0;

            String requestBody;
            serializeJson(doc, requestBody);

            int httpResponseCode = http.POST(requestBody);
            if (httpResponseCode >= 200 && httpResponseCode < 300) {
                Serial.printf("[HTTP] Ingestion response code: %d\n", httpResponseCode);
            } else {
                Serial.printf("[HTTP ERROR] Ingestion failed (%d). Buffering sample locally.\n", httpResponseCode);
                bufferReading(ph, temperature, turbidity, tds, conductivity);
            }
            http.end();
        } else {
            Serial.println("[WARN] WiFi disconnected. Buffering reading in RAM & reconnecting...");
            bufferReading(ph, temperature, turbidity, tds, conductivity);
            WiFi.reconnect();
        }
    }
}
