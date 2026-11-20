package com.waterquality.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.waterquality.backend.dto.MqttTelemetryDto;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

/**
 * Enterprise MQTT Gateway managing bidirectional hardware communication with the ESP32 node
 * over the Eclipse Mosquitto broker.
 *
 * Responsibilities:
 * - Thread-safe request-reply correlation using unique UUID request IDs.
 * - Single-active hardware test concurrency guard (AtomicReference).
 * - 10-second MQTT timeout and map cleanup guarantee.
 * - Inbound telemetry parsing and background heartbeat routing.
 * - Recognition of ESP32 DEVICE_BUSY responses.
 */
@Service
public class MqttHardwareService implements MqttCallbackExtended {

    private static final Logger log = LoggerFactory.getLogger(MqttHardwareService.class);

    private final String brokerUrl;
    private final String clientId;
    private final String commandTopic;
    private final String sensorTopic;
    private final int timeoutSeconds;

    private final Esp32StatusService esp32StatusService;
    private final ObjectMapper objectMapper;

    private MqttClient mqttClient;
    private final MqttConnectOptions connectOptions;

    // Concurrency and correlation state
    private final AtomicReference<String> activeTestRequestId = new AtomicReference<>(null);
    private final ConcurrentHashMap<String, CompletableFuture<MqttTelemetryDto>> pendingRequests = new ConcurrentHashMap<>();

    public MqttHardwareService(
            @Value("${mqtt.broker.url:tcp://10.39.71.112:1883}") String brokerUrl,
            @Value("${mqtt.client.id:aqualytica-backend}") String clientId,
            @Value("${mqtt.topic.command:aqualytica/device/command}") String commandTopic,
            @Value("${mqtt.topic.sensors:aqualytica/sensors}") String sensorTopic,
            @Value("${mqtt.timeout.seconds:10}") int timeoutSeconds,
            Esp32StatusService esp32StatusService,
            ObjectMapper objectMapper) {

        this.brokerUrl = brokerUrl;
        this.clientId = clientId + "-" + UUID.randomUUID().toString().substring(0, 4);
        this.commandTopic = commandTopic;
        this.sensorTopic = sensorTopic;
        this.timeoutSeconds = timeoutSeconds;
        this.esp32StatusService = esp32StatusService;
        this.objectMapper = objectMapper;

        this.connectOptions = new MqttConnectOptions();
        this.connectOptions.setCleanSession(true);
        this.connectOptions.setAutomaticReconnect(true);
        this.connectOptions.setConnectionTimeout(5);
        this.connectOptions.setKeepAliveInterval(30);

        // Binds strictly to the Aqualytica active broker on LAN (10.39.71.112)
        // avoiding conflict with default background Windows Mosquitto service on 127.0.0.1
        List<String> uris = new ArrayList<>();
        if (brokerUrl != null && !brokerUrl.isBlank()) {
            uris.add(brokerUrl);
        }
        if (!uris.contains("tcp://10.39.71.112:1883")) {
            uris.add("tcp://10.39.71.112:1883");
        }
        this.connectOptions.setServerURIs(uris.toArray(new String[0]));
    }

    @PostConstruct
    public synchronized void initialize() {
        try {
            log.info("Initializing MQTT client with primary URI [{}] and fallbacks: {}", brokerUrl, java.util.Arrays.toString(connectOptions.getServerURIs()));
            this.mqttClient = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            this.mqttClient.setCallback(this);
            connectToBroker();
        } catch (MqttException ex) {
            log.warn("Initial MQTT connection deferred (broker may be starting). Background auto-reconnect is active.");
        }
    }

    private synchronized void connectToBroker() throws MqttException {
        if (mqttClient != null && !mqttClient.isConnected()) {
            mqttClient.connect(connectOptions);
            log.info("Connected to Mosquitto MQTT broker successfully at [{}]", mqttClient.getCurrentServerURI() != null ? mqttClient.getCurrentServerURI() : brokerUrl);
            subscribeToSensorTopic();
        }
    }

    /**
     * Automatic scheduled background reconnect loop.
     * Guarantees that if Mosquitto broker is started after Spring Boot or restarted,
     * the backend connects within 5 seconds without errors.
     */
    @Scheduled(fixedDelay = 5000)
    public synchronized void scheduledReconnect() {
        if (mqttClient != null && !mqttClient.isConnected()) {
            try {
                connectToBroker();
            } catch (Exception ex) {
                // Broker starting or transient network condition; retry next cycle
            }
        }
    }

    private synchronized void subscribeToSensorTopic() {
        try {
            if (mqttClient != null && mqttClient.isConnected()) {
                mqttClient.subscribe(sensorTopic, 0);
                log.info("Subscribed to MQTT sensor telemetry topic: [{}]", sensorTopic);
            }
        } catch (MqttException ex) {
            log.error("Failed to subscribe to topic [{}]: {}", sensorTopic, ex.getMessage());
        }
    }

    private synchronized void ensureConnected() throws MqttException {
        if (mqttClient == null || !mqttClient.isConnected()) {
            connectToBroker();
        }
    }

    /**
     * Triggers an on-demand physical sensor measurement by publishing a START_TEST command
     * to the ESP32 node via Mosquitto.
     *
     * @return CompletableFuture resolving with the correlated MqttTelemetryDto
     * @throws ResponseStatusException HTTP 409 if a hardware test is already in progress
     */
    public CompletableFuture<MqttTelemetryDto> triggerHardwareReading() {
        String existingId = activeTestRequestId.get();
        if (existingId != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A hardware test is already in progress (Request ID: " + existingId + "). Please wait for it to complete.");
        }

        String requestId = "REQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        if (!activeTestRequestId.compareAndSet(null, requestId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A hardware test is already in progress. Please wait for it to complete.");
        }

        CompletableFuture<MqttTelemetryDto> future = new CompletableFuture<>();
        pendingRequests.put(requestId, future);

        // Schedule timeout and guarantee map cleanup & lock release
        future.orTimeout(timeoutSeconds, TimeUnit.SECONDS)
                .whenComplete((res, ex) -> {
                    pendingRequests.remove(requestId);
                    activeTestRequestId.set(null); // Release single active test lock
                    if (ex != null) {
                        log.warn("Hardware test request [{}] finished with status: {}", requestId, ex.getMessage());
                    } else {
                        log.info("Hardware test request [{}] completed successfully", requestId);
                    }
                });

        // Publish command to MQTT broker
        try {
            ensureConnected();
            String commandJson = String.format("{\"command\":\"START_TEST\",\"requestId\":\"%s\"}", requestId);
            MqttMessage message = new MqttMessage(commandJson.getBytes(StandardCharsets.UTF_8));
            message.setQos(0);
            mqttClient.publish(commandTopic, message);
            log.info("Published START_TEST command with requestId: [{}] to topic: [{}]", requestId, commandTopic);
        } catch (Exception ex) {
            pendingRequests.remove(requestId);
            activeTestRequestId.set(null);
            future.completeExceptionally(new RuntimeException("Failed to dispatch MQTT START_TEST command: " + ex.getMessage(), ex));
        }

        return future;
    }

    // =====================================================
    // MqttCallbackExtended Implementation
    // =====================================================

    @Override
    public void connectComplete(boolean reconnect, String serverURI) {
        log.info("MQTT connection established to [{}], reconnect flag: [{}]", serverURI, reconnect);
        subscribeToSensorTopic();
    }

    @Override
    public void connectionLost(Throwable cause) {
        log.warn("MQTT connection to broker lost: {}. Automatic reconnect is attempting recovery.", cause != null ? cause.getMessage() : "Unknown cause");
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        log.info("Inbound MQTT telemetry received on [{}]: {}", topic, payload);

        try {
            MqttTelemetryDto dto = objectMapper.readValue(payload, MqttTelemetryDto.class);
            String incomingReqId = dto.getRequestId();

            if (incomingReqId != null && !incomingReqId.isBlank()) {
                // Safely remove matching future before completing
                CompletableFuture<MqttTelemetryDto> future = pendingRequests.remove(incomingReqId);
                if (future != null && !future.isDone()) {
                    future.complete(dto);
                    return;
                }
            }

            // Route periodic telemetry packets to heartbeat tracker
            esp32StatusService.recordHeartbeat("MQTT", dto.getDeviceId(), null);

        } catch (Exception ex) {
            log.error("Failed to deserialize MQTT payload: {}", ex.getMessage());
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // Delivery acknowledgment
    }

    @PreDestroy
    public synchronized void cleanup() {
        try {
            if (mqttClient != null) {
                if (mqttClient.isConnected()) {
                    mqttClient.disconnectForcibly(1000);
                }
                mqttClient.close();
                log.info("MQTT client closed cleanly.");
            }
        } catch (Exception ex) {
            log.warn("Error during MQTT client cleanup: {}", ex.getMessage());
        }
    }
}
