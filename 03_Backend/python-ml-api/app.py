"""
==============================================================================
  Aqualytica - Python Machine Learning API Gateway
  Project: Aqualytica – AI-Powered Water Quality Intelligence Platform
==============================================================================
  Runtime: Python 3.14 / Flask REST Microservice
  Role: Serves Random Forest potability classifications and confidence scores.
  Port: 5000 (Default)
==============================================================================
"""

import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# ==============================================================================
#  CORS Headers Middleware
# ==============================================================================
@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

# ==============================================================================
#  Load Machine Learning Model & Preprocessing Scaler
# ==============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "Water_Potability_RF_Model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "Feature_Scaler.pkl")

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("==================================================")
    print("  Random Forest Model & Scaler Loaded Successfully")
    print("==================================================")
except Exception as e:
    print(f"[FATAL ERROR] Failed to load model binaries: {e}")
    model = None
    scaler = None

# Exact feature names matched to training dataset
FEATURE_NAMES = ["pH", "Temperature", "Turbidity", "Total Dissolved Solids", "Conductivity"]

# ==============================================================================
#  API Endpoints
# ==============================================================================
@app.route("/", methods=["GET"])
def home():
    """Health status ping endpoint."""
    return "Python ML API is Running Successfully!"

@app.route("/health", methods=["GET"])
def health():
    """Structured health check endpoint for microservice readiness."""
    return jsonify({
        "status": "UP" if model is not None and scaler is not None else "DEGRADED",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "service": "Aqualytica-ML-Engine"
    }), 200

@app.route("/predict", methods=["POST"])
def predict():

    """
    Inference endpoint for classifying water potability.
    Expects JSON payload with:
      - ph (float)
      - temperature (float)
      - turbidity (float)
      - totalDissolvedSolids (float)
      - conductivity (float)
    """
    if model is None or scaler is None:
        return jsonify({"error": "ML model or scaler is not loaded on server."}), 500

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON payload."}), 400

    required_fields = ["ph", "temperature", "turbidity", "totalDissolvedSolids", "conductivity"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required parameter: {field}"}), 400

    try:
        # Create DataFrame with exact column names to match training feature distribution
        input_df = pd.DataFrame([{
            "pH": float(data["ph"]),
            "Temperature": float(data["temperature"]),
            "Turbidity": float(data["turbidity"]),
            "Total Dissolved Solids": float(data["totalDissolvedSolids"]),
            "Conductivity": float(data["conductivity"])
        }], columns=FEATURE_NAMES)

        # Domain Safety Check (WHO & BIS Drinking Water Standards)
        ph_val = float(data["ph"])
        temp_val = float(data["temperature"])
        turb_val = float(data["turbidity"])
        tds_val = float(data["totalDissolvedSolids"])
        cond_val = float(data["conductivity"])

        is_critical_hazard = (
            ph_val < 6.5 or ph_val > 8.5 or
            turb_val > 5.0 or
            tds_val > 1000.0 or
            cond_val > 1500.0 or
            temp_val < 0.0 or temp_val > 50.0
        )

        # Scale input parameters using standard normal distribution
        scaled_features = scaler.transform(input_df)

        # Generate binary prediction and probability distributions
        prediction = model.predict(scaled_features)[0]
        probabilities = model.predict_proba(scaled_features)[0]

        if is_critical_hazard:
            result = "Not Potable"
            # Ensure high confidence when fundamental safety thresholds are breached
            p_not_potable = float(probabilities[0])
            confidence = round(max(p_not_potable, 0.96) * 100.0, 2)
        else:
            result = "Potable" if int(prediction) == 1 else "Not Potable"
            confidence = round(float(np.max(probabilities) * 100.0), 2)

        return jsonify({
            "prediction": result,
            "confidence": confidence
        })

    except Exception as ex:
        return jsonify({"error": f"Prediction failed: {str(ex)}"}), 500

# ==============================================================================
#  Server Launch
# ==============================================================================
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False
    )