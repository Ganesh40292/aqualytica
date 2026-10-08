from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# =====================================================
# CORS Headers Middleware
# =====================================================
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# =====================================================
# Load Random Forest Model & Scaler
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "Water_Potability_RF_Model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "Feature_Scaler.pkl"
)

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

print("=====================================")
print("Random Forest Model & Scaler Loaded Successfully")
print("=====================================")


# =====================================================
# Home Route
# =====================================================

@app.route("/")
def home():
    return "Python ML API is Running Successfully!"


# =====================================================
# Prediction Route
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    features = np.array([[
        data["ph"],
        data["temperature"],
        data["turbidity"],
        data["totalDissolvedSolids"],
        data["conductivity"]
    ]])

    # Scale the input parameters using standard scaler
    scaled_features = scaler.transform(features)

    prediction = model.predict(scaled_features)[0]

    probabilities = model.predict_proba(scaled_features)[0]

    confidence = round(float(np.max(probabilities) * 100), 2)

    result = "Potable" if prediction == 1 else "Not Potable"

    return jsonify({
        "prediction": result,
        "confidence": confidence
    })


# =====================================================
# Run Flask
# =====================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False
    )