import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../../components/common/PageWrapper";
import SummaryCards from "../../components/analytics/SummaryCards";
import PotabilityPieChart from "../../components/analytics/PotabilityPieChart";
import ConfidenceBarChart from "../../components/analytics/ConfidenceBarChart";
import PredictionTrendLineChart from "../../components/analytics/PredictionTrendLineChart";
import PredictionGrowthAreaChart from "../../components/analytics/PredictionGrowthAreaChart";
import StatisticsPanel from "../../components/analytics/StatisticsPanel";
import SkeletonCard from "../../components/common/SkeletonCard";
import ErrorState from "../../components/common/ErrorState";
import ExportButton from "../../components/common/ExportButton";
import { getAllHistory } from "../../services/historyService";
import { exportToCSV, exportToPDF } from "../../utils/exportUtils";

const Analytics = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    const avgConfidence = total > 0 
      ? (historyData.reduce((acc, h) => acc + (h.confidence || 0), 0) / total).toFixed(1)
      : 0;

    const headers = ["Analytics Parameter", "Result Metric"];
    const rows = [
      ["Total Samples Logged", total],
      ["Potable Sample Detections", potable],
      ["Contaminated Sample Detections", notPotable],
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
    const avgConfidence = total > 0 
      ? (historyData.reduce((acc, h) => acc + (h.confidence || 0), 0) / total).toFixed(1)
      : 0;

    const headers = ["Statistical Parameter", "Evaluation Value / Score"];
    const rows = [
      ["Total Data Samples Scanned", total],
      ["Potable Safe Detections", potable],
      ["Non-Potable Contaminated Anomalies", notPotable],
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
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-450 text-xs font-bold uppercase tracking-wider">
          Statistical Intelligence & Performance Run charts
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

          {/* Graphical charts grid - Animating items sequentially */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants}>
              <PotabilityPieChart history={historyData} />
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <ConfidenceBarChart history={historyData} />
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <PredictionTrendLineChart history={historyData} />
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <PredictionGrowthAreaChart history={historyData} />
            </motion.div>
          </div>

          {/* Informational insights grid panel */}
          <motion.div variants={cardVariants}>
            <StatisticsPanel history={historyData} />
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default Analytics;
