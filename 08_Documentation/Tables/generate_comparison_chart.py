import matplotlib.pyplot as plt
import numpy as np
import os
import shutil

# Set styling
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['figure.dpi'] = 300

# Data
models = [
    "Random Forest\n(Selected)",
    "Decision Tree\n(CART)",
    "K-Nearest\nNeighbors",
    "Support Vector\nClassifier",
    "Gaussian\nNaive Bayes",
    "Logistic\nRegression"
]

accuracy = [99.91, 99.84, 96.88, 96.09, 81.59, 65.16]
precision = [99.81, 99.81, 96.24, 95.67, 73.72, 63.06]
recall = [100.00, 99.88, 97.56, 96.56, 98.19, 73.19]
f1 = [99.90, 99.80, 96.90, 96.10, 84.20, 67.70]
roc_auc = [100.00, 99.80, 99.60, 99.60, 95.40, 69.50]

# Colors matching Aqualytica Cyber-Scada Theme
BG_COLOR = '#0B1120'
CARD_BG = '#131D33'
BORDER_COLOR = '#1E293B'
TEXT_WHITE = '#F8FAFC'
TEXT_MUTED = '#94A3B8'
ACCENT_CYAN = '#06B6D4'
ACCENT_EMERALD = '#10B981'
ACCENT_ROSE = '#F43F5E'
ACCENT_AMBER = '#F59E0B'
ACCENT_PURPLE = '#8B5CF6'

fig = plt.figure(figsize=(16, 11), facecolor=BG_COLOR)
fig.suptitle(
    'AQUALYTICA - MACHINE LEARNING ALGORITHM BENCHMARK & COMPARISON',
    fontsize=20,
    fontweight='bold',
    color=TEXT_WHITE,
    y=0.96
)
plt.figtext(
    0.5, 0.925,
    'Comparative Performance Evaluation Across 6 Supervised Classifiers for Water Potability Prediction',
    ha='center',
    fontsize=12,
    color=TEXT_MUTED
)

# -------------------------------------------------------------
# SUBPLOT 1: Grouped Bar Chart (Accuracy, Precision, Recall, F1)
# -------------------------------------------------------------
ax1 = plt.subplot2grid((2, 2), (0, 0), fig=fig)
ax1.set_facecolor(CARD_BG)

x = np.arange(len(models))
width = 0.2

rects1 = ax1.bar(x - 1.5*width, accuracy, width, label='Accuracy (%)', color='#38BDF8', edgecolor=BORDER_COLOR)
rects2 = ax1.bar(x - 0.5*width, precision, width, label='Precision (%)', color='#34D399', edgecolor=BORDER_COLOR)
rects3 = ax1.bar(x + 0.5*width, recall, width, label='Recall (%)', color='#A78BFA', edgecolor=BORDER_COLOR)
rects4 = ax1.bar(x + 1.5*width, f1, width, label='F1-Score (%)', color='#FBBF24', edgecolor=BORDER_COLOR)

ax1.set_title('Classification Metrics Overview', fontsize=13, fontweight='bold', color=TEXT_WHITE, pad=12)
ax1.set_xticks(x)
ax1.set_xticklabels(models, fontsize=9.5, fontweight='bold', color=TEXT_WHITE)
ax1.set_ylabel('Score (%)', fontsize=11, color=TEXT_WHITE)
ax1.set_ylim(50, 108)
ax1.grid(axis='y', linestyle='--', alpha=0.15, color='#CBD5E1')
ax1.legend(loc='lower left', facecolor=CARD_BG, edgecolor=BORDER_COLOR, labelcolor=TEXT_WHITE, fontsize=9)
for spine in ax1.spines.values():
    spine.set_color(BORDER_COLOR)

# Annotate Random Forest top score
ax1.annotate(
    'Champion: 99.91%',
    xy=(0, 99.91),
    xytext=(0, 104),
    ha='center',
    fontsize=8.5,
    fontweight='bold',
    color=ACCENT_CYAN,
    arrowprops=dict(facecolor=ACCENT_CYAN, shrink=0.08, width=1.5, headwidth=5)
)

# -------------------------------------------------------------
# SUBPLOT 2: Horizontal Bar Chart - Overall Accuracy Ranking
# -------------------------------------------------------------
ax2 = plt.subplot2grid((2, 2), (0, 1), fig=fig)
ax2.set_facecolor(CARD_BG)

y_pos = np.arange(len(models))[::-1]
clean_names = [
    "Random Forest (Selected)",
    "Decision Tree (CART)",
    "K-Nearest Neighbors (KNN)",
    "Support Vector Classifier (SVC)",
    "Gaussian Naive Bayes",
    "Logistic Regression"
][::-1]
acc_rev = accuracy[::-1]

bar_colors = [ACCENT_ROSE, ACCENT_AMBER, '#38BDF8', '#60A5FA', '#34D399', ACCENT_CYAN]

bars = ax2.barh(y_pos, acc_rev, height=0.55, color=bar_colors, edgecolor=BORDER_COLOR)
ax2.set_title('Overall Model Accuracy Ranking', fontsize=13, fontweight='bold', color=TEXT_WHITE, pad=12)
ax2.set_yticks(y_pos)
ax2.set_yticklabels(clean_names, fontsize=10, fontweight='bold', color=TEXT_WHITE)
ax2.set_xlabel('Accuracy (%)', fontsize=11, color=TEXT_WHITE)
ax2.set_xlim(50, 106)
ax2.grid(axis='x', linestyle='--', alpha=0.15, color='#CBD5E1')
for spine in ax2.spines.values():
    spine.set_color(BORDER_COLOR)

for bar in bars:
    width_val = bar.get_width()
    ax2.text(
        width_val + 1.0,
        bar.get_y() + bar.get_height()/2,
        f'{width_val:.2f}%',
        va='center',
        ha='left',
        fontsize=9.5,
        fontweight='bold',
        color=TEXT_WHITE
    )

# -------------------------------------------------------------
# SUBPLOT 3: ROC-AUC Performance
# -------------------------------------------------------------
ax3 = plt.subplot2grid((2, 2), (1, 0), fig=fig)
ax3.set_facecolor(CARD_BG)

auc_colors = ['#10B981', '#34D399', '#38BDF8', '#818CF8', '#F59E0B', '#EF4444']
bars3 = ax3.bar(x, roc_auc, width=0.5, color=auc_colors, edgecolor=BORDER_COLOR)
ax3.set_title('ROC-AUC Discriminative Power', fontsize=13, fontweight='bold', color=TEXT_WHITE, pad=12)
ax3.set_xticks(x)
ax3.set_xticklabels(models, fontsize=9.5, fontweight='bold', color=TEXT_WHITE)
ax3.set_ylabel('ROC-AUC Score (%)', fontsize=11, color=TEXT_WHITE)
ax3.set_ylim(60, 108)
ax3.grid(axis='y', linestyle='--', alpha=0.15, color='#CBD5E1')
for spine in ax3.spines.values():
    spine.set_color(BORDER_COLOR)

for bar in bars3:
    h = bar.get_height()
    ax3.text(
        bar.get_x() + bar.get_width()/2,
        h + 1.2,
        f'{h:.2f}%',
        ha='center',
        va='bottom',
        fontsize=9,
        fontweight='bold',
        color=TEXT_WHITE
    )

# -------------------------------------------------------------
# SUBPLOT 4: Evaluation Scorecard & Selection Justification
# -------------------------------------------------------------
ax4 = plt.subplot2grid((2, 2), (1, 1), fig=fig)
ax4.set_facecolor(CARD_BG)
ax4.axis('off')
for spine in ax4.spines.values():
    spine.set_visible(False)

table_data = [
    ["Algorithm", "Accuracy", "Recall", "ROC-AUC", "Status / Decision"],
    ["Random Forest", "99.91%", "100.0%", "1.000", "APPROVED (Production Champion)"],
    ["Decision Tree", "99.84%", "99.88%", "0.998", "Rejected (High Overfitting Risk)"],
    ["KNN", "96.88%", "97.56%", "0.996", "Rejected (Memory Footprint O(N))"],
    ["SVC", "96.09%", "96.56%", "0.996", "Rejected (O(N^3) Training Overhead)"],
    ["Naive Bayes", "81.59%", "98.19%", "0.954", "Rejected (Violates Independence)"],
    ["Logistic Reg.", "65.16%", "73.19%", "0.695", "Rejected (Linear Underfitting)"]
]

table = ax4.table(
    cellText=table_data,
    loc='center',
    cellLoc='center',
    bbox=[0.02, 0.05, 0.96, 0.88]
)

table.auto_set_font_size(False)
table.set_fontsize(9.5)

# Style scorecard table
for (row_idx, col_idx), cell in table.get_celld().items():
    cell.set_edgecolor(BORDER_COLOR)
    cell.set_linewidth(1.0)
    if row_idx == 0:
        cell.set_facecolor('#1E293B')
        cell.set_text_props(weight='bold', color=ACCENT_CYAN, size=10)
    elif row_idx == 1:
        cell.set_facecolor('#064E3B') # Dark Emerald
        cell.set_text_props(weight='bold', color='#6EE7B7', size=9.5)
    else:
        cell.set_facecolor('#0F172A' if row_idx % 2 == 0 else '#1E293B')
        cell.set_text_props(color=TEXT_WHITE if col_idx != 4 else '#FCA5A5', size=9)

ax4.set_title('Production Model Selection Scorecard', fontsize=13, fontweight='bold', color=TEXT_WHITE, pad=12)

plt.tight_layout(rect=[0.02, 0.02, 0.98, 0.92])

# Output paths
output_dir_1 = r"08_Documentation\Figures"
os.makedirs(output_dir_1, exist_ok=True)
output_path_1 = os.path.join(output_dir_1, "Aqualytica_ML_Model_Performance_Comparison.png")

output_dir_2 = r"C:\Users\Asus\.gemini\antigravity\brain\facb0318-1a70-49a9-b7dc-f3227c79255c"
os.makedirs(output_dir_2, exist_ok=True)
output_path_2 = os.path.join(output_dir_2, "Aqualytica_ML_Model_Performance_Comparison.png")

plt.savefig(output_path_1, dpi=300, facecolor=BG_COLOR, edgecolor='none')
plt.savefig(output_path_2, dpi=300, facecolor=BG_COLOR, edgecolor='none')
plt.close()

print(f"Chart successfully saved to:\n1) {output_path_1}\n2) {output_path_2}")
