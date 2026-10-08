# Aqualytica - Machine Learning Training Pipeline

This directory contains the machine learning pipelines, Python scripts, saved model artifacts, and evaluation reports for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## ⚙️ Model Training Architecture & Reproducibility

- **Training Script**: [retrain_model.py](file:///d:/Projects/Major%20Project%28Google%20Login%29/Major%20Project/02_Machine%20Learning/Notebooks/retrain_model.py)
- **Dataset**: `Potability_Model_Dataset.csv` (10,000 stratified rows, 5 features: pH, Temperature, Turbidity, Total Dissolved Solids, Conductivity; single integer `Target` column: `0 = Not Potable`, `1 = Potable`).
- **Reproducibility**: Train/Test split initialized with `random_state=42` (`80% Train / 20% Test`).
- **Preprocessing**: 5 Input features scaled using `StandardScaler` (`Feature_Scaler.pkl`).

---

## 📈 Model Comparison Results

| Model Candidate | Validation Accuracy | F1-Score | Status |
| :--- | :--- | :--- | :--- |
| **Random Forest (Selected)** | **82.60%** | **0.887** | **Approved (Best performance & balance)** |
| **K-Nearest Neighbors** | `81.05%` | `0.871` | Evaluated |
| **Gaussian Naive Bayes** | `80.40%` | `0.865` | Evaluated |
| **Logistic Regression** | `78.40%` | `0.852` | Evaluated |
| **Decision Tree (CART)** | `75.30%` | `0.820` | Evaluated |

---

## 📊 Comprehensive Random Forest Metrics

- **Accuracy**: `82.60%`
- **Precision**: `89.06%`
- **Recall**: `88.36%`
- **F1-Score**: `88.71%`
- **ROC-AUC**: `0.7646`
- **Evaluation Tables Exported**: `08_Documentation/Tables/Model_Evaluation_Report.csv` & `Model_Comparison.csv`

---

## 💾 Saved Artifacts

- **Model Binary**: `Saved Models/Water_Potability_RF_Model.pkl` (Synced to `03_Backend/python-ml-api/models/`)
- **Feature Scaler**: `Saved Models/Feature_Scaler.pkl` (Synced to `03_Backend/python-ml-api/models/`)
- **Backup Binaries**: `Saved Models/Backup/`
