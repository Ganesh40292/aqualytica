# Aqualytica - Machine Learning Training Pipeline

This directory contains the machine learning pipelines, Jupyter notebooks, model definitions, and evaluation scripts for **Aqualytica – AI-Powered Water Quality Intelligence Platform**.

---

## Machine Learning Pipeline
1. **Data Pre-processing**: Imputation of missing variables, normalization, and outlier adjustments.
2. **Feature Scaling**: Fits standard scaling distribution metrics using `StandardScaler` to handle multi-unit ranges.
3. **Model Selection**: Compares classification performance metrics across multiple models (logistic regression, support vector machines, and random forest).
4. **Random Forest Classifier**: Selected model structure using an ensemble of decision trees to determine target potability classification.
5. **Model Evaluation**:
   - Accuracy Matrix check
   - Precision & Recall score tuning
   - ROC-AUC Curve analysis
   - Feature Importance ranking
