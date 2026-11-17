/**
 * Utility functions for exporting data to CSV and PDF (via browser print interface)
 */

/**
 * Exports JSON-like tabular data to a CSV file.
 * @param {Array<string>} headers Column headers
 * @param {Array<Array<any>>} rows Rows of data
 * @param {string} filename Output file name
 */
export const exportToCSV = (headers, rows, filename = "Aqualytica_Export.csv") => {
  if (!rows || rows.length === 0) return;

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((row) => row.map(val => `"${String(val !== null && val !== undefined ? val : "").replace(/"/g, '""')}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formats and prints a professional analytical/history report with official project branding.
 * @param {string} reportTitle Report Title
 * @param {string} subtitle Report Subtitle / Meta Information
 * @param {Array<string>} tableHeaders Column headers for the table
 * @param {Array<Array<any>>} tableRows Table data rows
 * @param {Object} summaryData Optional statistical summary { total, potable, notPotable, anomalies, avgConfidence }
 */
export const exportToPDF = (reportTitle, subtitle, tableHeaders, tableRows, summaryData = null) => {
  const printWindow = window.open("", "_blank");
  const dateStr = new Date().toLocaleString();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle} - AQUALYTICA</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            line-height: 1.5; 
            margin: 30px; 
            background: #ffffff;
          }
          .header { 
            border-bottom: 3px double #0891b2; 
            padding-bottom: 12px; 
            margin-bottom: 20px; 
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title-area h1 { 
            margin: 0; 
            font-size: 20px; 
            color: #0891b2; 
            font-weight: 800;
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
          }
          .title-area h2 {
            margin: 3px 0 0 0;
            font-size: 11px;
            color: #64748b;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .title-area p { 
            margin: 4px 0 0 0; 
            color: #475569; 
            font-size: 11px; 
          }
          .stamp-badge {
            text-align: right;
            font-size: 10px;
            font-weight: bold;
            color: #0891b2;
            border: 1px solid #0891b2;
            padding: 6px 12px;
            border-radius: 6px;
            background: #f0fdfa;
          }
          .meta-info { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            font-size: 11px; 
            color: #334155; 
            margin-bottom: 20px; 
            background: #f8fafc; 
            padding: 12px 16px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
          }
          .meta-info div span { 
            font-weight: bold; 
            color: #0f172a;
          }
          .results-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 25px; 
            font-size: 11px;
          }
          .results-table th, .results-table td { 
            border: 1px solid #cbd5e1; 
            padding: 8px 10px; 
            text-align: left; 
          }
          .results-table th { 
            background-color: #f1f5f9; 
            font-weight: bold; 
            color: #1e293b; 
            text-transform: uppercase; 
            font-size: 10px; 
            letter-spacing: 0.5px;
          }
          .results-table tr:nth-child(even) { 
            background-color: #f8fafc; 
          }
          .footer { 
            text-align: center; 
            font-size: 9px; 
            color: #94a3b8; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 12px; 
            margin-top: 30px; 
          }
          .annotation {
            font-size: 9px;
            color: #64748b;
            margin-top: 8px;
            font-style: italic;
          }
          @media print {
            body { margin: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>AQUALYTICA</h1>
            <h2>IoT Smart Water Quality Monitoring & Anomaly Detection System</h2>
            <p>${reportTitle} &mdash; ${subtitle}</p>
          </div>
          <div class="stamp-badge">
            OFFICIAL LAB REPORT<br>
            <span style="font-size: 8px; opacity: 0.8;">ML Engine: Random Forest</span>
          </div>
        </div>
        
        <div class="meta-info">
          <div>Report Generated: <span>${dateStr}</span></div>
          <div>Total Samples: <span>${summaryData?.total || tableRows.length}</span></div>
          ${summaryData?.potable !== undefined ? `<div>Potable: <span style="color:#16a34a">${summaryData.potable}</span></div>` : ""}
          ${summaryData?.notPotable !== undefined ? `<div>Non-Potable: <span style="color:#dc2626">${summaryData.notPotable}</span></div>` : ""}
          ${summaryData?.anomalies !== undefined ? `<div>Outliers/Anomalies: <span style="color:#d97706">${summaryData.anomalies}</span></div>` : ""}
          ${summaryData?.avgConfidence !== undefined ? `<div>Mean Confidence: <span>${summaryData.avgConfidence}%</span></div>` : ""}
        </div>

        <table class="results-table">
          <thead>
            <tr>
              ${tableHeaders.map(h => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRows.map(row => `
              <tr>
                ${row.map(val => `<td>${val !== null && val !== undefined ? val : "N/A"}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="annotation">
          * Electrical Conductivity (EC) is calculated dynamically via formula: EC = TDS &times; 2.0 &mu;S/cm.
        </div>

        <div class="footer">
          AQUALYTICA &bull; Final Year Major Project &bull; Department of Information Technology &bull; Automated Environmental Telemetry Ledger
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * Triggers the browser's print engine to export the exact current page in full color as a PDF.
 */
export const exportExactPageToPDF = () => {
  window.print();
};
