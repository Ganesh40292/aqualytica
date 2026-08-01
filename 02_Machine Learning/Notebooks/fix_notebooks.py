"""
==============================================================================
  Notebook Audit & Correction Script
  Project: Aqualytica - Water Quality Intelligence Platform
==============================================================================

This script inspects and updates all Jupyter Notebooks (.ipynb) in 02_Machine Learning/Notebooks:
  1. Replaces legacy Master_Dataset_v6.csv references with active Master_Dataset.csv.
  2. Ensures target encoding df["Target"] is preserved as integer 0/1 without target inversion.
  3. Uses errors="ignore" when dropping optional columns (Dissolved Oxygen, WQI).
==============================================================================
"""

import json
import glob
import os

NOTEBOOKS_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    notebook_files = sorted(glob.glob(os.path.join(NOTEBOOKS_DIR, "*.ipynb")))
    print(f"Auditing {len(notebook_files)} Jupyter Notebooks in {NOTEBOOKS_DIR}...")
    
    for filepath in notebook_files:
        filename = os.path.basename(filepath)
        with open(filepath, "r", encoding="utf-8") as f:
            nb = json.load(f)
            
        modified = False
        for cell in nb.get("cells", []):
            if cell.get("cell_type") == "code":
                new_source = []
                for line in cell.get("source", []):
                    # 1. Update v6 dataset references to active Master_Dataset.csv
                    if "Master_Dataset_v6.csv" in line:
                        line = line.replace("Master_Dataset_v6.csv", "Master_Dataset.csv")
                        modified = True
                        
                    # 2. Prevent target inversion in 08_Model_Training.ipynb
                    if "1 - df[\"Target\"]" in line:
                        line = line.replace("1 - df[\"Target\"]", "df[\"Target\"]")
                        modified = True
                    elif "1 - df['Target']" in line:
                        line = line.replace("1 - df['Target']", "df['Target']")
                        modified = True
                        
                    # 3. Add errors="ignore" for optional column drops
                    if 'columns=[' in line and 'errors=' not in line and ('Dissolved Oxygen' in line or 'WQI' in line):
                        line = line.replace('columns=[', 'errors="ignore", columns=[')
                        modified = True
                        
                    new_source.append(line)
                cell["source"] = new_source
                
        if modified:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(nb, f, indent=1)
            print(f"  [UPDATED] {filename}")
        else:
            print(f"  [OK]      {filename}")

    print("\nNotebook audit & correction complete!")

if __name__ == "__main__":
    main()
