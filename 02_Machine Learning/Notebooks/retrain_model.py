"""
==============================================================================
  Improved Random Forest Model Training Script
  Project: AI-Based Water Quality Monitoring System
==============================================================================

  This script retrains the Random Forest classifier with:
    1. class_weight="balanced" to handle 77/23 class imbalance
    2. Training on SCALED features to match Flask deployment
    3. Hyperparameter tuning via RandomizedSearchCV
    4. Comprehensive evaluation (Precision, Recall, F1, ROC-AUC)
    5. Validation against 10 realistic water samples

  Output files (same filenames as before):
    - Water_Potability_RF_Model.pkl
    - Feature_Scaler.pkl
    - Model_Comparison.csv (evaluation results)
==============================================================================
"""

import pandas as pd
import numpy as np
import joblib
import os
import time

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

# =====================================================
# Configuration
# =====================================================

DATASET_PATH = "../../02_Machine Learning/Training/Potability_Model_Dataset.csv"
MODEL_FOLDER = "../../02_Machine Learning/Saved Models"
RESULTS_FOLDER = "../../08_Documentation/Tables"

# =====================================================
# Step 1: Load Dataset
# =====================================================

print("=" * 70)
print("  STEP 1: Loading Dataset")
print("=" * 70)

df = pd.read_csv(DATASET_PATH, low_memory=False)
print(f"  Dataset shape: {df.shape}")
print(f"  Columns: {df.columns.tolist()}")

# =====================================================
# Step 2: Drop unused columns (same as original)
# =====================================================

print("\n" + "=" * 70)
print("  STEP 2: Preparing Features")
print("=" * 70)

df = df.drop(columns=["Dissolved Oxygen", "WQI"])
df["Target"] = df["Target"].astype(int)

print(f"  Columns after drop: {df.columns.tolist()}")
print(f"  Feature count: {len(df.columns) - 1}")

# =====================================================
# Step 3: Analyze Class Distribution
# =====================================================

print("\n" + "=" * 70)
print("  STEP 3: Class Distribution Analysis")
print("=" * 70)

class_counts = df["Target"].value_counts()
class_pcts = (df["Target"].value_counts(normalize=True) * 100).round(2)

print(f"  Not Potable (0): {class_counts[0]:,} samples ({class_pcts[0]}%)")
print(f"  Potable     (1): {class_counts[1]:,} samples ({class_pcts[1]}%)")
print(f"  Imbalance Ratio: {class_counts[0] / class_counts[1]:.2f}:1")
print(f"  --> Using class_weight='balanced' to compensate")

# =====================================================
# Step 4: Split Features and Target
# =====================================================

X = df.drop(columns=["Target"])
y = df["Target"]

print(f"\n  Features shape: {X.shape}")
print(f"  Target shape:   {y.shape}")
print(f"  Feature order:  {X.columns.tolist()}")

# =====================================================
# Step 5: Train/Test Split (stratified)
# =====================================================

print("\n" + "=" * 70)
print("  STEP 4: Train/Test Split")
print("=" * 70)

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"  Training set: {X_train.shape[0]:,} samples")
print(f"  Testing set:  {X_test.shape[0]:,} samples")

# =====================================================
# Step 6: Feature Scaling
# CRITICAL FIX: Train RF on scaled data to match Flask
# =====================================================

print("\n" + "=" * 70)
print("  STEP 5: Feature Scaling (CRITICAL FIX)")
print("=" * 70)
print("  Previous bug: RF was trained on RAW data but Flask scales input")
print("  Fix: Training RF on SCALED data to match Flask deployment")

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"  Scaling completed. Shape: {X_train_scaled.shape}")

# =====================================================
# Step 7: Train comparison models (same as original notebook)
# =====================================================

print("\n" + "=" * 70)
print("  STEP 6: Training Comparison Models")
print("=" * 70)

# --- Logistic Regression ---
print("\n  [1/5] Logistic Regression...")
lr_model = LogisticRegression(max_iter=1000, random_state=42)
lr_model.fit(X_train_scaled, y_train)
lr_pred = lr_model.predict(X_test_scaled)
lr_accuracy = accuracy_score(y_test, lr_pred)
print(f"        Accuracy: {lr_accuracy * 100:.2f}%")

# --- Decision Tree ---
print("  [2/5] Decision Tree...")
dt_model = DecisionTreeClassifier(random_state=42, class_weight="balanced")
dt_model.fit(X_train_scaled, y_train)
dt_pred = dt_model.predict(X_test_scaled)
dt_accuracy = accuracy_score(y_test, dt_pred)
print(f"        Accuracy: {dt_accuracy * 100:.2f}%")

# --- KNN ---
print("  [3/5] K-Nearest Neighbors...")
knn_model = KNeighborsClassifier(n_neighbors=5, n_jobs=-1)
knn_model.fit(X_train_scaled, y_train)
knn_pred = knn_model.predict(X_test_scaled)
knn_accuracy = accuracy_score(y_test, knn_pred)
print(f"        Accuracy: {knn_accuracy * 100:.2f}%")

# --- Naive Bayes ---
print("  [4/5] Gaussian Naive Bayes..."  )
nb_model = GaussianNB()
nb_model.fit(X_train_scaled, y_train)
nb_pred = nb_model.predict(X_test_scaled)
nb_accuracy = accuracy_score(y_test, nb_pred)
print(f"        Accuracy: {nb_accuracy * 100:.2f}%")

# =====================================================
# Step 8: Random Forest with Hyperparameter Tuning
# =====================================================

print("\n" + "=" * 70)
print("  STEP 7: Random Forest — Hyperparameter Tuning")
print("=" * 70)
print("  Using RandomizedSearchCV (n_iter=20, cv=3)")
print("  This may take 15-30 minutes on ~1M rows...\n")

param_distributions = {
    "n_estimators": [200, 300],
    "max_depth": [20, 30, None],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "class_weight": ["balanced"],
}

rf_base = RandomForestClassifier(
    random_state=42,
    n_jobs=-1
)

start_time = time.time()

search = RandomizedSearchCV(
    estimator=rf_base,
    param_distributions=param_distributions,
    n_iter=20,
    cv=3,
    scoring="f1",                # Optimize for F1 (balances precision & recall)
    random_state=42,
    n_jobs=-1,
    verbose=1
)

search.fit(X_train_scaled, y_train)

elapsed = time.time() - start_time
print(f"\n  Search completed in {elapsed / 60:.1f} minutes")
print(f"\n  Best Parameters:")
for param, val in search.best_params_.items():
    print(f"    {param}: {val}")
print(f"  Best CV F1 Score: {search.best_score_:.4f}")

rf_model = search.best_estimator_

# =====================================================
# Step 9: Comprehensive Evaluation
# =====================================================

print("\n" + "=" * 70)
print("  STEP 8: Comprehensive Evaluation")
print("=" * 70)

rf_pred = rf_model.predict(X_test_scaled)
rf_proba = rf_model.predict_proba(X_test_scaled)[:, 1]

rf_accuracy = accuracy_score(y_test, rf_pred)
rf_precision = precision_score(y_test, rf_pred)
rf_recall = recall_score(y_test, rf_pred)
rf_f1 = f1_score(y_test, rf_pred)
rf_roc_auc = roc_auc_score(y_test, rf_proba)
rf_cm = confusion_matrix(y_test, rf_pred)

print(f"\n  Random Forest Results (Improved):")
print(f"  {'='*45}")
print(f"  Accuracy  : {rf_accuracy * 100:.2f}%")
print(f"  Precision : {rf_precision * 100:.2f}%")
print(f"  Recall    : {rf_recall * 100:.2f}%")
print(f"  F1 Score  : {rf_f1 * 100:.2f}%")
print(f"  ROC-AUC   : {rf_roc_auc:.4f}")
print(f"\n  Confusion Matrix:")
print(f"  {rf_cm}")

print(f"\n  Full Classification Report:")
print(classification_report(y_test, rf_pred, target_names=["Not Potable", "Potable"]))

# =====================================================
# Step 10: Model Comparison Table
# =====================================================

print("\n" + "=" * 70)
print("  STEP 9: Model Comparison")
print("=" * 70)

model_results = pd.DataFrame({
    "Model": [
        "Logistic Regression",
        "Decision Tree",
        "Random Forest",
        "KNN",
        "Naive Bayes"
    ],
    "Accuracy": [
        round(lr_accuracy * 100, 2),
        round(dt_accuracy * 100, 2),
        round(rf_accuracy * 100, 2),
        round(knn_accuracy * 100, 2),
        round(nb_accuracy * 100, 2)
    ]
})

model_results = model_results.sort_values(by="Accuracy", ascending=False)
print(model_results.to_string(index=False))

os.makedirs(RESULTS_FOLDER, exist_ok=True)
model_results.to_csv(
    os.path.join(RESULTS_FOLDER, "Model_Comparison.csv"),
    index=False
)
print(f"\n  Saved to {RESULTS_FOLDER}/Model_Comparison.csv")

# =====================================================
# Step 11: Realistic Validation Samples
# =====================================================

print("\n" + "=" * 70)
print("  STEP 10: Realistic Validation Testing")
print("=" * 70)

validation_samples = pd.DataFrame({
    "pH":                      [7.2, 7.5, 7.0, 6.8, 8.0, 5.5,  9.2,  4.0,  6.5,  7.8],
    "Temperature":             [25,  22,  20,  28,  18,  35,   32,   40,   30,   26 ],
    "Turbidity":               [0.5, 0.3, 0.1, 0.8, 0.2, 8.0,  6.5,  10.0, 4.0,  3.5],
    "Total Dissolved Solids":  [180, 200, 150, 250, 180, 1500, 1200, 2000, 800,  700],
    "Conductivity":            [350, 400, 300, 420, 380, 1800, 1500, 2500, 1000, 900],
    "Nitrate":                 [4.5, 3.0, 2.0, 5.0, 3.5, 25.0, 18.0, 30.0, 12.0, 9.0],
    "Chloride":                [120, 100, 80,  150, 110, 400,  350,  500,  280,  200]
})

expected_labels = [
    "Potable", "Potable", "Potable", "Potable", "Potable",
    "Not Potable", "Not Potable", "Not Potable", "Not Potable", "Borderline"
]

validation_scaled = scaler.transform(validation_samples)
val_predictions = rf_model.predict(validation_scaled)
val_probabilities = rf_model.predict_proba(validation_scaled)

print(f"\n  {'#':<4} {'Expected':<15} {'Predicted':<15} {'Confidence':<12} {'Match'}")
print(f"  {'-'*60}")

pass_count = 0
for i in range(len(validation_samples)):
    pred_label = "Potable" if val_predictions[i] == 1 else "Not Potable"
    confidence = max(val_probabilities[i]) * 100
    expected = expected_labels[i]

    if expected == "Borderline":
        match = "~"  # borderline, either result acceptable
        pass_count += 1
    elif pred_label == expected:
        match = "✓"
        pass_count += 1
    else:
        match = "✗"

    print(f"  {i+1:<4} {expected:<15} {pred_label:<15} {confidence:>6.2f}%      {match}")

print(f"\n  Validation Result: {pass_count}/10 samples matched expectations")

# =====================================================
# Step 12: Save Model & Scaler
# =====================================================

print("\n" + "=" * 70)
print("  STEP 11: Saving Model & Scaler")
print("=" * 70)

os.makedirs(MODEL_FOLDER, exist_ok=True)

model_path = os.path.join(MODEL_FOLDER, "Water_Potability_RF_Model.pkl")
scaler_path = os.path.join(MODEL_FOLDER, "Feature_Scaler.pkl")

joblib.dump(rf_model, model_path)
print(f"  Model saved  → {model_path}")
print(f"  Model size   → {os.path.getsize(model_path) / (1024*1024):.1f} MB")

joblib.dump(scaler, scaler_path)
print(f"  Scaler saved → {scaler_path}")

# =====================================================
# Done
# =====================================================

print("\n" + "=" * 70)
print("  RETRAINING COMPLETE")
print("=" * 70)
print(f"""
  Next steps:
    1. Copy the new .pkl files to Flask models/ directory
    2. Restart Flask API
    3. Test via React frontend with the sample:
       pH=7.2, Temp=25, Turb=0.5, TDS=180, Cond=350, Nitrate=4.5, Chloride=120
       → Should now predict 'Potable'
""")
