@echo off
title Aqualytica - Full Stack Launch Manager
echo ==============================================================================
echo    AQUALYTICA - AI-Powered Water Quality Intelligence Platform
echo    Starting all 4 Microservices:
echo      1. Eclipse Mosquitto MQTT Broker (Port 1883)
echo      2. Python ML Flask API (Port 5000)
echo      3. Spring Boot Backend API (Port 8080)
echo      4. React Frontend (Port 5200)
echo ==============================================================================
echo.

REM 1. Start Mosquitto Broker
echo [1/4] Launching Mosquitto MQTT Broker on port 1883...
start "Aqualytica Mosquitto Broker" cmd /c "call 05_ESP32\start_mosquitto.bat"
timeout /t 2 /nobreak >nul

REM 2. Start Python ML Microservice
echo [2/4] Launching Python Random Forest ML API on port 5000...
start "Aqualytica Python ML API" cmd /k "cd 03_Backend\python-ml-api && python app.py"
timeout /t 2 /nobreak >nul

REM 3. Start Spring Boot Backend
echo [3/4] Launching Spring Boot Backend on port 8080...
start "Aqualytica Spring Boot API" cmd /k "cd 03_Backend\springboot-api && mvnw.cmd spring-boot:run"
timeout /t 4 /nobreak >nul

REM 4. Start React Frontend
echo [4/4] Launching React Frontend on port 5200...
start "Aqualytica React Frontend" cmd /k "cd 04_Frontend\water-quality-frontend && npm run dev"

echo.
echo ==============================================================================
echo  All services have been dispatched in separate terminal windows.
echo  Aqualytica Web Application URL: http://localhost:5200/
echo ==============================================================================
pause
