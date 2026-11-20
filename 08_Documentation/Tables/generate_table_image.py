import matplotlib.pyplot as plt
import os

def generate_table_image(dark_mode=True):
    # Set high DPI
    plt.rcParams['font.sans-serif'] = 'Segoe UI', 'DejaVu Sans', 'Arial'
    plt.rcParams['font.family'] = 'sans-serif'
    
    fig, ax = plt.subplots(figsize=(15, 7.5), dpi=300)
    
    if dark_mode:
        bg_color = '#0B1120'
        header_bg = '#1E293B'
        champion_bg = '#064E3B'
        champion_text = '#34D399'
        row_even = '#111C33'
        row_odd = '#0E1726'
        border_color = '#334155'
        title_color = '#F8FAFC'
        sub_color = '#94A3B8'
        text_color = '#F1F5F9'
        reject_color = '#F87171'
        note_color = '#64748B'
    else:
        bg_color = '#FFFFFF'
        header_bg = '#0F172A'
        champion_bg = '#DCFCE7'
        champion_text = '#166534'
        row_even = '#F8FAFC'
        row_odd = '#EDF2F7'
        border_color = '#CBD5E1'
        title_color = '#0F172A'
        sub_color = '#475569'
        text_color = '#0F172A'
        reject_color = '#B91C1C'
        note_color = '#64748B'

    fig.patch.set_facecolor(bg_color)
    ax.set_facecolor(bg_color)
    ax.axis('off')

    # Header Title & Subtitle
    plt.text(
        0.5, 0.94,
        "AQUALYTICA — MACHINE LEARNING MODEL BENCHMARK TABLE",
        ha='center', va='center',
        fontsize=16, fontweight='bold',
        color=title_color, transform=ax.transAxes
    )
    plt.text(
        0.5, 0.89,
        "Comparative Evaluation Matrix Across 6 Supervised Classifiers for Potability Inference",
        ha='center', va='center',
        fontsize=10.5,
        color=sub_color, transform=ax.transAxes
    )

    # Table Header and Rows
    headers = [
        "Model Candidate",
        "Accuracy",
        "Precision",
        "Recall",
        "F1-Score",
        "ROC-AUC",
        "Latency",
        "Selection Decision & Technical Rationale"
    ]

    rows = [
        [
            "Random Forest (Selected)",
            "99.91%",
            "99.81%",
            "100.00%",
            "0.999",
            "1.000",
            "0.03 ms",
            "APPROVED — 100% recall prevents false safe verdicts; superior noise immunity"
        ],
        [
            "Decision Tree (CART)",
            "99.84%",
            "99.81%",
            "99.88%",
            "0.998",
            "0.998",
            "< 0.01 ms",
            "Rejected — Susceptible to high variance and overfitting on sensor drift"
        ],
        [
            "K-Nearest Neighbors (KNN)",
            "96.88%",
            "96.24%",
            "97.56%",
            "0.969",
            "0.996",
            "0.04 ms",
            "Rejected — O(N) inference complexity scales poorly with continuous telemetry"
        ],
        [
            "Support Vector Classifier (SVC)",
            "96.09%",
            "95.67%",
            "96.56%",
            "0.961",
            "0.996",
            "0.19 ms",
            "Rejected — High kernel compute latency unsuitable for real-time edge streaming"
        ],
        [
            "Gaussian Naive Bayes",
            "81.59%",
            "73.72%",
            "98.19%",
            "0.842",
            "0.954",
            "< 0.01 ms",
            "Rejected — Violates conditional feature independence (TDS correlates with EC)"
        ],
        [
            "Logistic Regression",
            "65.16%",
            "63.06%",
            "73.19%",
            "0.677",
            "0.695",
            "< 0.01 ms",
            "Rejected — Linear hypothesis underfits non-linear hydrochemical boundaries"
        ]
    ]

    table_data = [headers] + rows
    col_widths = [0.18, 0.08, 0.08, 0.08, 0.07, 0.07, 0.08, 0.36]

    table = ax.table(
        cellText=table_data,
        colWidths=col_widths,
        loc='center',
        cellLoc='center',
        bbox=[0.02, 0.14, 0.96, 0.70]
    )

    table.auto_set_font_size(False)
    table.set_fontsize(9.5)

    # Style cells
    for (row_idx, col_idx), cell in table.get_celld().items():
        cell.set_edgecolor(border_color)
        cell.set_linewidth(1.0)
        
        # Header Row
        if row_idx == 0:
            cell.set_facecolor(header_bg)
            cell.set_text_props(weight='bold', color='#38BDF8' if dark_mode else '#FFFFFF', size=10)
            cell.set_height(0.08)
        # Champion Row (Random Forest)
        elif row_idx == 1:
            cell.set_facecolor(champion_bg)
            cell.set_text_props(weight='bold', color=champion_text, size=9.5)
            if col_idx in (0, 7):
                cell.set_text_props(weight='bold', color=champion_text, ha='left')
            cell.set_height(0.075)
        # Other Model Rows
        else:
            row_color = row_even if row_idx % 2 == 0 else row_odd
            cell.set_facecolor(row_color)
            
            # Align model name and rationale left for readability
            if col_idx == 0:
                cell.set_text_props(weight='bold', color=text_color, ha='left')
            elif col_idx == 7:
                cell.set_text_props(color=reject_color, ha='left', size=8.8)
            else:
                cell.set_text_props(color=text_color, size=9.2)
            cell.set_height(0.075)

    # Footer Notes
    plt.text(
        0.02, 0.08,
        "Notes: Validated on 5-dimensional hydrodynamic parameters: pH (6.5-8.5), Turbidity (<1.0 NTU), TDS (<500 mg/L), Temperature (15-25°C), EC (<400 µS/cm).",
        ha='left', va='center',
        fontsize=8.5, color=note_color, transform=ax.transAxes
    )
    plt.text(
        0.02, 0.045,
        "Model Selection Consensus: Random Forest 100-Tree bagging ensemble selected for 0.03ms low-latency edge deployment and zero false safe classification risk.",
        ha='left', va='center',
        fontsize=8.5, color=note_color, transform=ax.transAxes
    )

    suffix = "dark" if dark_mode else "light"
    out_dir_1 = r"08_Documentation\Figures"
    os.makedirs(out_dir_1, exist_ok=True)
    out_path_1 = os.path.join(out_dir_1, f"Aqualytica_ML_Model_Comparison_Table_{suffix}.png")
    
    out_dir_2 = r"C:\Users\Asus\.gemini\antigravity\brain\facb0318-1a70-49a9-b7dc-f3227c79255c"
    os.makedirs(out_dir_2, exist_ok=True)
    out_path_2 = os.path.join(out_dir_2, f"Aqualytica_ML_Model_Comparison_Table_{suffix}.png")

    plt.savefig(out_path_1, dpi=300, facecolor=bg_color, edgecolor='none', bbox_inches='tight')
    plt.savefig(out_path_2, dpi=300, facecolor=bg_color, edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"[{suffix.upper()}] Table saved to: {out_path_1} and {out_path_2}")

if __name__ == "__main__":
    generate_table_image(dark_mode=True)
    generate_table_image(dark_mode=False)
