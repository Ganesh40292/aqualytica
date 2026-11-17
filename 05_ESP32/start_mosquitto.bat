@echo off
title Aqualytica Mosquitto MQTT Broker (Port 1883)
echo ==============================================================================
echo   Aqualytica Mosquitto MQTT Broker
echo   Bound to: 0.0.0.0:1883
echo   Local LAN IP: 10.39.71.112
echo ==============================================================================
echo.
if exist "C:\Program Files\mosquitto\mosquitto.exe" (
    "C:\Program Files\mosquitto\mosquitto.exe" -c "%~dp0mosquitto.conf" -v
) else (
    echo [ERROR] mosquitto.exe not found in C:\Program Files\mosquitto\
    pause
)
