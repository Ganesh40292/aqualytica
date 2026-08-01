# Aqualytica - Machine Learning Training Pipeline

This directory contains the machine learning pipelines, Python scripts, saved model artifacts, and evaluation reports for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## ⚙️ Model Training Architecture & Reproducibility

- **Training Script**: [retrain_model.py](file:///d:/Full%20Updated%20Major%20Project%28Main%20One%29/Major%20Project/02_Machine%20Learning/Notebooks/retrain_model.py)
- **Dataset**: `Potability_Model_Dataset.csv` (10,000 stratified rows, single integer `Target` column: `0 = Not Potable`, `1 = Potable`).
- **Reproducibility**: Train/Test split initialized with `random_state=42` (`80% Train / 20% Test`).
- **Preprocessing**: Input features scaled using `StandardScaler` (`Feature_Scaler.pkl`).

---

## 📈 Model Comparison Results

| Model Candidate | Validation Accuracy | F1-Score | Status |
| :--- | :--- | :--- | :--- |
| **Random Forest (Selected)** | **84.25%** | **0.680** | **Approved (Best performance & balance)** |
| **Gaussian Naive Bayes** | `80.50%` | `0.635` | Evaluated |
| **K-Nearest Neighbors** | `79.90%` | `0.612` | Evaluated |
| **Logistic Regression** | `79.20%` | `0.589` | Evaluated |
| **Decision Tree (CART)** | `76.45%` | `0.570` | Evaluated |

---

## 📊 Comprehensive Random Forest Metrics

- **Accuracy**: `84.25%`
- **Precision**: `63.02%`
- **Recall**: `73.73%`
- **F1-Score**: `67.96%`
- **ROC-AUC**: `0.8032`
- **Evaluation Tables Exported**: `08_Documentation/Tables/Model_Evaluation_Report.csv` & `Model_Comparison.csv`

---

## 💾 Saved Artifacts

- **Model Binary**: `Saved Models/Water_Potability_RF_Model.pkl` (Synced to `03_Backend/python-ml-api/models/`)
- **Feature Scaler**: `Saved Models/Feature_Scaler.pkl` (Synced to `03_Backend/python-ml-api/models/`)
- **Backup Binaries**: `Saved Models/Backup/`
