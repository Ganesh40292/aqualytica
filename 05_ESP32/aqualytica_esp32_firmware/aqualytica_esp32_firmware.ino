#include <WiFi.h>

#include <PubSubClient.h>
#include <string.h>

// =====================================================

//                 AQUALYTICA PROJECT

//       INTEGRATED WATER QUALITY MONITORING SYSTEM

// ESP32 + pH + TURBIDITY + TDS + TEMPERATURE + EC + LCD

// =====================================================

// =====================================================

// 1. PIN CONFIGURATION

// =====================================================

// Analog sensors

#define PH_PIN          34

#define TURBIDITY_PIN   35

#define TDS_PIN         32

// Temperature sensor

#define TEMP_PIN         4

// LCD I2C

#define LCD_SDA         21

#define LCD_SCL         22

// Five LEDs

#define LED_PH          12

#define LED_TURBIDITY   13

#define LED_TEMP        14

#define LED_TDS         26

#define LED_SYSTEM      27

// =====================================================

// 2. LCD CONFIGURATION

// =====================================================

LiquidCrystal_I2C lcd(0x27, 16, 2);

// =====================================================

// 3. TEMPERATURE SENSOR CONFIGURATION

// =====================================================

OneWire oneWire(TEMP_PIN);

DallasTemperature tempSensor(&oneWire);

// =====================================================

// 4. GENERAL SETTINGS

// =====================================================

const unsigned long MEASURE_INTERVAL = 2000;

unsigned long lastMeasurementTime = 0;

int currentMode = 0;

// Menu:

// 0 = Stopped

// 1 = pH

// 2 = Turbidity

// 3 = Temperature

// 4 = TDS + EC

// 5 = All sensors

// 7 = Stop

// =====================================================

// MQTT CONFIGURATION

// =====================================================

// Replace these three values with your Wi-Fi credentials

// and your laptop's IPv4 address from ipconfig.

const char* WIFI_SSID = "test";

const char* WIFI_PASSWORD = "1234567890";

const char* MQTT_SERVER = "10.39.71.112";

const uint16_t MQTT_PORT = 1883;

const char* MQTT_TOPIC = "aqualytica/sensors";
const char* MQTT_COMMAND_TOPIC = "aqualytica/device/command";

// =====================================================
// ON-DEMAND HARDWARE TEST STATE VARIABLES
// =====================================================

// Concurrency state variables
volatile bool onDemandTestRequested = false;      // On-demand hardware test waiting in queue
volatile bool isHardwareTestMeasuring = false;    // On-demand hardware test currently executing
volatile bool isSerialMeasuring = false;          // Serial Monitor measurement currently executing
char activeRequestId[64] = "";

WiFiClient espClient;

PubSubClient mqttClient(espClient);

unsigned long lastWiFiAttempt = 0;

unsigned long lastMQTTAttempt = 0;

const unsigned long WIFI_RETRY_INTERVAL = 5000;

const unsigned long MQTT_RETRY_INTERVAL = 3000;

bool wifiConnectedMessageShown = false;

// =====================================================

// 5. pH CALIBRATION SETTINGS

// =====================================================

const float PH_SLOPE = 0.01994284;

const float PH_INTERCEPT = -20.59731;

const int PH_TOTAL_SAMPLES = 50;

const int PH_SAMPLE_DELAY = 10;

// =====================================================

// 6. TURBIDITY CALIBRATION SETTINGS

// =====================================================

// Voltage divider:

// Sensor OUT -> 20k -> GPIO35

// GPIO35 -> 30k -> GND

const float TURBIDITY_DIVIDER_FACTOR = 1.6667;

const int TURBIDITY_TOTAL_SAMPLES = 41;

const int TURBIDITY_TRIM_SAMPLES = 8;

const int TURBIDITY_VALID_SAMPLES = 25;

// November 12 experimental calibration data

const int TURBIDITY_CALIBRATION_POINTS = 6;

const float calibrationVoltage[TURBIDITY_CALIBRATION_POINTS] = {

  3467.64,

  3427.05,

  3359.16,

  3257.00,

  3138.65,

  3045.01

};

const float calibrationNTU[TURBIDITY_CALIBRATION_POINTS] = {

  2.0,

  5.0,

  10.0,

  20.0,

  75.0,

  200.0

};

// =====================================================

// 7. TDS CALIBRATION SETTINGS

// =====================================================

const float TDS_MIN_PPM = 0.0;

const float TDS_MAX_PPM = 1000.0;

const float TDS_REFERENCE_TEMP = 25.0;

const float TDS_TEMP_COEFFICIENT = 0.02;

const int TDS_SAMPLE_COUNT = 30;

const int TDS_SAMPLE_DELAY = 10;

// Provisional operational threshold

const float TDS_SATURATION_ADC = 2789.0;

// EC estimation factor

const float EC_FACTOR = 2.0;

// =====================================================

// 8. RESULT STRUCTURES

// =====================================================

struct TemperatureResult {

  float value;

  bool valid;

};

struct TDSResult {

  float adc;

  float voltage;

  float temperature;

  float rawTDS;

  float compensatedTDS;

  float finalTDS;

  float estimatedEC;

  bool temperatureValid;

  bool saturation;

};

struct TurbidityResult {

  float gpioVoltage;

  float sensorVoltage;

  float ntu;

};

// =====================================================

// 9. LED CONTROL

// =====================================================

const int ledPins[] = {

  LED_PH,

  LED_TURBIDITY,

  LED_TEMP,

  LED_TDS,

  LED_SYSTEM

};

const int LED_COUNT = 5;

const unsigned long LED_INTERVAL = 150;

int ledPosition = 0;

int ledDirection = 1;

unsigned long previousLEDTime = 0;

// =====================================================

// MQTT CONNECTION AND PUBLISHING FUNCTIONS

// =====================================================

void startWiFiConnection() {

  WiFi.mode(WIFI_STA);

  WiFi.setAutoReconnect(true);

  Serial.println("Connecting to Wi-Fi...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  lastWiFiAttempt = millis();

}

// =====================================================
// MQTT COMMAND CALLBACK & VALIDATION
// =====================================================

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // 1. Validate topic
  if (strcmp(topic, MQTT_COMMAND_TOPIC) != 0) {
    return;
  }

  // 2. Reject oversized payloads instead of truncating (buffer limit: 127 bytes)
  if (length >= 128) {
    Serial.println();
    Serial.print("[MQTT ERROR] Command rejected: Payload too large (");
    Serial.print(length);
    Serial.println(" bytes, limit: 127 bytes)");
    return;
  }

  // 3. Safely buffer and null-terminate payload
  char msg[128];
  memcpy(msg, payload, length);
  msg[length] = '\0';

  // 4. Locate and validate JSON "command" key
  char* cmdKey = strstr(msg, "\"command\"");
  if (!cmdKey) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Missing 'command' field");
    return;
  }

  char* cmdColon = strchr(cmdKey + 9, ':');
  if (!cmdColon) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'command' syntax (missing colon)");
    return;
  }

  char* cmdValStart = cmdColon + 1;
  while (*cmdValStart == ' ' || *cmdValStart == '\t') cmdValStart++;

  if (*cmdValStart != '\"') {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'command' value (missing opening quote)");
    return;
  }
  cmdValStart++; // advance past opening quote

  char* cmdValEnd = strchr(cmdValStart, '\"');
  if (!cmdValEnd) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'command' value (unterminated quote)");
    return;
  }

  int cmdLen = cmdValEnd - cmdValStart;
  if (cmdLen != 10 || strncmp(cmdValStart, "START_TEST", 10) != 0) {
    Serial.println();
    Serial.println("[MQTT WARNING] Command ignored: Unrecognized command value");
    return;
  }

  // 5. Locate and validate JSON "requestId" key
  char* reqKey = strstr(msg, "\"requestId\"");
  if (!reqKey) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Missing 'requestId' field");
    return;
  }

  char* reqColon = strchr(reqKey + 11, ':');
  if (!reqColon) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'requestId' syntax (missing colon)");
    return;
  }

  char* reqValStart = reqColon + 1;
  while (*reqValStart == ' ' || *reqValStart == '\t') reqValStart++;

  if (*reqValStart != '\"') {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'requestId' value (missing opening quote)");
    return;
  }
  reqValStart++; // advance past opening quote

  char* reqValEnd = strchr(reqValStart, '\"');
  if (!reqValEnd) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Malformed 'requestId' value (unterminated quote)");
    return;
  }

  int idLen = reqValEnd - reqValStart;
  if (idLen <= 0) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Empty 'requestId'");
    return;
  }

  if (idLen >= (int)sizeof(activeRequestId)) {
    Serial.println();
    Serial.println("[MQTT ERROR] Command rejected: Oversized 'requestId' (limit: 63 characters)");
    return;
  }

  // 6. Concurrency Protection & State Distinction:
  // If an on-demand hardware test is ALREADY executing or already waiting in the queue:
  // Reject the incoming request with DEVICE_BUSY and do NOT overwrite activeRequestId.
  if (isHardwareTestMeasuring || onDemandTestRequested) {
    char rejectedId[64];
    strncpy(rejectedId, reqValStart, idLen);
    rejectedId[idLen] = '\0';

    Serial.println();
    Serial.print("[MQTT BUSY] Hardware test already active or queued. Rejecting: ");
    Serial.println(rejectedId);

    char busyPayload[160];
    snprintf(
      busyPayload,
      sizeof(busyPayload),
      "{\"device_id\":\"AQUALYTICA_ESP32\",\"requestId\":\"%s\",\"error\":\"DEVICE_BUSY\"}",
      rejectedId
    );
    mqttClient.publish(MQTT_TOPIC, busyPayload);
    return;
  }

  // 7. Queue hardware test request:
  // If an ordinary Serial Monitor measurement is currently in progress, safely queue this request.
  strncpy(activeRequestId, reqValStart, idLen);
  activeRequestId[idLen] = '\0';
  onDemandTestRequested = true;

  Serial.println();
  Serial.println("------------------------------------------");
  if (isSerialMeasuring) {
    Serial.print("[MQTT QUEUED] Serial Monitor measurement in progress. Queued START_TEST -> Request ID: ");
  } else {
    Serial.print("[MQTT ACCEPTED] START_TEST -> Request ID: ");
  }
  Serial.println(activeRequestId);
  Serial.println("------------------------------------------");
}

void maintainMQTTConnections() {

  if (WiFi.status() != WL_CONNECTED) {

    wifiConnectedMessageShown = false;

    if (mqttClient.connected()) {

      mqttClient.disconnect();

    }

    if (millis() - lastWiFiAttempt >= WIFI_RETRY_INTERVAL) {

      lastWiFiAttempt = millis();

      Serial.println("Wi-Fi disconnected. Retrying...");

      WiFi.disconnect();

      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    }

    return;

  }

  if (!wifiConnectedMessageShown) {

    Serial.println("Wi-Fi connected!");

    Serial.print("ESP32 IP address: ");

    Serial.println(WiFi.localIP());

    wifiConnectedMessageShown = true;

  }

  if (!mqttClient.connected()) {

    if (millis() - lastMQTTAttempt >= MQTT_RETRY_INTERVAL) {

      lastMQTTAttempt = millis();

      Serial.println("Connecting to MQTT broker...");

      if (mqttClient.connect("AQUALYTICA_ESP32")) {
        Serial.println("MQTT connected!");
        mqttClient.subscribe(MQTT_COMMAND_TOPIC);
        Serial.print("Subscribed to command topic: ");
        Serial.println(MQTT_COMMAND_TOPIC);

      } else {

        Serial.print("MQTT connection failed. State: ");

        Serial.println(mqttClient.state());

      }

    }

  } else {

    mqttClient.loop();

  }

}

void publishSensorData(
  float phValue,
  float turbidityNTU,
  float tdsValue,
  float ecValue,
  float temperatureC,
  bool temperatureValid,
  const char* reqId = NULL
) {
  if (!mqttClient.connected()) {
    Serial.println("MQTT disconnected. Sensor data not published.");
    return;
  }

  char payload[320];

  if (reqId && strlen(reqId) > 0) {
    if (temperatureValid) {
      snprintf(
        payload,
        sizeof(payload),
        "{\"device_id\":\"AQUALYTICA_ESP32\",\"requestId\":\"%s\",\"ph\":%.2f,\"turbidity\":%.2f,\"tds\":%.2f,\"ec\":%.2f,\"temperature\":%.2f,\"temperature_valid\":true}",
        reqId,
        phValue,
        turbidityNTU,
        tdsValue,
        ecValue,
        temperatureC
      );
    } else {
      snprintf(
        payload,
        sizeof(payload),
        "{\"device_id\":\"AQUALYTICA_ESP32\",\"requestId\":\"%s\",\"ph\":%.2f,\"turbidity\":%.2f,\"tds\":%.2f,\"ec\":%.2f,\"temperature\":null,\"temperature_valid\":false}",
        reqId,
        phValue,
        turbidityNTU,
        tdsValue,
        ecValue
      );
    }
  } else {
    if (temperatureValid) {
      snprintf(
        payload,
        sizeof(payload),
        "{\"device_id\":\"AQUALYTICA_ESP32\",\"ph\":%.2f,\"turbidity\":%.2f,\"tds\":%.2f,\"ec\":%.2f,\"temperature\":%.2f,\"temperature_valid\":true}",
        phValue,
        turbidityNTU,
        tdsValue,
        ecValue,
        temperatureC
      );
    } else {
      snprintf(
        payload,
        sizeof(payload),
        "{\"device_id\":\"AQUALYTICA_ESP32\",\"ph\":%.2f,\"turbidity\":%.2f,\"tds\":%.2f,\"ec\":%.2f,\"temperature\":null,\"temperature_valid\":false}",
        phValue,
        turbidityNTU,
        tdsValue,
        ecValue
      );
    }
  }

  if (mqttClient.publish(MQTT_TOPIC, payload)) {
    Serial.println();
    Serial.println("---------- MQTT PUBLISHED ----------");
    Serial.print("Topic: ");
    Serial.println(MQTT_TOPIC);
    Serial.println(payload);
    Serial.println("------------------------------------");
  } else {
    Serial.println("MQTT publish failed!");
  }
}

void initializeLEDs() {

  for (int i = 0; i < LED_COUNT; i++) {

    pinMode(ledPins[i], OUTPUT);

    digitalWrite(ledPins[i], LOW);

  }

}

void updateLEDAnimation() {

  unsigned long currentTime = millis();

  if (currentTime - previousLEDTime >= LED_INTERVAL) {

    previousLEDTime = currentTime;

    for (int i = 0; i < LED_COUNT; i++) {

      digitalWrite(ledPins[i], LOW);

    }

    digitalWrite(ledPins[ledPosition], HIGH);

    ledPosition += ledDirection;

    if (ledPosition >= LED_COUNT - 1) {

      ledPosition = LED_COUNT - 1;

      ledDirection = -1;

    }

    else if (ledPosition <= 0) {

      ledPosition = 0;

      ledDirection = 1;

    }

  }

}

// This delay keeps the LED animation running

void delayWithLEDAnimation(unsigned long duration) {

  unsigned long startTime = millis();

  while (millis() - startTime < duration) {

    updateLEDAnimation();

    maintainMQTTConnections();

    delay(1);

  }

}

// =====================================================

// 10. LCD DISPLAY FUNCTIONS

// =====================================================

void displayLCD(String line1, String line2) {

  lcd.clear();

  lcd.setCursor(0, 0);

  lcd.print(line1.substring(0, 16));

  lcd.setCursor(0, 1);

  lcd.print(line2.substring(0, 16));

}

void showStartupLCD() {

  displayLCD("AQUALYTICA", "System Starting");

  delayWithLEDAnimation(2000);

  displayLCD("Water Quality", "Monitoring");

}

void showStoppedLCD() {

  displayLCD("AQUALYTICA", "Test Stopped");

}

void showModeLCD(String mode) {

  displayLCD("AQUALYTICA", mode);

}

// =====================================================

// 11. SERIAL MENU

// =====================================================

void showMenu() {

  Serial.println();

  Serial.println("==========================================");

  Serial.println("       AQUALYTICA MONITORING SYSTEM");

  Serial.println("==========================================");

  Serial.println("1 - pH Sensor");

  Serial.println("2 - Turbidity Sensor");

  Serial.println("3 - Temperature Sensor");

  Serial.println("4 - TDS and EC");

  Serial.println("5 - Combined All Sensors Test");

  Serial.println("7 - Stop the Test");

  Serial.println("------------------------------------------");

  Serial.println("Enter your selection (1-5 or 7):");

  Serial.println();

}

// =====================================================

// 12. READ pH SENSOR

// =====================================================

float readPH() {

  uint32_t totalADC = 0;

  for (int i = 0; i < PH_TOTAL_SAMPLES; i++) {

    totalADC += analogRead(PH_PIN);

    delayWithLEDAnimation(PH_SAMPLE_DELAY);

  }

  float averageADC = (float)totalADC / PH_TOTAL_SAMPLES;

  float phValue = (PH_SLOPE * averageADC) + PH_INTERCEPT;

  Serial.println();

  Serial.println("---------- pH READING ----------");

  Serial.print("Average ADC: ");

  Serial.println(averageADC, 2);

  Serial.print("Calculated pH: ");

  Serial.println(phValue, 2);

  Serial.println("--------------------------------");

  return phValue;

}

// =====================================================

// 13. READ TEMPERATURE SENSOR

// =====================================================

TemperatureResult readTemperature() {

  TemperatureResult result;

  result.value = NAN;

  result.valid = false;

  tempSensor.requestTemperatures();

  delayWithLEDAnimation(750);

  float temperature = tempSensor.getTempCByIndex(0);

  if (

    temperature == DEVICE_DISCONNECTED_C ||

    isnan(temperature) ||

    temperature == 85.0 ||

    temperature < -10.0 ||

    temperature > 85.0

  ) {

    Serial.println();

    Serial.println("Temperature Sensor: ERROR");

    return result;

  }

  result.value = temperature;

  result.valid = true;

  Serial.println();

  Serial.println("------- TEMPERATURE READING -------");

  Serial.print("Temperature: ");

  Serial.print(temperature, 2);

  Serial.println(" C");

  Serial.println("-----------------------------------");

  return result;

}

// =====================================================

// 14. SORT TURBIDITY SAMPLES

// =====================================================

void sortTurbiditySamples(uint32_t values[], int count) {

  for (int i = 1; i < count; i++) {

    uint32_t key = values[i];

    int j = i - 1;

    while (j >= 0 && values[j] > key) {

      values[j + 1] = values[j];

      j--;

    }

    values[j + 1] = key;

  }

}

// =====================================================

// 15. READ TURBIDITY SENSOR VOLTAGE

// =====================================================

float readTurbidityVoltage(float &gpioVoltage) {

  uint32_t samples[TURBIDITY_TOTAL_SAMPLES];

  for (int i = 0; i < TURBIDITY_TOTAL_SAMPLES; i++) {

    samples[i] = analogReadMilliVolts(TURBIDITY_PIN);

    delayWithLEDAnimation(5);

  }

  sortTurbiditySamples(samples, TURBIDITY_TOTAL_SAMPLES);

  uint32_t total = 0;

  for (

    int i = TURBIDITY_TRIM_SAMPLES;

    i < TURBIDITY_TOTAL_SAMPLES - TURBIDITY_TRIM_SAMPLES;

    i++

  ) {

    total += samples[i];

  }

  float averageGPIOmV = (float)total / TURBIDITY_VALID_SAMPLES;

  gpioVoltage = averageGPIOmV / 1000.0;

  float sensorVoltage = averageGPIOmV * TURBIDITY_DIVIDER_FACTOR;

  return sensorVoltage;

}

// =====================================================

// 16. CONVERT VOLTAGE TO NTU

// =====================================================

float calculateNTU(float voltage) {

  // Above highest calibration voltage

  if (voltage >= calibrationVoltage[0]) {

    return calibrationNTU[0];

  }

  // Below lowest calibration voltage

  if (

    voltage <=

    calibrationVoltage[TURBIDITY_CALIBRATION_POINTS - 1]

  ) {

    return calibrationNTU[TURBIDITY_CALIBRATION_POINTS - 1];

  }

  // Piecewise linear interpolation

  for (int i = 0; i < TURBIDITY_CALIBRATION_POINTS - 1; i++) {

    if (

      voltage <= calibrationVoltage[i] &&

      voltage >= calibrationVoltage[i + 1]

    ) {

      float v1 = calibrationVoltage[i];

      float v2 = calibrationVoltage[i + 1];

      float n1 = calibrationNTU[i];

      float n2 = calibrationNTU[i + 1];

      float ntu = n1 +

        ((v1 - voltage) / (v1 - v2)) * (n2 - n1);

      return ntu;

    }

  }

  return -1.0;

}

// =====================================================

// 17. READ TURBIDITY SENSOR

// =====================================================

TurbidityResult readTurbidity() {

  TurbidityResult result;

  result.gpioVoltage = 0.0;

  result.sensorVoltage = 0.0;

  result.ntu = 0.0;

  result.sensorVoltage = readTurbidityVoltage(result.gpioVoltage);

  result.ntu = calculateNTU(result.sensorVoltage);

  Serial.println();

  Serial.println("-------- TURBIDITY READING --------");

  Serial.print("GPIO35 Voltage: ");

  Serial.print(result.gpioVoltage, 4);

  Serial.println(" V");

  Serial.print("Sensor Voltage: ");

  Serial.print(result.sensorVoltage, 2);

  Serial.println(" mV");

  Serial.print("Estimated Turbidity: ");

  Serial.print(result.ntu, 2);

  Serial.println(" NTU");

  Serial.println("-----------------------------------");

  return result;

}

// =====================================================

// 18. READ TDS VOLTAGE AND ADC

// =====================================================

void readTDSVoltage(float &averageADC, float &averageVoltage) {

  uint32_t adcTotal = 0;

  uint32_t voltageTotal = 0;

  for (int i = 0; i < TDS_SAMPLE_COUNT; i++) {

    adcTotal += analogRead(TDS_PIN);

    voltageTotal += analogReadMilliVolts(TDS_PIN);

    delayWithLEDAnimation(TDS_SAMPLE_DELAY);

  }

  averageADC = (float)adcTotal / TDS_SAMPLE_COUNT;

  averageVoltage = ((float)voltageTotal / TDS_SAMPLE_COUNT) / 1000.0;

}

// =====================================================

// 19. TDS CONVERSION FORMULA

// =====================================================

float calculateRawTDS(float voltage) {

  float tds = (

    133.42 * voltage * voltage * voltage

    - 255.86 * voltage * voltage

    + 857.39 * voltage

  ) * 0.5;

  if (tds < 0.0) {

    tds = 0.0;

  }

  return tds;

}

// =====================================================

// 20. VALIDATE TDS TEMPERATURE

// =====================================================

bool validateTDSTemperature(float temperature) {

  if (isnan(temperature)) return false;

  if (temperature == DEVICE_DISCONNECTED_C) {

    return false;

  }

  if (temperature == 85.0) return false;

  if (temperature < -10.0 || temperature > 85.0) {

    return false;

  }

  return true;

}

// =====================================================

// 21. TDS TEMPERATURE COMPENSATION

// =====================================================

float compensateTDSTemperature(float tds, float temperature) {

  float factor =

    1.0 +

    TDS_TEMP_COEFFICIENT *

    (temperature - TDS_REFERENCE_TEMP);

  if (factor <= 0.0) {

    return tds;

  }

  return tds / factor;

}

// =====================================================

// 22. READ TDS AND CALCULATE EC

// =====================================================

TDSResult readTDS(float temperature, bool temperatureValid) {

  TDSResult result = {};

  readTDSVoltage(result.adc, result.voltage);

  result.temperature = temperature;

  result.temperatureValid =

    temperatureValid &&

    validateTDSTemperature(temperature);

  // Calculate raw TDS

  result.rawTDS = calculateRawTDS(result.voltage);

  // Temperature compensation

  if (result.temperatureValid) {

    result.compensatedTDS =

      compensateTDSTemperature(

        result.rawTDS,

        result.temperature

      );

  } else {

    result.compensatedTDS = result.rawTDS;

  }

  // Saturation detection

  result.saturation = result.adc >= TDS_SATURATION_ADC;

  // Limit TDS to 0-1000 ppm

  result.finalTDS = constrain(

    result.compensatedTDS,

    TDS_MIN_PPM,

    TDS_MAX_PPM

  );

  if (result.saturation) {

    result.finalTDS = TDS_MAX_PPM;

  }

  // Estimated EC

  result.estimatedEC = result.finalTDS * EC_FACTOR;

  return result;

}

// =====================================================

// 23. DISPLAY TDS AND EC

// =====================================================

void displayTDS(TDSResult result) {

  Serial.println();

  Serial.println("----------- TDS + EC ------------");

  Serial.print("Average ADC: ");

  Serial.println(result.adc, 2);

  Serial.print("TDS Voltage: ");

  Serial.print(result.voltage, 4);

  Serial.println(" V");

  Serial.print("TDS: ");

  Serial.print(result.finalTDS, 1);

  Serial.println(" ppm");

  Serial.print("Estimated EC: ");

  Serial.print(result.estimatedEC, 1);

  Serial.println(" uS/cm");

  if (!result.temperatureValid) {

    Serial.println("Temperature Compensation: UNAVAILABLE");

  } else {

    Serial.println("Temperature Compensation: ACTIVE");

  }

  if (result.saturation) {

    Serial.println("WARNING: Operational saturation threshold reached");

  } else {

    Serial.println("Status: Within operational ADC threshold");

  }

  Serial.println("---------------------------------");

}

// =====================================================

// 24. INDIVIDUAL SENSOR MODES

// =====================================================

void runPHMode() {

  showModeLCD("pH Measurement");

  float ph = readPH();

  lcd.setCursor(0, 0);

  lcd.print("pH Measurement");

  lcd.setCursor(0, 1);

  lcd.print("pH Value: ");

  lcd.print(ph, 2);

}

void runTurbidityMode() {

  showModeLCD("Turbidity");

  TurbidityResult turbidity = readTurbidity();

  lcd.setCursor(0, 0);

  lcd.print("Turbidity:");

  lcd.setCursor(0, 1);

  lcd.print(turbidity.ntu, 1);

  lcd.print(" NTU");

}

void runTemperatureMode() {

  showModeLCD("Temperature");

  TemperatureResult temp = readTemperature();

  lcd.setCursor(0, 0);

  lcd.print("Temperature");

  lcd.setCursor(0, 1);

  if (temp.valid) {

    lcd.print(temp.value, 2);

    lcd.print(" C");

  } else {

    lcd.print("Sensor Error");

  }

}

void runTDSMode() {

  showModeLCD("TDS and EC");

  // Read temperature once

  TemperatureResult temp = readTemperature();

  TDSResult tds = readTDS(temp.value, temp.valid);

  displayTDS(tds);

  lcd.setCursor(0, 0);

  lcd.print("TDS:");

  lcd.print(tds.finalTDS, 1);

  lcd.print(" ppm");

  lcd.setCursor(0, 1);

  lcd.print("EC:");

  lcd.print(tds.estimatedEC, 1);

  lcd.print(" uS");

}

// =====================================================

// 25. COMBINED SENSOR MODE

// =====================================================

void runAllSensors(const char* reqId = NULL) {

  Serial.println();

  Serial.println("==========================================");

  Serial.println("       AQUALYTICA COMPLETE READING");

  Serial.println("==========================================");

  // ---------------- pH ----------------

  uint32_t phTotal = 0;

  for (int i = 0; i < PH_TOTAL_SAMPLES; i++) {

    phTotal += analogRead(PH_PIN);

    delayWithLEDAnimation(PH_SAMPLE_DELAY);

  }

  float averagePHADC = (float)phTotal / PH_TOTAL_SAMPLES;

  float phValue = (PH_SLOPE * averagePHADC) + PH_INTERCEPT;

  // ---------------- TEMPERATURE ----------------

  TemperatureResult temp = readTemperature();

  float temperature = temp.value;

  bool temperatureValid = temp.valid;

  // ---------------- TURBIDITY ----------------

  float gpioVoltage = 0.0;

  float sensorVoltage = readTurbidityVoltage(gpioVoltage);

  float ntu = calculateNTU(sensorVoltage);

  // ---------------- TDS + EC ----------------

  TDSResult tds = readTDS(temperature, temperatureValid);

  // ---------------- SERIAL OUTPUT ----------------

  Serial.println();

  Serial.println("---------- SENSOR RESULTS ----------");

  Serial.print("Average pH ADC: ");

  Serial.println(averagePHADC, 2);

  Serial.print("pH: ");

  Serial.println(phValue, 2);

  if (temperatureValid) {

    Serial.print("Temperature: ");

    Serial.print(temperature, 2);

    Serial.println(" C");

  } else {

    Serial.println("Temperature: SENSOR ERROR");

  }

  Serial.print("Turbidity GPIO Voltage: ");

  Serial.print(gpioVoltage, 4);

  Serial.println(" V");

  Serial.print("Turbidity Sensor Voltage: ");

  Serial.print(sensorVoltage, 2);

  Serial.println(" mV");

  Serial.print("Turbidity: ");

  Serial.print(ntu, 2);

  Serial.println(" NTU");

  Serial.print("TDS ADC: ");

  Serial.println(tds.adc, 2);

  Serial.print("TDS Voltage: ");

  Serial.print(tds.voltage, 4);

  Serial.println(" V");

  Serial.print("TDS: ");

  Serial.print(tds.finalTDS, 1);

  Serial.println(" ppm");

  Serial.print("Estimated EC: ");

  Serial.print(tds.estimatedEC, 1);

  Serial.println(" uS/cm");

  if (!temperatureValid) {

    Serial.println("WARNING: TDS temperature compensation unavailable");

  }

  if (tds.saturation) {

    Serial.println("WARNING: TDS operational saturation threshold reached");

  }

  Serial.println("------------------------------------");

  Serial.println("Complete sensor reading finished.");

  Serial.println("==========================================");

  // ---------------- MQTT PUBLISH ----------------

  publishSensorData(
    phValue,
    ntu,
    tds.finalTDS,
    tds.estimatedEC,
    temperature,
    temperatureValid,
    reqId
  );

  // ---------------- LCD DISPLAY ----------------

  // A 16x2 LCD cannot display every parameter

  // simultaneously, so two pages are displayed.

  displayLCD(

    "pH: " + String(phValue, 2),

    "Turb: " + String(ntu, 1) + " NTU"

  );

  delayWithLEDAnimation(1500);

  String tempText;

  if (temperatureValid) {

    tempText = String(temperature, 1) + " C";

  } else {

    tempText = "Sensor Error";

  }

  displayLCD(

    "TDS: " + String(tds.finalTDS, 1) + " ppm",

    "Temp: " + tempText

  );

  delayWithLEDAnimation(1500);

  displayLCD(

    "Estimated EC:",

    String(tds.estimatedEC, 1) + " uS/cm"

  );

}

// =====================================================

// 26. INITIALIZE SYSTEM

// =====================================================

void initializeSystem() {

  // ADC configuration

  analogReadResolution(12);

  analogSetPinAttenuation(PH_PIN, ADC_11db);

  analogSetPinAttenuation(

    TURBIDITY_PIN,

    ADC_11db

  );

  analogSetPinAttenuation(

    TDS_PIN,

    ADC_11db

  );

  pinMode(PH_PIN, INPUT);

  pinMode(TURBIDITY_PIN, INPUT);

  pinMode(TDS_PIN, INPUT);

  // LED configuration

  initializeLEDs();

  // Temperature sensor

  tempSensor.begin();

  tempSensor.setWaitForConversion(false);

  // LCD configuration

  Wire.begin(LCD_SDA, LCD_SCL);

  lcd.init();

  lcd.backlight();

}

// =====================================================

// 27. SETUP

// =====================================================

void setup() {

  Serial.begin(115200);

  delay(1000);

  initializeSystem();

  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);

  mqttClient.setKeepAlive(30);

  mqttClient.setSocketTimeout(2);

  mqttClient.setBufferSize(384);

  startWiFiConnection();

  showStartupLCD();

  Serial.println();

  Serial.println("==========================================");

  Serial.println("       AQUALYTICA SYSTEM STARTED");

  Serial.println("==========================================");

  Serial.println("ESP32 Initialization Complete");

  Serial.print("DS18B20 Devices Found: ");

  Serial.println(tempSensor.getDeviceCount());

  Serial.println("LCD Initialized");

  Serial.println("Five LEDs Initialized");

  Serial.println("LED Running Animation Enabled");

  Serial.println("Sensor Pins:");

  Serial.println("pH         : GPIO 34");

  Serial.println("Turbidity  : GPIO 35");

  Serial.println("TDS        : GPIO 32");

  Serial.println("Temperature: GPIO 4");

  Serial.println("==========================================");

  displayLCD("AQUALYTICA", "Ready");

  showMenu();

}

// =====================================================

// 28. MAIN LOOP

// =====================================================

void loop() {
  maintainMQTTConnections();

  // -----------------------------------------
  // HANDLE ON-DEMAND MQTT HARDWARE TEST
  // -----------------------------------------

  if (onDemandTestRequested) {
    onDemandTestRequested = false;
    isHardwareTestMeasuring = true;

    Serial.println();
    Serial.println("==========================================");
    Serial.print("ON-DEMAND HARDWARE TEST STARTED: ");
    Serial.println(activeRequestId);
    Serial.println("==========================================");

    displayLCD("AQUALYTICA", "Running Test...");

    char reqCopy[64];
    strncpy(reqCopy, activeRequestId, sizeof(reqCopy) - 1);
    reqCopy[sizeof(reqCopy) - 1] = '\0';

    // Clear buffer immediately so it cannot be reused
    activeRequestId[0] = '\0';

    runAllSensors(reqCopy);

    isHardwareTestMeasuring = false;
    lastMeasurementTime = millis();
  }

  updateLEDAnimation();

  while (Serial.available() > 0) {
    char command = Serial.read();

    if (
      command == '\n' ||
      command == '\r' ||
      command == ' '
    ) {
      continue;
    }

    if (command == '1') {
      currentMode = 1;
      Serial.println();
      Serial.println("pH SENSOR TEST STARTED");
      displayLCD("AQUALYTICA", "pH Test Started");
    }
    else if (command == '2') {
      currentMode = 2;
      Serial.println();
      Serial.println("TURBIDITY TEST STARTED");
      displayLCD("AQUALYTICA", "Turbidity Started");
    }
    else if (command == '3') {
      currentMode = 3;
      Serial.println();
      Serial.println("TEMPERATURE TEST STARTED");
      displayLCD("AQUALYTICA", "Temp Test Started");
    }
    else if (command == '4') {
      currentMode = 4;
      Serial.println();
      Serial.println("TDS + EC TEST STARTED");
      displayLCD("AQUALYTICA", "TDS Test Started");
    }
    else if (command == '5') {
      currentMode = 5;
      Serial.println();
      Serial.println("ALL SENSOR TEST STARTED");
      displayLCD("AQUALYTICA", "All Tests Started");
    }
    else if (command == '7') {
      currentMode = 0;
      Serial.println();
      Serial.println("ALL TESTS STOPPED");
      showStoppedLCD();
      showMenu();
    }
    else {
      Serial.println("Invalid option. Enter 1-5 or 7.");
    }

    lastMeasurementTime = 0;
  }

  // -----------------------------------------
  // EXECUTE SELECTED SERIAL SENSOR MODE
  // -----------------------------------------

  if (
    currentMode != 0 &&
    millis() - lastMeasurementTime >= MEASURE_INTERVAL
  ) {
    lastMeasurementTime = millis();
    isSerialMeasuring = true;

    switch (currentMode) {
      case 1:
        runPHMode();
        break;

      case 2:
        runTurbidityMode();
        break;

      case 3:
        runTemperatureMode();
        break;

      case 4:
        runTDSMode();
        break;

      case 5:
        runAllSensors();
        break;
    }

    isSerialMeasuring = false;
    lastMeasurementTime = millis();
  }

  updateLEDAnimation();
}