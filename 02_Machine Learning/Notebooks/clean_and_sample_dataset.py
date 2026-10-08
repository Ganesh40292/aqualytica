"""
==============================================================================
  Dataset Hygiene & Stratified Sampling Script
  Project: Aqualytica - Water Quality Intelligence Platform
==============================================================================

This script cleans the Master Dataset and performs stratified sampling:
  1. Applies explicit Target label mapping dictionary (0 = Not Potable, 1 = Potable).
  2. Cleans missing values, drops duplicate rows, and verifies numeric data types.
  3. Filters obvious physical measurement outliers.
  4. Performs stratified sampling to create a clean ~10,000 row dataset.
  5. Exports Master_Dataset_v7.csv and updates active training datasets.
==============================================================================
"""

import pandas as pd
import numpy as np
import os
import shutil
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

INPUT_DATASET = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Versions", "Master_Dataset_backup_original.csv")
V7_OUTPUT = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Versions", "Master_Dataset_v7.csv")
MASTER_OUTPUT = os.path.join(PROJECT_ROOT, "01_Datasets", "Master Dataset", "Master_Dataset.csv")
PREPROCESSED_OUTPUT = os.path.join(PROJECT_ROOT, "01_Datasets", "Preprocessed Dataset", "Master_Dataset_Preprocessed.csv")
TRAINING_OUTPUT = os.path.join(PROJECT_ROOT, "02_Machine Learning", "Training", "Potability_Model_Dataset.csv")

def main():
    print("=" * 70)
    print("  STEP 1: Loading Master Dataset")
    print("=" * 70)
    print(f"  Reading from: {INPUT_DATASET}")
    
    df = pd.read_csv(INPUT_DATASET, low_memory=False)
    print(f"  Raw dataset shape: {df.shape}")

    print("\n" + "=" * 70)
    print("  STEP 2: Target Label Mapping & Standardization")
    print("=" * 70)
    
    # Explicit mapping dictionary
    # Dataset04 convention: 0 = Clean/Safe water, 1 = Contaminated/Higher solids
    target_map = {
        0: 1, 0.0: 1, "0": 1,
        1: 0, 1.0: 0, "1": 0,
        "Good": 1, "Potable": 1, "Safe": 1, "Excellent": 1,
        "Poor": 0, "Not Potable": 0, "Unsafe": 0, "Bad": 0,
        "Moderate": 0, "Fair": 0, "Very Poor": 0, "2": 0, 2: 0, 2.0: 0
    }
    
    df["Target"] = df["Target"].map(target_map)
    initial_null_targets = df["Target"].isna().sum()
    print(f"  Unmappable/Null targets removed: {initial_null_targets:,}")
    df = df.dropna(subset=["Target"])
    df["Target"] = df["Target"].astype(int)
    
    print("  Standardized Target distribution:")
    counts = df["Target"].value_counts()
    print(f"    0 (Not Potable) : {counts.get(0, 0):,} ({counts.get(0, 0)/len(df)*100:.2f}%)")
    print(f"    1 (Potable)     : {counts.get(1, 0):,} ({counts.get(1, 0)/len(df)*100:.2f}%)")

    print("\n" + "=" * 70)
    print("  STEP 3: Data Hygiene & Outlier Filtering")
    print("=" * 70)

    # Required 5 core ML feature columns (Nitrate and Chloride removed)
    feature_cols = [
        "pH", "Temperature", "Turbidity", "Total Dissolved Solids",
        "Conductivity"
    ]
    
    # Ensure numeric types
    for col in feature_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
            
    # Drop rows with nulls in core 5 features
    df = df.dropna(subset=feature_cols)
    
    # Drop duplicates
    prev_len = len(df)
    df = df.drop_duplicates(subset=feature_cols + ["Target"])
    print(f"  Duplicate rows removed: {prev_len - len(df):,}")

    # Physical range filters for 5 core features
    df = df[
        (df["pH"] >= 0) & (df["pH"] <= 14) &
        (df["Temperature"] >= 0) & (df["Temperature"] <= 100) &
        (df["Turbidity"] >= 0) &
        (df["Total Dissolved Solids"] >= 0) &
        (df["Conductivity"] >= 0)
    ]
    print(f"  Cleaned dataset shape: {df.shape}")

    print("\n" + "=" * 70)
    print("  STEP 4: Stratified Sampling (~10,000 Rows)")
    print("=" * 70)

    target_size = min(10000, len(df))
    if len(df) > target_size:
        sample_df, _ = train_test_split(
            df,
            train_size=target_size,
            random_state=42,
            stratify=df["Target"]
        )
    else:
        sample_df = df

    print(f"  Sampled dataset shape: {sample_df.shape}")
    sample_counts = sample_df["Target"].value_counts()
    print("  Sampled Target distribution:")
    print(f"    0 (Not Potable) : {sample_counts.get(0, 0):,} ({sample_counts.get(0, 0)/len(sample_df)*100:.2f}%)")
    print(f"    1 (Potable)     : {sample_counts.get(1, 0):,} ({sample_counts.get(1, 0)/len(sample_df)*100:.2f}%)")

    print("\n" + "=" * 70)
    print("  STEP 5: Exporting Clean Datasets")
    print("=" * 70)

    # Keep standard column order: 5 features + Target
    export_cols = feature_cols + ["Target"]
    sample_df = sample_df[export_cols].copy()

    round_dict = {
        "pH": 2, "Temperature": 2, "Turbidity": 2,
        "Total Dissolved Solids": 2, "Conductivity": 2
    }
    sample_df = sample_df.round(round_dict)

    sample_df.to_csv(V7_OUTPUT, index=False)
    print(f"  Saved Staged V7 dataset -> {V7_OUTPUT}")

    shutil.copy(V7_OUTPUT, MASTER_OUTPUT)
    print(f"  Updated Active Master Dataset -> {MASTER_OUTPUT}")

    shutil.copy(V7_OUTPUT, PREPROCESSED_OUTPUT)
    print(f"  Updated Preprocessed Dataset -> {PREPROCESSED_OUTPUT}")

    shutil.copy(V7_OUTPUT, TRAINING_OUTPUT)
    print(f"  Updated Training Dataset    -> {TRAINING_OUTPUT}")

    print("\n" + "=" * 70)
    print("  DATASET PREPARATION COMPLETE!")
    print("=" * 70)

if __name__ == "__main__":
    main()
