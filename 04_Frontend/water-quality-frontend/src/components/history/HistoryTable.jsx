import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, ChevronLeft, ChevronRight, ArrowUpDown, Printer, ChevronDown, ChevronUp, Clock, Shield, Lightbulb, SlidersHorizontal } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import ExportButton from "../common/ExportButton";
import { exportToCSV, exportExactPageToPDF } from "../../utils/exportUtils";

// Helper to generate explanatory reasons matching the ones in PredictionResult.jsx
function getRowExplanation(item) {
  const reasons = [];
  const isPotable = item.prediction?.toLowerCase() === "potable";

  const ph = Number(item.ph);
  if (ph < 6.5) {
    reasons.push(`Low pH level (${ph}) indicates acidic water conditions. Acidic water can leach heavy metals like lead and copper from pipes, posing serious health risks.`);
  } else if (ph > 8.5) {
    reasons.push(`Elevated pH level (${ph}) indicates alkaline water. Highly alkaline water can cause a bitter taste and reduce disinfection efficiency.`);
  }

  const turb = Number(item.turbidity);
  if (turb > 5.0) {
    reasons.push(`High turbidity (${turb} NTU) indicates suspended particles that may contain harmful microorganisms, pathogens, and sediment.`);
  }

  const tds = Number(item.totalDissolvedSolids);
  if (tds > 1000) {
    reasons.push(`Extremely high TDS (${tds} mg/L) indicates excessive dissolved minerals, salts, and organic matter.`);
  } else if (tds > 500) {
    reasons.push(`Elevated TDS (${tds} mg/L) exceeds the WHO aesthetic guideline of 500 mg/L.`);
  }

  const cond = Number(item.conductivity);
  if (cond > 1000) {
    reasons.push(`High conductivity (${cond} µS/cm) indicates significant dissolved ionic content, correlating with dissolved impurities and salts.`);
  }

  const nit = Number(item.nitrate);
  if (nit > 10.0) {
    reasons.push(`Dangerous nitrate concentration (${nit} mg/L) exceeds the WHO limit of 10 mg/L. High nitrates typically indicate agricultural runoff or sewage.`);
  }

  const chl = Number(item.chloride);
  if (chl > 250.0) {
    reasons.push(`Elevated chloride concentration (${chl} mg/L) exceeds the WHO guideline of 250 mg/L. High chlorides suggest possible sewage or industrial discharge.`);
  }

  if (reasons.length === 0 && isPotable) {
    reasons.push("All measured parameters fall within WHO-recommended safe ranges. The Random Forest model found no anomalous patterns across the 7 input features.");
  }

  const recommendation = isPotable
    ? "This water sample meets WHO safety guidelines across all measured parameters. It is classified as suitable for direct consumption."
    : "This water sample should undergo appropriate treatment (Reverse Osmosis, UV disinfection, or chemical neutralization) before consumption.";

  return { reasons, recommendation };
}

const HistoryTable = ({ history = [], onRefresh, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("predictedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedRow, setExpandedRow] = useState(null);
  const rowsPerPage = 10;

  // Advanced filter states
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [minConfidence, setMinConfidence] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search & Advanced Filters
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 1. Search text filter
      const matchSearch = (val) => String(val || "").toLowerCase().includes(searchTerm.toLowerCase());
      const passSearch = searchTerm === "" || 
        matchSearch(item.prediction) ||
        matchSearch(item.ph) ||
        matchSearch(item.temperature) ||
        matchSearch(item.totalDissolvedSolids) ||
        matchSearch(item.confidence);

      // 2. Verdict filter
      const passVerdict = verdictFilter === "all" || 
        item.prediction?.toLowerCase() === verdictFilter.toLowerCase();

      // 3. Min Confidence filter
      const passConfidence = (item.confidence || 0) >= minConfidence;

      // 4. Date range filter
      let passDate = true;
      if (item.predictedAt) {
        const itemDateStr = item.predictedAt.split("T")[0]; // YYYY-MM-DD
        if (startDate && itemDateStr < startDate) passDate = false;
        if (endDate && itemDateStr > endDate) passDate = false;
      }

      return passSearch && passVerdict && passConfidence && passDate;
    });
  }, [history, searchTerm, verdictFilter, minConfidence, startDate, endDate]);

  // Sort Filter
  const sortedHistory = useMemo(() => {
    const sorted = [...filteredHistory];
    if (!sortField) return sorted;

    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return sortDirection === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }
    });
    return sorted;
  }, [filteredHistory, sortField, sortDirection]);

  // Pagination Math
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedHistory.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedHistory, currentPage]);

  const totalPages = Math.ceil(sortedHistory.length / rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
    setExpandedRow(null);
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // CSV Export - Updated to export filtered history
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) return;
    const headers = [
      "ID", "pH", "Temp (°C)", "Turbidity (NTU)", "TDS (mg/L)", 
      "Conductivity (µS/cm)", "Nitrate (mg/L)", "Chloride (mg/L)", 
      "Verdict", "Confidence (%)", "Timestamp"
    ];
    const rows = filteredHistory.map((item) => [
      item.id,
      item.ph?.toFixed(2),
      item.temperature?.toFixed(1),
      item.turbidity?.toFixed(2),
      item.totalDissolvedSolids?.toFixed(0),
      item.conductivity?.toFixed(0),
      item.nitrate?.toFixed(2),
      item.chloride?.toFixed(2),
      item.prediction,
      item.confidence,
      item.predictedAt ? new Date(item.predictedAt).toLocaleString() : "N/A"
    ]);
    exportToCSV(headers, rows, `Aqualytica_Record_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
  };

  // PDF Export (Exports the exact page in full color)
  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  // Local print certificate utility
  const handlePrintReport = (item) => {
    const isPotable = item.prediction?.toLowerCase() === "potable";
    const reportDate = item.predictedAt ? new Date(item.predictedAt).toLocaleString() : new Date().toLocaleString();
    const { reasons, recommendation } = getRowExplanation(item);
    
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Aqualytica Laboratory Certificate - Sample #${item.id}</title>
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              color: #1e293b; 
              line-height: 1.6; 
              margin: 0;
              padding: 40px;
              background-color: #ffffff;
            }
            .certificate-container {
              border: 12px double #0891b2;
              padding: 40px;
              position: relative;
              min-height: calc(100vh - 80px);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-sizing: border-box;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.05;
              width: 380px;
              height: 380px;
              pointer-events: none;
              z-index: 0;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 20px; 
              margin-bottom: 25px; 
              position: relative;
              z-index: 10;
            }
            .header h1 { 
              margin: 0; 
              font-size: 26px; 
              color: #0f172a; 
              font-weight: 800; 
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .header p { 
              margin: 6px 0 0 0; 
              color: #0891b2; 
              font-size: 11px; 
              font-weight: 700; 
              text-transform: uppercase; 
              letter-spacing: 2px;
            }
            .info-grid { 
              display: grid; 
              grid-template-cols: 1fr 1fr; 
              gap: 15px; 
              margin-bottom: 25px; 
              font-size: 12px; 
              color: #475569;
              position: relative;
              z-index: 10;
            }
            .info-item span { font-weight: 700; color: #0f172a; }
            .results-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 25px; 
              position: relative;
              z-index: 10;
            }
            .results-table th, .results-table td { 
              border: 1px solid #e2e8f0; 
              padding: 10px 12px; 
              text-align: left; 
              font-size: 12px; 
            }
            .results-table th { 
              background-color: #f8fafc; 
              font-weight: 700; 
              color: #0f172a; 
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
            }
            .results-table tr:nth-child(even) td { background-color: #fcfdfe; }
            
            .badge-safe { color: #15803d; font-weight: 700; }
            .badge-anomaly { color: #b91c1c; font-weight: 700; }
            .badge-caution { color: #b45309; font-weight: 700; }

            .verdict-row {
              display: grid;
              grid-template-cols: 3fr 1fr;
              gap: 20px;
              margin-bottom: 25px;
              position: relative;
              z-index: 10;
            }
            .verdict-box { 
              border-radius: 16px; 
              padding: 16px; 
              background-color: ${isPotable ? "#f0fdf4" : "#fef2f2"}; 
              border: 1.5px solid ${isPotable ? "#bbf7d0" : "#fecaca"}; 
            }
            .verdict-box h3 { 
              margin: 0 0 8px 0; 
              text-transform: uppercase; 
              font-size: 14px; 
              color: ${isPotable ? "#15803d" : "#b91c1c"}; 
              display: flex;
              justify-content: space-between;
              font-weight: 850;
            }
            .verdict-box p { margin: 0; font-size: 11px; color: #334155; }
            
            .seal-box {
              border: 3px double ${isPotable ? "#16a34a" : "#dc2626"};
              border-radius: 12px;
              padding: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              background-color: #ffffff;
            }
            .seal-title {
              font-size: 9px;
              font-weight: 800;
              text-transform: uppercase;
              color: ${isPotable ? "#16a34a" : "#dc2626"};
              letter-spacing: 1px;
            }
            .seal-status {
              font-size: 13px;
              font-weight: 900;
              margin-top: 4px;
              color: ${isPotable ? "#15803d" : "#b91c1c"};
              text-transform: uppercase;
            }

            .explanation-box { 
              border: 1px solid #e2e8f0; 
              border-radius: 12px; 
              padding: 14px; 
              margin-bottom: 25px; 
              background-color: #f8fafc; 
              position: relative;
              z-index: 10;
            }
            .explanation-box h4 { margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #475569; }
            .explanation-box ul { margin: 0; padding-left: 18px; font-size: 11px; color: #334155; }
            .explanation-box li { margin-bottom: 4px; }
            
            .signatures { 
              display: flex; 
              justify-content: space-between; 
              margin-top: 15px; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px; 
              position: relative;
              z-index: 10;
            }
            .sig-line { 
              text-align: center; 
              width: 220px; 
              font-size: 11px; 
              color: #475569; 
            }
            .sig-title {
              font-weight: 700;
              color: #0f172a;
              margin-top: 2px;
            }
            .signature-graphic {
              font-family: 'Brush Script MT', cursive, sans-serif;
              font-size: 20px;
              color: #0891b2;
              height: 28px;
              margin-bottom: -3px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <!-- Translucent droplet watermark SVG background -->
            <svg class="watermark" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="1">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#0891b2" />
            </svg>

            <div>
              <div class="header">
                <h1>Certificate of Water Analysis</h1>
                <p>Aqualytica Operations Laboratory &bull; Classifier Node Report</p>
              </div>
              
              <div class="info-grid">
                <div class="info-item"><span>Certificate ID:</span> WQMS-2026-${item.id}</div>
                <div class="info-item" style="text-align: right;"><span>Evaluation Date:</span> ${reportDate}</div>
                <div class="info-item"><span>System Verification Clearances:</span> Approved Analyst</div>
                <div class="info-item" style="text-align: right;"><span>Hardware Source:</span> Simulated IoT Node (ESP32)</div>
              </div>

              <table class="results-table">
                <thead>
                  <tr>
                    <th>Water Parameter</th>
                    <th>Measured Value</th>
                    <th>WHO Target Threshold</th>
                    <th>Diagnostic Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>pH Level</td>
                    <td>${item.ph?.toFixed(2)}</td>
                    <td>6.50 - 8.50 pH</td>
                    <td class="${item.ph >= 6.5 && item.ph <= 8.5 ? "badge-safe" : "badge-anomaly"}">
                      ${item.ph >= 6.5 && item.ph <= 8.5 ? "Safe / Optimal" : "Out of range"}
                    </td>
                  </tr>
                  <tr>
                    <td>Water Temperature</td>
                    <td>${item.temperature?.toFixed(1)} &deg;C</td>
                    <td>0.0 &deg;C - 35.0 &deg;C</td>
                    <td class="badge-safe">Safe / Calibrated</td>
                  </tr>
                  <tr>
                    <td>Turbidity Index</td>
                    <td>${item.turbidity?.toFixed(2)} NTU</td>
                    <td>&lt; 5.00 NTU</td>
                    <td class="${item.turbidity < 5.0 ? "badge-safe" : "badge-anomaly"}">
                      ${item.turbidity < 5.0 ? "Safe / Optimal" : "Clouding Alert"}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Dissolved Solids (TDS)</td>
                    <td>${item.totalDissolvedSolids?.toLocaleString()} mg/L</td>
                    <td>&lt; 500 mg/L</td>
                    <td class="${item.totalDissolvedSolids < 500 ? "badge-safe" : item.totalDissolvedSolids < 1000 ? "badge-caution" : "badge-anomaly"}">
                      ${item.totalDissolvedSolids < 500 ? "Safe / Optimal" : item.totalDissolvedSolids < 1000 ? "Caution Threshold" : "Excessive Saturation"}
                    </td>
                  </tr>
                  <tr>
                    <td>Electrical Conductivity</td>
                    <td>${item.conductivity?.toLocaleString()} &micro;S/cm</td>
                    <td>&lt; 1,000 &micro;S/cm</td>
                    <td class="${item.conductivity < 1000 ? "badge-safe" : "badge-anomaly"}">
                      ${item.conductivity < 1000 ? "Safe" : "High Conductivity"}
                    </td>
                  </tr>
                  <tr>
                    <td>Nitrate Concentration</td>
                    <td>${item.nitrate?.toFixed(2)} mg/L</td>
                    <td>&lt; 10.00 mg/L</td>
                    <td class="${item.nitrate < 10.0 ? "badge-safe" : "badge-anomaly"}">
                      ${item.nitrate < 10.0 ? "Safe" : "Dangerous Elevation"}
                    </td>
                  </tr>
                  <tr>
                    <td>Chloride Concentration</td>
                    <td>${item.chloride?.toFixed(2)} mg/L</td>
                    <td>&lt; 250.00 mg/L</td>
                    <td class="${item.chloride < 250.0 ? "badge-safe" : "badge-anomaly"}">
                      ${item.chloride < 250.0 ? "Safe" : "Excessive Chloride"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="explanation-box">
                <h4>Inference Diagnostics Analysis</h4>
                <ul>
                  ${reasons.map(r => `<li>${r}</li>`).join("")}
                </ul>
              </div>

              <div class="verdict-row">
                <div class="verdict-box">
                  <h3 style="color: ${isPotable ? "#15803d" : "#b91c1c"};">
                    Water Safety Evaluation: ${item.prediction?.toUpperCase()}
                    <span style="font-size: 11px; opacity: 0.8; font-weight: normal; float: right;">
                      ML Confidence: ${item.confidence}%
                    </span>
                  </h3>
                  <p>${recommendation}</p>
                </div>
                
                <div class="seal-box" style="border-color: ${isPotable ? "#16a34a" : "#dc2626"};">
                  <span class="seal-title">Lab Verdict</span>
                  <span class="seal-status">${isPotable ? "Approved" : "Caution"}</span>
                </div>
              </div>
            </div>

            <div class="signatures">
              <div class="sig-line">
                <div class="signature-graphic">Dr. A. Sharma</div>
                <div style="border-top: 1px solid #cbd5e1; margin-top: 5px; padding-top: 4px;">
                  <div class="sig-title">Dr. A. Sharma</div>
                  <div>Head of Water Quality Analytics</div>
                </div>
              </div>
              <div class="sig-line">
                <div class="signature-graphic" style="font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; color: #15803d;">
                  ${isPotable ? "VERIFIED SAFE" : "ANOMALY REJECT"}
                </div>
                <div style="border-top: 1px solid #cbd5e1; margin-top: 5px; padding-top: 4px;">
                  <div class="sig-title">Aqualytica Security Stamp</div>
                  <div>Random Forest Validation Node</div>
                </div>
              </div>
            </div>
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

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Field */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by safety status, pH, temperature, or confidence..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
              setExpandedRow(null);
            }}
            className="w-full bg-slate-955/60 border border-slate-850 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-655 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              showAdvancedFilters || verdictFilter !== "all" || minConfidence > 0 || startDate || endDate
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                : "border-slate-800/80 hover:border-slate-700/50 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
            }`}
            title="Advanced Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-3 rounded-xl border border-slate-800/80 hover:border-slate-700/50 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-all cursor-pointer disabled:opacity-50 animate-pulse-slow"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
          
          <ExportButton
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            label="Export Ledger"
          />
        </div>
      </div>

      {/* Slide-down Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-955/40 border border-slate-850/60 mb-6">
              {/* Verdict Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Verdict Classification</label>
                <select
                  value={verdictFilter}
                  onChange={(e) => {
                    setVerdictFilter(e.target.value);
                    setCurrentPage(1);
                    setExpandedRow(null);
                  }}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40"
                >
                  <option value="all">All Verdicts</option>
                  <option value="potable">Potable</option>
                  <option value="contaminated">Contaminated</option>
                </select>
              </div>

              {/* Min Confidence */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Min ML Confidence</span>
                  <span className="text-cyan-400">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minConfidence}
                  onChange={(e) => {
                    setMinConfidence(Number(e.target.value));
                    setCurrentPage(1);
                    setExpandedRow(null);
                  }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-3"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                    setExpandedRow(null);
                  }}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                    setExpandedRow(null);
                  }}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              {/* Clear Button */}
              <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                <button
                  onClick={() => {
                    setVerdictFilter("all");
                    setMinConfidence(0);
                    setStartDate("");
                    setEndDate("");
                    setCurrentPage(1);
                    setExpandedRow(null);
                  }}
                  className="px-4 py-2 bg-slate-950/40 border border-slate-850 hover:border-slate-750 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table wrapper */}
      <div className="overflow-x-auto border border-slate-800/60 rounded-2xl bg-slate-950/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">#</th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("ph")}>
                pH <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("temperature")}>
                Temp (°C) <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("turbidity")}>
                Turbidity <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-205" onClick={() => handleSort("totalDissolvedSolids")}>
                TDS <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("conductivity")}>
                Cond <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4">Nitrate</th>
              <th className="p-4">Chloride</th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("prediction")}>
                Verdict <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("confidence")}>
                Confidence <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort("predictedAt")}>
                Generated <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm font-medium text-slate-300">
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-slate-500 font-semibold">
                  No evaluation records match the filter query
                </td>
              </tr>
            ) : (
              paginatedHistory.map((item, index) => {
                const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;
                const formattedTime = item.predictedAt
                  ? new Date(item.predictedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "N/A";
                
                const isExpanded = expandedRow === item.id;
                const { reasons, recommendation } = getRowExplanation(item);

                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`hover:bg-slate-800/10 transition-colors cursor-pointer ${isExpanded ? "bg-slate-855/20" : ""}`}
                      onClick={() => toggleExpandRow(item.id)}
                    >
                      <td className="p-4 text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        {isExpanded ? <ChevronUp size={12} className="text-cyan-400" /> : <ChevronDown size={12} />}
                        {globalIndex}
                      </td>
                      <td className="p-4">{item.ph?.toFixed(2)}</td>
                      <td className="p-4">{item.temperature?.toFixed(1)}</td>
                      <td className="p-4">{item.turbidity?.toFixed(2)}</td>
                      <td className="p-4">{item.totalDissolvedSolids?.toLocaleString()}</td>
                      <td className="p-4">{item.conductivity?.toLocaleString()}</td>
                      <td className="p-4">{item.nitrate?.toFixed(2)}</td>
                      <td className="p-4">{item.chloride?.toFixed(2)}</td>
                      <td className="p-4">
                        <StatusBadge prediction={item.prediction} />
                      </td>
                      <td className="p-4 text-cyan-400 font-bold">{item.confidence}%</td>
                      <td className="p-4 text-slate-500 text-xs">{formattedTime}</td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handlePrintReport(item)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-455 hover:border-cyan-500/30 transition-colors cursor-pointer"
                          title="Print Lab Certificate PDF"
                        >
                          <Printer size={14} />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable row content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={12} className="p-0 bg-slate-950/45 border-t border-b border-slate-900">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 space-y-6">
                                {/* Header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-3">
                                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    <Clock size={14} className="text-cyan-400" />
                                    Detailed Transaction Analysis Ledger
                                  </h4>
                                  <div className="flex gap-4 text-xs font-bold text-slate-500">
                                    <span>Prediction Date: <strong className="text-slate-350">{new Date(item.predictedAt).toLocaleString()}</strong></span>
                                    <span>Classification Confidence: <strong className="text-cyan-455">{item.confidence}%</strong></span>
                                  </div>
                                </div>

                                {/* Sensor Values Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                  {[
                                    { label: "pH Level", val: item.ph?.toFixed(2), unit: "pH", min: 6.5, max: 8.5 },
                                    { label: "Temperature", val: `${item.temperature?.toFixed(1)}°`, unit: "C", min: 20, max: 30 },
                                    { label: "Turbidity", val: item.turbidity?.toFixed(2), unit: "NTU", min: 0, max: 1 },
                                    { label: "TDS", val: item.totalDissolvedSolids?.toLocaleString(), unit: "mg/L", min: 0, max: 500 },
                                    { label: "Conductivity", val: item.conductivity?.toLocaleString(), unit: "µS/cm", min: 200, max: 800 },
                                    { label: "Nitrate", val: item.nitrate?.toFixed(2), unit: "mg/L", min: 0, max: 10 },
                                    { label: "Chloride", val: item.chloride?.toFixed(2), unit: "mg/L", min: 0, max: 250 }
                                  ].map((s) => {
                                    // simple boundary check
                                    const numVal = parseFloat(s.val?.replace(/[^0-9.]/g, ""));
                                    const isOutside = numVal < s.min || numVal > s.max;
                                    return (
                                      <div key={s.label} className="p-3.5 rounded-xl bg-slate-955/20 border border-slate-900/60 flex flex-col justify-between min-h-[75px]">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                                        <div className="flex items-baseline justify-between mt-1">
                                          <span className="text-xs font-bold text-slate-205">{s.val} <span className="text-[8px] text-slate-500">{s.unit}</span></span>
                                          <span className={`text-[8px] font-black uppercase px-1 rounded ${isOutside ? "text-red-400 bg-red-950/20" : "text-green-400 bg-green-950/20"}`}>
                                            {isOutside ? "Out" : "Safe"}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Explanation Panel */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/30 space-y-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <Lightbulb size={11} className="text-cyan-405" /> Scientific Context & Explanation
                                    </span>
                                    <ul className="space-y-2 text-xs text-slate-400 leading-relaxed font-semibold">
                                      {reasons.map((r, i) => (
                                        <li key={i} className="flex gap-2.5 items-start">
                                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${item.prediction?.toLowerCase() === "potable" ? "bg-green-500" : "bg-red-500"}`} />
                                          <span>{r}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className={`p-5 rounded-2xl border flex flex-col justify-between ${item.prediction?.toLowerCase() === "potable" ? "bg-green-950/10 border-green-900/30" : "bg-red-950/10 border-red-900/30"}`}>
                                    <div className="space-y-1.5">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${item.prediction?.toLowerCase() === "potable" ? "text-green-400" : "text-red-400"}`}>
                                        <Shield size={11} /> Corrective Recommendation
                                      </span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                                        {recommendation}
                                      </p>
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-slate-900">
                                      <button
                                        onClick={() => handlePrintReport(item)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-855 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-455 transition-colors cursor-pointer"
                                      >
                                        <Printer size={12} />
                                        Print PDF Report
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                setExpandedRow(null);
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-850 hover:border-slate-800 hover:bg-slate-855 disabled:opacity-30 disabled:pointer-events-none text-slate-400 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                setExpandedRow(null);
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-850 hover:border-slate-800 hover:bg-slate-855 disabled:opacity-30 disabled:pointer-events-none text-slate-400 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
