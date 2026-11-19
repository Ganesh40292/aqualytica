import { useState, useEffect, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import BisIntroSection from "../../components/bis/BisIntroSection";
import BisTimelineFlowchart from "../../components/bis/BisTimelineFlowchart";
import BisInteractiveTable from "../../components/bis/BisInteractiveTable";
import BisConclusionSection from "../../components/bis/BisConclusionSection";

import { getRecentHistory } from "../../services/historyService";
import { getEsp32Status } from "../../services/esp32Service";
import { useSupabaseRealtime } from "../../hooks/useSupabaseRealtime";
import { getLatestRecord } from "../../utils/bisComparisonUtils";
import { ShieldCheck, RefreshCw } from "lucide-react";

/**
 * Clean, Spacious, and Scrollable BIS Water Quality Standards Page
 * Route: /bis-standards
 *
 * Structured into 5 clear sections:
 * 1) "BIS WATER QUALITY STANDARDS" heading in center aligned of the page
 * 2) Small introduction to BIS standards
 * 3) Flowcharts of years from establishment to present
 * 4) BIS VALUES TABLE OF 5 PARAMETRES with year specified at the top of table,
 *    with clearly visible dropdown option for each row
 * 5) Conclusion
 */
const BisStandards = () => {
  const [historyList, setHistoryList] = useState([]);
  const [, setEsp32Status] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch actual data from backend
  const fetchData = useCallback(async () => {
    try {
      const [historyData, statusData] = await Promise.all([
        getRecentHistory().catch(() => []),
        getEsp32Status().catch(() => null)
      ]);

      if (historyData) setHistoryList(historyData);
      if (statusData) setEsp32Status(statusData);
    } catch (err) {
      console.warn("Telemetry fetch note:", err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Supabase Realtime subscription
  useSupabaseRealtime(fetchData);

  // 5-second polling interval
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    const interval = setInterval(fetchData, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchData]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Extract latest record safely based on persistence timestamp
  const latestRecord = getLatestRecord(historyList);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner text="Loading BIS Standards Telemetry..." />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="space-y-12 sm:space-y-16 max-w-6xl mx-auto pb-16">
      {/* ═══ 1) "BIS WATER QUALITY STANDARDS" HEADING (CENTER ALIGNED) ═══ */}
      <header className="text-center max-w-4xl mx-auto space-y-4 pt-4 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.15)]">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          National Drinking Water Specification
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          BIS WATER QUALITY STANDARDS
        </h1>

        <p className="text-base sm:text-xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed">
          Indian Standard IS 10500 specifications, historical evolution, and real-time threshold limits for physical water parameters.
        </p>

        {/* Live Sync Status Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-600/30 to-teal-600/30 hover:from-cyan-600/50 hover:to-teal-600/50 text-cyan-200 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Syncing Sensors..." : "Sync Sensor Telemetry"}</span>
          </button>
          {latestRecord?.createdAt && (
            <span className="text-xs sm:text-sm text-slate-400 font-mono bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
              Last Persisted Record: {new Date(latestRecord.createdAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {/* ═══ 2) SMALL INTRODUCTION TO BIS STANDARDS ═══ */}
      <BisIntroSection />

      {/* ═══ 3) FLOWCHARTS OF YEARS FROM ESTABLISHMENT TO PRESENT ═══ */}
      <BisTimelineFlowchart />

      {/* ═══ 4) BIS VALUES TABLE OF 5 PARAMETERS (WITH DROPDOWNS & YEAR AT TOP) ═══ */}
      <BisInteractiveTable latestRecord={latestRecord} />

      {/* ═══ 5) CONCLUSION ═══ */}
      <BisConclusionSection />
    </PageWrapper>
  );
};

export default BisStandards;
