import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../../components/common/PageWrapper";
import SummaryCards from "../../components/analytics/SummaryCards";
import PotabilityPieChart from "../../components/analytics/PotabilityPieChart";
import AnomalyDistributionChart from "../../components/analytics/AnomalyDistributionChart";
import ConfidenceBarChart from "../../components/analytics/ConfidenceBarChart";
import ParameterTrendChart from "../../components/analytics/ParameterTrendChart";
import StatisticsPanel from "../../components/analytics/StatisticsPanel";
import SkeletonCard from "../../components/common/SkeletonCard";
import ErrorState from "../../components/common/ErrorState";
import ExportButton from "../../components/common/ExportButton";
import { getAllHistory } from "../../services/historyService";
import { exportToCSV, exportToPDF } from "../../utils/exportUtils";
import { Activity, PieChart, Layers } from "lucide-react";

const Analytics = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTrendView, setActiveTrendView] = useState("all"); // 'all', 'ph', 'tds', 'turbidity', 'temp', 'ec'

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllHistory();
      setHistoryData(data || []);
    } catch (err) {
      console.error("Failed to load analytics details", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnalyticsData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAnalyticsData]);

  // Framer Motion staggered child grid animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (historyData.length === 0) return;
    const total = historyData.length;
    const potable = historyData.filter(h => h.prediction?.toLowerCase() === "potable").length;
    const notPotable = total - potable;
    const anomalies = historyData.filter(h => h.isAnomaly === true).length;
    const avgConfidence = total > 0 
      ? (historyData.reduce((acc, h) => acc + (h.confidence || 0), 0) / total).toFixed(1)
      : 0;

    const headers = ["Analytics Parameter", "Result Metric"];
    const rows = [
      ["Total Samples Logged", total],
      ["Potable Sample Detections", potable],
      ["Contaminated Sample Detections", notPotable],
      ["Detected Hardware/Sensor Anomalies", anomalies],
      ["Average Classification Confidence", `${avgConfidence}%`],
      ["Percent Potability Rate", `${total > 0 ? ((potable / total) * 100).toFixed(1) : 0}%`]
    ];
    exportToCSV(headers, rows, `Aqualytica_Analytics_Summary_${new Date().toISOString().split("T")[0]}.csv`);
  };

  // PDF Exporter
  const handleExportPDF = () => {
    if (historyData.length === 0) return;
    const total = historyData.length;
    const potable = historyData.filter(h => h.prediction?.toLowerCase() === "potable").length;
    const notPotable = total - potable;
    const anomalies = historyData.filter(h => h.isAnomaly === true).length;
    const avgConfidence = total > 0 
      ? (historyData.reduce((acc, h) => acc + (h.confidence || 0), 0) / total).toFixed(1)
      : 0;

    const headers = ["Statistical Parameter", "Evaluation Value / Score"];
    const rows = [
      ["Total Data Samples Scanned", total],
      ["Potable Safe Detections", potable],
      ["Non-Potable Contaminated Samples", notPotable],
      ["Hardware & Telemetry Anomalies", anomalies],
      ["Mean Inference Confidence Score", `${avgConfidence}%`],
      ["Percent Potability Success Rate", `${total > 0 ? ((potable / total) * 100).toFixed(1) : 0}%`]
    ];
    exportToPDF(
      "Aqualytica Operations Analytics Certificate",
      "Overview of Environmental Analytical Run Data Logs",
      headers,
      rows
    );
  };

  if (error) {
    return (
      <PageWrapper>
        <ErrorState onRetry={fetchAnalyticsData} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header and Exporter panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Water Quality Analytics Dashboard</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
            Statistical Intelligence, Physicochemical Trends & Classification Distributions
          </p>
        </div>
        {!loading && (
          <ExportButton
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            label="Export Analytics"
          />
        )}
      </div>

      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkeletonCard className="h-[340px]" />
            <SkeletonCard className="h-[340px]" />
            <SkeletonCard className="h-[340px]" />
            <SkeletonCard className="h-[340px]" />
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Top numerical metrics grid */}
          <motion.div variants={cardVariants}>
            <SummaryCards history={historyData} />
          </motion.div>

          {/* Section: Distribution Analytics (Charts 6 & 7) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Distribution & Classification Intelligence
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Chart 6: Potability Distribution */}
              <motion.div variants={cardVariants}>
                <PotabilityPieChart history={historyData} />
              </motion.div>

              {/* Chart 7: Anomaly Distribution */}
              <motion.div variants={cardVariants}>
                <AnomalyDistributionChart history={historyData} />
              </motion.div>
            </div>
          </div>

          {/* Section: Physicochemical Parameter Trends (Charts 1, 2, 3, 4, 5) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Real Telemetry Parameter Trends
                </h2>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl p-1 text-xs">
                {[
                  { id: "all", label: "All Parameters" },
                  { id: "ph", label: "pH" },
                  { id: "tds", label: "TDS" },
                  { id: "turbidity", label: "Turbidity" },
                  { id: "temp", label: "Temp" },
                  { id: "ec", label: "Est. EC" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTrendView(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTrendView === tab.id
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {/* Chart 1: pH Trend with safe reference lines (6.5 & 8.5) and out-of-range highlighting */}
              {(activeTrendView === "all" || activeTrendView === "ph") && (
                <motion.div variants={cardVariants} className={activeTrendView === "ph" ? "lg:col-span-2" : ""}>
                  <ParameterTrendChart
                    title="pH Level Trend"
                    subtitle="Acidity vs Alkalinity (Safe Band: 6.5 - 8.5 pH)"
                    parameterKey="ph"
                    unit="pH"
                    lineColor="#38bdf8"
                    referenceLines={[
                      { y: 6.5, label: "Min Safe (6.5)", color: "#10b981", position: "insideBottomLeft" },
                      { y: 8.5, label: "Max Safe (8.5)", color: "#ef4444", position: "insideTopLeft" }
                    ]}
                    isOutOfRange={(val) => val < 6.5 || val > 8.5}
                    history={historyData}
                  />
                </motion.div>
              )}

              {/* Chart 2: TDS Trend with 500 ppm guideline line */}
              {(activeTrendView === "all" || activeTrendView === "tds") && (
                <motion.div variants={cardVariants} className={activeTrendView === "tds" ? "lg:col-span-2" : ""}>
                  <ParameterTrendChart
                    title="Total Dissolved Solids (TDS)"
                    subtitle="Dissolved Mineral Density (WHO Desirable Limit: 500 mg/L)"
                    parameterKey="totalDissolvedSolids"
                    unit="mg/L"
                    lineColor="#a855f7"
                    referenceLines={[
                      { y: 500, label: "WHO Guideline (500 ppm)", color: "#10b981", position: "insideBottomLeft" },
                      { y: 1000, label: "Max Permissible (1000 ppm)", color: "#ef4444", position: "insideTopLeft" }
                    ]}
                    isOutOfRange={(val) => val > 1000}
                    history={historyData}
                  />
                </motion.div>
              )}

              {/* Chart 3: Turbidity Trend with 1.0 & 5.0 NTU threshold lines */}
              {(activeTrendView === "all" || activeTrendView === "turbidity") && (
                <motion.div variants={cardVariants} className={activeTrendView === "turbidity" ? "lg:col-span-2" : ""}>
                  <ParameterTrendChart
                    title="Turbidity Trend"
                    subtitle="Water Clarity & Suspended Particulate Concentration"
                    parameterKey="turbidity"
                    unit="NTU"
                    lineColor="#f59e0b"
                    referenceLines={[
                      { y: 1.0, label: "Ideal Target (<1.0 NTU)", color: "#10b981", position: "insideBottomLeft" },
                      { y: 5.0, label: "Max Safe Threshold (5.0 NTU)", color: "#ef4444", position: "insideTopLeft" }
                    ]}
                    isOutOfRange={(val) => val > 5.0}
                    history={historyData}
                  />
                </motion.div>
              )}

              {/* Chart 4: Temperature Trend (°C) */}
              {(activeTrendView === "all" || activeTrendView === "temp") && (
                <motion.div variants={cardVariants} className={activeTrendView === "temp" ? "lg:col-span-2" : ""}>
                  <ParameterTrendChart
                    title="Water Temperature Trend"
                    subtitle="Thermal State Measured by DS18B20 Digital Sensor"
                    parameterKey="temperature"
                    unit="°C"
                    lineColor="#ec4899"
                    referenceLines={[
                      { y: 25.0, label: "Standard Baseline (25.0°C)", color: "#94a3b8", position: "insideBottomLeft" }
                    ]}
                    history={historyData}
                  />
                </motion.div>
              )}

              {/* Chart 5: Estimated Conductivity Trend explicitly labeled EC = TDS x 2.0 µS/cm */}
              {(activeTrendView === "all" || activeTrendView === "ec") && (
                <motion.div variants={cardVariants} className={activeTrendView === "ec" ? "lg:col-span-2" : ""}>
                  <ParameterTrendChart
                    title="Estimated Electrical Conductivity"
                    subtitle="Calculated Ionic Dissolution"
                    parameterKey="conductivity"
                    unit="µS/cm"
                    lineColor="#06b6d4"
                    badgeText="EC = TDS × 2.0 µS/cm"
                    referenceLines={[
                      { y: 1000, label: "Standard Guideline (1000 µS/cm)", color: "#f59e0b", position: "insideTopLeft" }
                    ]}
                    isOutOfRange={(val) => val > 1000}
                    history={historyData}
                  />
                </motion.div>
              )}

              {/* Model Confidence Spread Bar Chart */}
              {(activeTrendView === "all") && (
                <motion.div variants={cardVariants}>
                  <ConfidenceBarChart history={historyData} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Informational insights grid panel */}
          <motion.div variants={cardVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Statistical Summary & Parametric Bounds
              </h2>
            </div>
            <StatisticsPanel history={historyData} />
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default Analytics;
