/**
 * Utility functions for exporting data to CSV and PDF (via browser print interface)
 */

/**
 * Exports JSON-like tabular data to a CSV file.
 * @param {Array<string>} headers Column headers
 * @param {Array<Array<any>>} rows Rows of data
 * @param {string} filename Output file name
 */
export const exportToCSV = (headers, rows, filename = "export.csv") => {
  if (!rows || rows.length === 0) return;

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((row) => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formats and prints a professional analytical/history report.
 * @param {string} reportTitle Report Title
 * @param {string} subtitle Report Subtitle / Meta Information
 * @param {Array<string>} tableHeaders Column headers for the table
 * @param {Array<Array<any>>} tableRows Table data rows
 */
export const exportToPDF = (reportTitle, subtitle, tableHeaders, tableRows) => {
  const printWindow = window.open("", "_blank");
  const dateStr = new Date().toLocaleString();

  printWindow.document.write(`
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.5; margin: 40px; }
          .header { border-bottom: 2px solid #0891b2; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { margin: 0; font-size: 22px; color: #0891b2; text-transform: uppercase; letter-spacing: 0.5px; }
          .header p { margin: 5px 0 0 0; color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; }
          .meta-info { display: flex; justify-content: space-between; font-size: 11px; color: #475569; margin-bottom: 25px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .meta-info span { font-weight: bold; }
          .results-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .results-table th, .results-table td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 11px; }
          .results-table th { background-color: #f1f5f9; font-weight: bold; color: #334155; text-transform: uppercase; font-size: 10px; }
          .results-table tr:nth-child(even) { background-color: #f8fafc; }
          .footer { text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportTitle}</h1>
          <p>${subtitle}</p>
        </div>
        
        <div class="meta-info">
          <div>Report Generated: <span>${dateStr}</span></div>
          <div>Security Clearance: <span>Authorized Analyst</span></div>
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
        </div>

        <div class="footer">
          Aqualytica Operations Hub &bull; Automated Environmental Classification System
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
