"""
==============================================================================
  Prediction API Verification Script
  Project: Aqualytica - Water Quality Intelligence Platform
==============================================================================

This script tests predictions end-to-end across:
  1. Python Flask ML Service (http://localhost:5000/predict)
  2. Spring Boot REST Middleware (http://localhost:8080/api/predict)
==============================================================================
"""

import urllib.request
import json

test_cases = [
    {
        "name": "Sample 1: Ideal Safe Drinking Water",
        "data": {
            "ph": 7.20,
            "temperature": 22.5,
            "turbidity": 0.80,
            "totalDissolvedSolids": 180.0,
            "conductivity": 350.0
        },
        "expected": "Potable"
    },
    {
        "name": "Sample 2: Highly Acidic & Turbid Contaminated Water",
        "data": {
            "ph": 4.50,
            "temperature": 32.0,
            "turbidity": 8.50,
            "totalDissolvedSolids": 1200.0,
            "conductivity": 1800.0
        },
        "expected": "Not Potable"
    },
    {
        "name": "Sample 3: Elevated Turbidity & Solids Contaminated Water",
        "data": {
            "ph": 5.80,
            "temperature": 28.2,
            "turbidity": 6.80,
            "totalDissolvedSolids": 850.0,
            "conductivity": 1400.0
        },
        "expected": "Not Potable"
    },
    {
        "name": "Sample 4: Ideal Pure Mineral Water",
        "data": {
            "ph": 7.50,
            "temperature": 20.0,
            "turbidity": 0.30,
            "totalDissolvedSolids": 150.0,
            "conductivity": 300.0
        },
        "expected": "Potable"
    }
]

def test_flask():
    print("=" * 70)
    print("  TEST 1: PYTHON FLASK ML API (http://localhost:5000/predict)")
    print("=" * 70)
    for tc in test_cases:
        req = urllib.request.Request(
            "http://localhost:5000/predict",
            data=json.dumps(tc["data"]).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            pred = res.get("prediction")
            conf = res.get("confidence")
            match = "OK" if pred == tc["expected"] else "MISMATCH"
            print(f"  {tc['name']}")
            print(f"    Expected: {tc['expected']:<12} | Predicted: {pred:<12} | Confidence: {conf:>6.2f}% | Status: {match}\n")

def test_springboot():
    print("=" * 70)
    print("  TEST 2: SPRING BOOT REST API (http://localhost:8080/api/predict)")
    print("=" * 70)
    for tc in test_cases:
        req = urllib.request.Request(
            "http://localhost:8080/api/predict",
            data=json.dumps(tc["data"]).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            data = res.get("data", {})
            pred = data.get("prediction")
            conf = data.get("confidence")
            match = "OK" if pred == tc["expected"] else "MISMATCH"
            print(f"  {tc['name']}")
            print(f"    Expected: {tc['expected']:<12} | Predicted: {pred:<12} | Confidence: {conf:>6.2f}% | Status: {match}\n")

if __name__ == "__main__":
    test_flask()
    test_springboot()
