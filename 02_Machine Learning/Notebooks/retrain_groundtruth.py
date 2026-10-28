import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

INPUT_DATASET = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Versions", "Master_Dataset_backup_original.csv")

print("=" * 70)
print("1. Loading raw dataset...")
print("=" * 70)

df = pd.read_csv(INPUT_DATASET, low_memory=False)
feature_cols = ["pH", "Temperature", "Turbidity", "Total Dissolved Solids", "Conductivity"]
for col in feature_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")
df = df.dropna(subset=feature_cols)

# Realistic physical range filters
df = df[
    (df["pH"] >= 0) & (df["pH"] <= 14) &
    (df["Temperature"] >= 0) & (df["Temperature"] <= 100) &
    (df["Turbidity"] >= 0) &
    (df["Total Dissolved Solids"] >= 0) &
    (df["Conductivity"] >= 0)
]

# Apply scientific WHO & BIS 10500 Potability ground truth:
# Safe: 6.5 <= pH <= 8.5, Turbidity <= 5.0, TDS <= 1000, Conductivity <= 1200, 5 <= Temp <= 40
is_potable = (
    (df["pH"] >= 6.5) & (df["pH"] <= 8.5) &
    (df["Turbidity"] <= 5.0) &
    (df["Total Dissolved Solids"] <= 1000.0) &
    (df["Conductivity"] <= 1200.0) &
    (df["Temperature"] >= 5.0) & (df["Temperature"] <= 40.0)
)
df["Target"] = is_potable.astype(int)

# Sample balanced: 6,000 real potable samples, 6,000 real non-potable samples
potable_sample = df[df["Target"] == 1].sample(n=6000, random_state=42)
non_potable_sample = df[df["Target"] == 0].sample(n=6000, random_state=42)

# Augment with boundary cases to ensure robust coverage across all parameter spaces
np.random.seed(42)
n_synth = 2000

# Acidic samples (pH 2.0 to 6.4)
synth_acidic = pd.DataFrame({
    "pH": np.random.uniform(2.0, 6.4, n_synth // 4),
    "Temperature": np.random.uniform(15, 35, n_synth // 4),
    "Turbidity": np.random.uniform(0.1, 8.0, n_synth // 4),
    "Total Dissolved Solids": np.random.uniform(100, 800, n_synth // 4),
    "Conductivity": np.random.uniform(200, 1000, n_synth // 4),
    "Target": 0
})

# Alkaline samples (pH 8.6 to 13.0)
synth_basic = pd.DataFrame({
    "pH": np.random.uniform(8.6, 13.0, n_synth // 4),
    "Temperature": np.random.uniform(15, 35, n_synth // 4),
    "Turbidity": np.random.uniform(0.1, 8.0, n_synth // 4),
    "Total Dissolved Solids": np.random.uniform(100, 800, n_synth // 4),
    "Conductivity": np.random.uniform(200, 1000, n_synth // 4),
    "Target": 0
})

# Turbid / muddy samples (Turbidity 5.5 to 30.0 NTU)
synth_turbid = pd.DataFrame({
    "pH": np.random.uniform(6.5, 8.5, n_synth // 4),
    "Temperature": np.random.uniform(15, 35, n_synth // 4),
    "Turbidity": np.random.uniform(5.5, 30.0, n_synth // 4),
    "Total Dissolved Solids": np.random.uniform(150, 900, n_synth // 4),
    "Conductivity": np.random.uniform(250, 1100, n_synth // 4),
    "Target": 0
})

# High TDS / mineral saturation samples (TDS 1050 to 3500 mg/L)
synth_hightds = pd.DataFrame({
    "pH": np.random.uniform(6.5, 8.5, n_synth // 4),
    "Temperature": np.random.uniform(15, 35, n_synth // 4),
    "Turbidity": np.random.uniform(0.2, 4.0, n_synth // 4),
    "Total Dissolved Solids": np.random.uniform(1050, 3500, n_synth // 4),
    "Conductivity": np.random.uniform(1300, 4500, n_synth // 4),
    "Target": 0
})

# Safe pristine mineral water samples
synth_potable = pd.DataFrame({
    "pH": np.random.uniform(6.8, 8.2, 2000),
    "Temperature": np.random.uniform(15, 30, 2000),
    "Turbidity": np.random.uniform(0.1, 3.5, 2000),
    "Total Dissolved Solids": np.random.uniform(120, 600, 2000),
    "Conductivity": np.random.uniform(200, 850, 2000),
    "Target": 1
})

combined = pd.concat([
    potable_sample, non_potable_sample,
    synth_acidic, synth_basic, synth_turbid, synth_hightds,
    synth_potable
], ignore_index=True)

combined = combined[feature_cols + ["Target"]].round(2)
print(f"Combined dataset: {combined.shape}")
print(f"Target balance: Potable={sum(combined['Target']==1)}, Not Potable={sum(combined['Target']==0)}")

X = combined[feature_cols]
y = combined["Target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

rf = RandomForestClassifier(n_estimators=300, max_depth=16, min_samples_split=4, random_state=42, class_weight="balanced", n_jobs=-1)
rf.fit(X_train_s, y_train)

test_preds = rf.predict(X_test_s)
print(f"\nModel Test Accuracy: {accuracy_score(y_test, test_preds)*100:.2f}%")
print(classification_report(y_test, test_preds, target_names=["Not Potable (0)", "Potable (1)"]))

# Save updated dataset and models
TRAINING_CSV = os.path.join(PROJECT_ROOT, "02_Machine Learning", "Training", "Potability_Model_Dataset.csv")
MASTER_CSV = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Master_Dataset.csv")
PREPROC_CSV = os.path.join(PROJECT_ROOT, "01_Datasets", "Preprocessed Dataset", "Master_Dataset_Preprocessed.csv")
V7_CSV = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Versions", "Master_Dataset_v7.csv")

combined.to_csv(TRAINING_CSV, index=False)
combined.to_csv(MASTER_CSV, index=False)
combined.to_csv(PREPROC_CSV, index=False)
combined.to_csv(V7_CSV, index=False)
print("Updated datasets saved successfully.")

SAVED_MODELS_DIR = os.path.join(PROJECT_ROOT, "02_Machine Learning", "Saved Models")
FLASK_MODELS_DIR = os.path.join(PROJECT_ROOT, "03_Backend", "python-ml-api", "models")

for out_dir in [SAVED_MODELS_DIR, FLASK_MODELS_DIR]:
    joblib.dump(rf, os.path.join(out_dir, "Water_Potability_RF_Model.pkl"))
    joblib.dump(scaler, os.path.join(out_dir, "Feature_Scaler.pkl"))
print("Model & Scaler exported to Saved Models and Flask models successfully.")

# Validate on comprehensive test cases
test_cases = [
    ("Safe 1: Clean Spring Water", 7.2, 22.0, 0.5, 180.0, 350.0, "Potable"),
    ("Safe 2: Municipal Treated Tap", 7.5, 20.0, 0.8, 250.0, 420.0, "Potable"),
    ("Safe 3: Mild Mineral Water", 8.0, 18.0, 0.3, 350.0, 500.0, "Potable"),
    ("Unsafe 1: Highly Acidic Runoff (pH 4.0)", 4.0, 25.0, 0.5, 200.0, 350.0, "Not Potable"),
    ("Unsafe 2: Severe Battery Acid (pH 2.0)", 2.0, 25.0, 0.5, 200.0, 350.0, "Not Potable"),
    ("Unsafe 3: Highly Alkaline / Caustic (pH 11.5)", 11.5, 25.0, 0.5, 200.0, 350.0, "Not Potable"),
    ("Unsafe 4: Heavy Mud & Silt (Turbidity 15.0)", 7.2, 25.0, 15.0, 200.0, 350.0, "Not Potable"),
    ("Unsafe 5: High Brackish TDS (TDS 2200)", 7.2, 25.0, 0.5, 2200.0, 2800.0, "Not Potable"),
    ("Unsafe 6: Realistic Toxic Mix (pH 4.5, Turb 8.5, TDS 1200)", 4.5, 32.0, 8.5, 1200.0, 1800.0, "Not Potable"),
    ("Unsafe 7: High Conductivity (Cond 3000)", 7.2, 25.0, 0.5, 300.0, 3000.0, "Not Potable"),
    ("Unsafe 8: Extreme Hot Industrial (Temp 65C)", 7.2, 65.0, 0.5, 200.0, 350.0, "Not Potable")
]

print("\n" + "=" * 70)
print("VALIDATION SUITE RESULTS:")
print("=" * 70)

all_passed = True
for name, ph, temp, turb, tds, cond, expected in test_cases:
    features = np.array([[ph, temp, turb, tds, cond]])
    scaled = scaler.transform(features)
    pred_code = rf.predict(scaled)[0]
    prob = rf.predict_proba(scaled)[0]
    pred_label = "Potable" if pred_code == 1 else "Not Potable"
    conf = max(prob) * 100
    is_match = (pred_label == expected)
    if not is_match:
        all_passed = False
    status_str = "PASS" if is_match else "FAIL"
    print(f"{name:<55} -> Pred: {pred_label:<12} (Conf: {conf:5.1f}%) | Expected: {expected:<12} | {status_str}")

print(f"\nAll tests passed: {all_passed}")
