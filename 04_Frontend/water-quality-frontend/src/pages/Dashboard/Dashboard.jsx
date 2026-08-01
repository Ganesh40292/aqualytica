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
} from "lucide-react";

import { getDashboardStatistics } from "../../services/dashboardService";
import { getRecentHistory } from "../../services/historyService";
import { useSupabaseRealtime } from "../../hooks/useSupabaseRealtime";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalPredictions: 0,
    potableCount: 0,
    notPotableCount: 0,
    averageConfidence: 0,
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  // Subscribe to instant Supabase Realtime updates
  useSupabaseRealtime(loadData);

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
    <PageWrapper className="space-y-12 pb-24">
      {/* Welcome Hero Section with Export capabilities */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <DashboardHero />
        </div>
        {!loading && (
          <div className="shrink-0 flex items-center md:self-end mb-6">
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
          {/* Primary KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <DashboardCard
              title="Total Predictions"
              value={dashboard.totalPredictions}
              color="text-cyan-400"
              icon={<Database size={24} />}
            />

            <DashboardCard
              title="Potable Water"
              value={dashboard.potableCount}
              color="text-green-400"
              icon={<Droplets size={24} />}
            />

            <DashboardCard
              title="Not Potable"
              value={dashboard.notPotableCount}
              color="text-red-400"
              icon={<AlertTriangle size={24} />}
            />

            <DashboardCard
              title="Average Confidence"
              value={dashboard.averageConfidence}
              suffix="%"
              color="text-yellow-400"
              icon={<Activity size={24} />}
            />
          </div>

          {/* Latest Telemetry Parameters Grid and WQS Gauge Split */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest">Latest Water Telemetry</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Left Wave Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Col 1: Analytics Subsystem (Stacked Charts) */}
            <div className="grid grid-cols-1 gap-10 h-full">
              <MiniPieChart statistics={dashboard} />
              <ConfidenceGauge value={dashboard.averageConfidence} />
            </div>

            {/* Col 2: Transmission logs feed */}
            <div className="h-full">
              <RecentActivity history={recentHistory} />
            </div>
          </div>

          {/* Live Chronological Prediction Timeline (Feature 10) */}
          <div className="border-t border-slate-855/40 pt-10 mt-6">
            <PredictionTimeline history={recentHistory} />
          </div>
        </>
      )}
    </PageWrapper>
  );
}

export default Dashboard;