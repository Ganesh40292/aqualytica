import os
import pandas as pd
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

pdf_filename = '08_Documentation/Tables/Aqualytica_ML_Algorithm_Comparison_Report.pdf'
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=landscape(letter),
    rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
)

styles = getSampleStyleSheet()

PRIMARY_COLOR = colors.HexColor('#0F172A') # Dark Slate Navy
ACCENT_BLUE   = colors.HexColor('#0284C7') # Cyber Cyan Blue
HEADER_BG     = colors.HexColor('#1E293B') # Dark Table Header
ROW_EVEN      = colors.HexColor('#F8FAFC')
ROW_ODD       = colors.HexColor('#EDF2F7')
GREEN_HIGHLIGHT = colors.HexColor('#DCFCE7')
GREEN_TEXT    = colors.HexColor('#15803D')
RED_TEXT      = colors.HexColor('#B91C1C')

title_style = ParagraphStyle(
    'TitleStyle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=20,
    leading=24,
    textColor=PRIMARY_COLOR,
    alignment=0
)

subtitle_style = ParagraphStyle(
    'SubTitleStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#475569')
)

cell_header_style = ParagraphStyle(
    'CellHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=12,
    textColor=colors.white,
    alignment=1
)

cell_body_style = ParagraphStyle(
    'CellBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#0F172A')
)

cell_body_bold = ParagraphStyle(
    'CellBodyBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#0F172A')
)

cell_approved = ParagraphStyle(
    'CellApproved',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=12,
    textColor=GREEN_TEXT
)

cell_rejected = ParagraphStyle(
    'CellRejected',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    textColor=RED_TEXT
)

section_heading = ParagraphStyle(
    'SecHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=PRIMARY_COLOR
)

story = []

# Title & Subtitle
story.append(Paragraph('Aqualytica — AI Water Quality Intelligence Platform', title_style))
story.append(Spacer(1, 4))
story.append(Paragraph('<b>Machine Learning Model Selection & Comparative Evaluation Matrix</b> | Project Defence & Evaluation Review Copy', subtitle_style))
story.append(Spacer(1, 10))
story.append(HRFlowable(width='100%', thickness=2, color=ACCENT_BLUE, spaceAfter=15))

# Data table rows
table_data = [
    [
        Paragraph('Model Candidate', cell_header_style),
        Paragraph('Accuracy (%)', cell_header_style),
        Paragraph('Precision (%)', cell_header_style),
        Paragraph('Recall (%)', cell_header_style),
        Paragraph('F1-Score', cell_header_style),
        Paragraph('ROC-AUC', cell_header_style),
        Paragraph('Latency (ms)', cell_header_style),
        Paragraph('Selection Status & Tradeoff Rationale', cell_header_style)
    ],
    [
        Paragraph('<b>Random Forest (Selected)</b>', cell_body_bold),
        Paragraph('<b>85.80%</b>', cell_body_bold),
        Paragraph('<b>93.11%</b>', cell_body_bold),
        Paragraph('<b>88.17%</b>', cell_body_bold),
        Paragraph('<b>0.906</b>', cell_body_bold),
        Paragraph('<b>0.836</b>', cell_body_bold),
        Paragraph('<b>0.03 ms</b>', cell_body_bold),
        Paragraph('APPROVED — Best accuracy & F1 score; high precision avoids false safety verdicts', cell_approved)
    ],
    [
        Paragraph('Decision Tree (CART)', cell_body_style),
        Paragraph('84.70%', cell_body_style),
        Paragraph('90.27%', cell_body_style),
        Paragraph('89.92%', cell_body_style),
        Paragraph('0.901', cell_body_style),
        Paragraph('0.748', cell_body_style),
        Paragraph('< 0.01 ms', cell_body_style),
        Paragraph('Rejected — High tendency to overfit on marginal sensor voltage fluctuations', cell_rejected)
    ],
    [
        Paragraph('Support Vector Classifier (SVC)', cell_body_style),
        Paragraph('81.55%', cell_body_style),
        Paragraph('84.69%', cell_body_style),
        Paragraph('92.95%', cell_body_style),
        Paragraph('0.886', cell_body_style),
        Paragraph('0.823', cell_body_style),
        Paragraph('0.19 ms', cell_body_style),
        Paragraph('Rejected — High computational latency during real-time IoT inference', cell_rejected)
    ],
    [
        Paragraph('Gaussian Naive Bayes', cell_body_style),
        Paragraph('81.15%', cell_body_style),
        Paragraph('83.51%', cell_body_style),
        Paragraph('94.25%', cell_body_style),
        Paragraph('0.886', cell_body_style),
        Paragraph('0.823', cell_body_style),
        Paragraph('< 0.01 ms', cell_body_style),
        Paragraph('Rejected — Assumes feature independence; fails for correlated pH and TDS metrics', cell_rejected)
    ],
    [
        Paragraph('K-Nearest Neighbors (KNN)', cell_body_style),
        Paragraph('80.75%', cell_body_style),
        Paragraph('83.24%', cell_body_style),
        Paragraph('94.05%', cell_body_style),
        Paragraph('0.883', cell_body_style),
        Paragraph('0.755', cell_body_style),
        Paragraph('0.04 ms', cell_body_style),
        Paragraph('Rejected — High memory footprint during continuous background streaming', cell_rejected)
    ],
    [
        Paragraph('Logistic Regression', cell_body_style),
        Paragraph('78.80%', cell_body_style),
        Paragraph('79.76%', cell_body_style),
        Paragraph('97.29%', cell_body_style),
        Paragraph('0.877', cell_body_style),
        Paragraph('0.712', cell_body_style),
        Paragraph('< 0.01 ms', cell_body_style),
        Paragraph('Rejected — Underfitting due to non-linear physical water parameter boundaries', cell_rejected)
    ]
]

# Column widths totaling 720pt (10 inches landscape)
col_widths = [135, 65, 65, 65, 55, 55, 65, 215]

t = Table(table_data, colWidths=col_widths, repeatRows=1)
t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HEADER_BG),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#94A3B8')),
    ('BACKGROUND', (0, 1), (-1, 1), GREEN_HIGHLIGHT),
    ('BACKGROUND', (0, 2), (-1, 2), ROW_EVEN),
    ('BACKGROUND', (0, 3), (-1, 3), ROW_ODD),
    ('BACKGROUND', (0, 4), (-1, 4), ROW_EVEN),
    ('BACKGROUND', (0, 5), (-1, 5), ROW_ODD),
    ('BACKGROUND', (0, 6), (-1, 6), ROW_EVEN),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))

story.append(t)
story.append(Spacer(1, 15))

# Explanatory Notes & Signatures
story.append(Paragraph('Key Technical Defense Highlights:', section_heading))
story.append(Spacer(1, 4))
notes_text = (
    "• <b>Random Forest Ensemble Superiority:</b> Selected as the primary inference engine due to its top-rank Accuracy (85.80%), F1-Score (0.906), and high Precision (93.11%). High precision ensures hazardous water is rarely misclassified as safe.<br/>"
    "• <b>Class Imbalance Mitigation:</b> Trained using <code>class_weight=\"balanced\"</code> and hyperparameter tuned via <code>RandomizedSearchCV</code> (150 decision trees, max depth = 15) to prevent majority class prediction bias.<br/>"
    "• <b>Feature Scaling Alignment:</b> Sensor inputs are normalized via <code>StandardScaler</code> prior to inference, matching deployment in the Python Flask microservice."
)
story.append(Paragraph(notes_text, subtitle_style))

story.append(Spacer(1, 25))

# Signature block for evaluators
sig_data = [
    [
        Paragraph('<b>Project Guide / Supervisor:</b> _______________________', subtitle_style),
        Paragraph('<b>External Evaluator Panel:</b> _______________________', subtitle_style),
        Paragraph('<b>Date:</b> August 5, 2026', subtitle_style)
    ]
]
sig_table = Table(sig_data, colWidths=[270, 270, 180])
sig_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
]))
story.append(sig_table)

doc.build(story)
print(f'PDF successfully generated: {pdf_filename}')
