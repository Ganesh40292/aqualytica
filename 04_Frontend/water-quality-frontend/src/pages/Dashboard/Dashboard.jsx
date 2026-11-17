import { useEffect, useState, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import DashboardHero from "../../components/dashboard/DashboardHero";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MiniPieChart from "../../components/dashboard/MiniPieChart";
import ConfidenceGauge from "../../components/dashboard/ConfidenceGauge";
import RecentActivity from "../../components/dashboard/RecentActivity";
import PredictionTimeline from "../../components/dashboard/PredictionTimeline";
import ErrorState from "../../components/common/ErrorState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ExportButton from "../../components/common/ExportButton";
import { exportToCSV, exportExactPageToPDF } from "../../utils/exportUtils";
import LiquidWaveCard from "../../components/dashboard/LiquidWaveCard";
import WaterQualityScoreGauge from "../../components/dashboard/WaterQualityScoreGauge";

import {
  Database,
  Droplets,
  AlertTriangle,
  Activity,
  Cpu,
} from "lucide-react";

import { getDashboardStatistics } from "../../services/dashboardService";
import { getRecentHistory } from "../../services/historyService";
import { triggerHardwareTest } from "../../services/predictionService";
import { useSupabaseRealtime } from "../../hooks/useSupabaseRealtime";
import { useToast } from "../../context/ToastContext";

function Dashboard() {
  const { showSuccess, showError, showWarning } = useToast();
  const [dashboard, setDashboard] = useState({
    totalPredictions: 0,
    potableCount: 0,
    notPotableCount: 0,
    averageConfidence: 0,
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hardwareTesting, setHardwareTesting] = useState(false);

  const loadData = useCallback(async () => {
    setError(false);
    try {
      const stats = await getDashboardStatistics();
      setDashboard(stats);
      
      const history = await getRecentHistory();
      setRecentHistory(history || []);
    } catch (error) {
      console.error("Dashboard Loading Error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRealtimeTelemetry = useCallback((data) => {
    loadData();
    if (data && data.ph !== undefined) {
      showSuccess(`📡 Live Hardware Telemetry: pH ${Number(data.ph).toFixed(2)}, Temp ${Number(data.temperature).toFixed(1)}°C`);
    }
  }, [loadData, showSuccess]);

  // Subscribe to instant Supabase Realtime updates
  useSupabaseRealtime(handleRealtimeTelemetry);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    const pollingInterval = setInterval(loadData, 6000);
    return () => {
      clearTimeout(timer);
      clearInterval(pollingInterval);
    };
  }, [loadData]);

  // On-demand hardware test trigger from Dashboard
  const handleStartHardwareTest = async () => {
    if (hardwareTesting) return;
    setHardwareTesting(true);

    try {
      const response = await triggerHardwareTest();
      if (response && response.success && response.data) {
        if (response.data.isHardwareFault) {
          showWarning(response.data.hardwareFaultReason || "Hardware probe fault detected.");
        } else if (response.data.isAnomaly) {
          showWarning(`Physical anomaly detected: ${response.data.anomalyReason}`);
        } else {
          showSuccess(`Hardware reading acquired! ${response.data.prediction} (${Number(response.data.confidence || 0).toFixed(1)}% confidence)`);
        }
        await loadData();
      }
    } catch (err) {
      let errorMsg = "Hardware acquisition failed. Verify backend and ESP32 connection.";
      if (err.response?.status === 409) {
        errorMsg = err.response?.data?.message || err.response?.data?.detail || "ESP32 hardware is currently busy executing another routine.";
      } else if (err.response?.status === 504) {
        errorMsg = "Hardware timeout: ESP32 did not respond within 10 seconds. Check if device is powered on.";
      } else if (err.response?.status === 500) {
        const detail = err.response?.data?.message || err.response?.data?.detail;
        errorMsg = detail || "Hardware acquisition error occurred on ESP32/MQTT bridge. Please retry.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message && !err.message.includes("status code")) {
        errorMsg = err.message;
      }
      console.warn("Hardware test issue handled:", errorMsg);
      showError(errorMsg);
    } finally {
      setHardwareTesting(false);
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = ["Metric Parameter", "Current Value"];
    const rows = [
      ["Total Predictions", dashboard.totalPredictions],
      ["Potable Water Count", dashboard.potableCount],
      ["Not Potable Water Count", dashboard.notPotableCount],
      ["Average Confidence (%)", `${dashboard.averageConfidence}%`]
    ];
    exportToCSV(headers, rows, `Aqualytica_Dashboard_Metrics_${new Date().toISOString().split("T")[0]}.csv`);
  };

  // PDF Exporter (Exports the exact page in full color)
  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  if (error) {
    return (
      <PageWrapper>
        <DashboardHero />
        <ErrorState onRetry={loadData} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-6 sm:space-y-8">
      {/* Welcome Hero Section with Export capabilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <DashboardHero />
        </div>
        {!loading && (
          <div className="shrink-0 flex items-center self-start sm:self-auto">
            <ExportButton
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              label="Export Metrics"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 rounded-3xl border border-slate-900 animate-pulse">
          <LoadingSpinner size="w-10 h-10" />
          <span className="text-sm font-semibold text-slate-500 mt-4 uppercase tracking-widest">Synchronizing dashboard...</span>
        </div>
      ) : (
        <>
          {/* Real-time Hardware & Water Safety Alert Banners */}
          {recentHistory.length > 0 && (recentHistory[0].isAnomaly || recentHistory[0].prediction?.toLowerCase() !== "potable" || recentHistory[0].temperatureValid === false || recentHistory[0].temperature < 0) && (
            <div className="space-y-3">
              {recentHistory[0].isAnomaly && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-amber-300">Sensor Outlier / Anomaly Detected</span>
                      <span className="text-slate-300">{recentHistory[0].anomalyReason || "Physical sensor reading exceeded calibrated baseline thresholds."}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-900/60 border border-amber-700/60 text-amber-300 shrink-0">
                    ID #{recentHistory[0].id}
                  </span>
                </div>
              )}

              {recentHistory[0].prediction?.toLowerCase() !== "potable" && (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-red-300">Water Quality Hazard Warning</span>
                      <span className="text-slate-300">Latest evaluated sample is classified as <strong>Not Potable</strong> ({recentHistory[0].confidence}% ML confidence). Water requires filtration before human consumption.</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-red-900/60 border border-red-700/60 text-red-300 shrink-0">
                    NON-POTABLE
                  </span>
                </div>
              )}

              {(recentHistory[0].temperatureValid === false || recentHistory[0].temperature < 0) && (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs flex items-center gap-3 shadow-lg">
                  <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-purple-300">Hardware Probe Notice</span>
                    <span className="text-slate-300">DS18B20 digital temperature probe returned invalid reading (-127°C). Model inference automatically safeguarded against false inputs.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <DashboardCard
              title="Total Predictions"
              value={dashboard.totalPredictions}
              color="text-cyan-400"
              icon={<Database size={22} />}
            />

            <DashboardCard
              title="Potable Water"
              value={dashboard.potableCount}
              color="text-green-400"
              icon={<Droplets size={22} />}
            />

            <DashboardCard
              title="Not Potable"
              value={dashboard.notPotableCount}
              color="text-red-400"
              icon={<AlertTriangle size={22} />}
            />

            <DashboardCard
              title="Average Confidence"
              value={dashboard.averageConfidence}
              suffix="%"
              color="text-yellow-400"
              icon={<Activity size={22} />}
            />
          </div>

          {/* Latest Telemetry Parameters Grid and WQS Gauge Split */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Water Telemetry Parameters</h3>
              </div>
              <button
                type="button"
                onClick={handleStartHardwareTest}
                disabled={hardwareTesting}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 text-slate-100 text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.2)] flex items-center gap-2 disabled:opacity-50"
              >
                <Cpu className={`w-4 h-4 text-emerald-200 ${hardwareTesting ? "animate-spin" : "animate-pulse"}`} />
                <span>{hardwareTesting ? "Acquiring ESP32 Readings..." : "Start Hardware Test"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {/* Left Wave Cards Grid (5-parameters) */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                <LiquidWaveCard
                  title="pH Level"
                  value={recentHistory.length > 0 ? recentHistory[0].ph : 7.20}
                  unit="pH"
                  minVal={0}
                  maxVal={14}
                  safeMin={6.5}
                  safeMax={8.5}
                  themeColor="cyan"
                />
                <LiquidWaveCard
                  title="Turbidity"
                  value={recentHistory.length > 0 ? recentHistory[0].turbidity : 0.80}
                  unit="NTU"
                  minVal={0}
                  maxVal={10}
                  safeMin={0}
                  safeMax={5.0}
                  themeColor="teal"
                />
                <LiquidWaveCard
                  title="Total Dissolved Solids"
                  value={recentHistory.length > 0 ? recentHistory[0].totalDissolvedSolids : 180}
                  unit="mg/L"
                  minVal={0}
                  maxVal={1000}
                  safeMin={0}
                  safeMax={500}
                  themeColor="green"
                />
                <LiquidWaveCard
                  title="Water Temperature"
                  value={recentHistory.length > 0 ? (recentHistory[0].temperature || recentHistory[0].temp || 25.0) : 25.0}
                  unit="°C"
                  minVal={0}
                  maxVal={50}
                  safeMin={20}
                  safeMax={30}
                  themeColor="orange"
                />
                <LiquidWaveCard
                  title="Est. Conductivity"
                  value={recentHistory.length > 0 ? (recentHistory[0].conductivity || (recentHistory[0].totalDissolvedSolids * 2.0) || 360) : 360}
                  unit="µS/cm"
                  minVal={0}
                  maxVal={2000}
                  safeMin={0}
                  safeMax={1000}
                  themeColor="cyan"
                />
              </div>

              {/* Right WQS Progress Gauge */}
              <div className="lg:col-span-1">
                <WaterQualityScoreGauge
                  ph={recentHistory.length > 0 ? recentHistory[0].ph : 7.20}
                  turbidity={recentHistory.length > 0 ? recentHistory[0].turbidity : 0.80}
                  tds={recentHistory.length > 0 ? recentHistory[0].totalDissolvedSolids : 180}
                  temp={recentHistory.length > 0 ? (recentHistory[0].temperature || recentHistory[0].temp || 25.0) : 25.0}
                />
              </div>
            </div>
          </div>

          {/* Balanced 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch pt-2">
            {/* Col 1: Analytics Subsystem (Stacked Charts) */}
            <div className="grid grid-cols-1 gap-6 h-full">
              <MiniPieChart statistics={dashboard} />
              <ConfidenceGauge value={dashboard.averageConfidence} />
            </div>

            {/* Col 2: Transmission logs feed */}
            <div className="h-full">
              <RecentActivity history={recentHistory} />
            </div>
          </div>

          {/* Live Chronological Prediction Timeline */}
          <div className="border-t border-slate-800/60 pt-8 mt-2">
            <PredictionTimeline history={recentHistory} />
          </div>
        </>
      )}
    </PageWrapper>
  );
}

export default Dashboard;
