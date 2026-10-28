"""
==============================================================================
  Aqualytica - Telemetry Mock Data Generator & Test Utility
  Project: Aqualytica – AI-Powered Water Quality Intelligence Platform
==============================================================================
  Purpose: Simulates physical ESP32 telemetry transmissions to test
           the Spring Boot backend and Machine Learning classification.
==============================================================================
"""

import json
import time
import random
import urllib.request

BACKEND_PREDICT_URL = "http://localhost:8080/api/predict"

# Realistic water quality ranges:
PRESETS = [
    {
        "description": "Pristine Drinking Water (Safe)",
        "ph": (6.8, 7.6),
        "temperature": (18.0, 24.0),
        "turbidity": (0.1, 0.9),
        "totalDissolvedSolids": (120.0, 220.0),
        "conductivity": (240.0, 380.0)
    },
    {
        "description": "Contaminated Runoff Water (Unsafe)",
        "ph": (4.0, 5.5),
        "temperature": (28.0, 35.0),
        "turbidity": (6.0, 15.0),
        "totalDissolvedSolids": (800.0, 1500.0),
        "conductivity": (1200.0, 2200.0)
    },
    {
        "description": "Hardware Sensor Outlier / Extreme Anomaly Test",
        "ph": (13.2, 13.8),
        "temperature": (62.0, 68.0),
        "turbidity": (550.0, 750.0),
        "totalDissolvedSolids": (2800.0, 3400.0),
        "conductivity": (5200.0, 6200.0)
    }
]

def generate_sample(preset_idx=None):
    if preset_idx is None:
        preset = random.choice(PRESETS)
    else:
        preset = PRESETS[preset_idx % len(PRESETS)]

    return {
        "ph": round(random.uniform(*preset["ph"]), 2),
        "temperature": round(random.uniform(*preset["temperature"]), 1),
        "turbidity": round(random.uniform(*preset["turbidity"]), 2),
        "totalDissolvedSolids": round(random.uniform(*preset["totalDissolvedSolids"]), 1),
        "conductivity": round(random.uniform(*preset["conductivity"]), 1),
        "_desc": preset["description"]
    }

def send_telemetry(sample):
    desc = sample.pop("_desc", "Water Sample")
    payload = json.dumps(sample).encode("utf-8")
    req = urllib.request.Request(
        BACKEND_PREDICT_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Device-ID": "ESP32-MOCK-NODE",
            "X-Device-RSSI": "-54"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            data = res_body.get('data', {})
            anomaly_flag = " [ANOMALY DETECTED]" if data.get('isAnomaly') else ""
            print(f"[SUCCESS] {desc}{anomaly_flag}")
            print(f"  Input:   {sample}")
            print(f"  Verdict: {data.get('prediction')} (Confidence: {data.get('confidence')}%)")
            if data.get('isAnomaly'):
                print(f"  Reason:  {data.get('anomalyReason')}")
            print()
    except Exception as e:
        print(f"[FAILED] {desc}: {e}\n")

if __name__ == "__main__":
    print("=" * 65)
    print("  Aqualytica Telemetry Simulation Utility")
    print("=================================================================")
    print("Sending test samples to:", BACKEND_PREDICT_URL)
    print("=" * 65)

    for i in range(len(PRESETS)):
        sample = generate_sample(preset_idx=i)
        send_telemetry(sample)
        time.sleep(2)

