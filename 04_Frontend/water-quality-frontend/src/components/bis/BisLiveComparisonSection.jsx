import { Radio, Clock, CheckCircle2, AlertTriangle, AlertOctagon, Info, Cpu } from "lucide-react";
import BisOverallAssessmentCard from "./BisOverallAssessmentCard";
import { formatAcquisitionTimestamp } from "../../utils/bisComparisonUtils";
import { BIS_PARAMETERS } from "../../constants/bisStandardsConfig";

/**
 * Compact Linear Gauge for Live Readings
 */
const SimpleGauge = ({ paramKey, value }) => {
  if (value === null || value === undefined || isNaN(value)) {
    return <div className="h-2 w-full bg-slate-800 rounded-full" />;
  }

  const num = Number(value);

  if (paramKey === "ph") {
    const clamped = Math.max(4.0, Math.min(10.0, num));
    const percent = ((clamped - 4.0) / (10.0 - 4.0)) * 100;

    return (
      <div className="space-y-1.5 pt-1">
        <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div style={{ width: "41.67%" }} className="h-full bg-red-500/60" title="< 6.5 (Breach)" />
          <div style={{ width: "33.33%" }} className="h-full bg-emerald-500" title="6.5 - 8.5 (Acceptable)" />
          <div style={{ width: "25%" }} className="h-full bg-red-500/60" title="> 8.5 (Breach)" />
        </div>
        <div className="relative h-2 w-full">
          <div
            className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 border border-slate-900 shadow-[0_0_8px_#22d3ee]"
            style={{ left: `${Math.max(3, Math.min(97, percent))}%` }}
          />
        </div>
      </div>
    );
  }

  if (paramKey === "turbidity") {
    const clamped = Math.max(0, Math.min(8.0, num));
    const percent = (clamped / 8.0) * 100;

    return (
      <div className="space-y-1.5 pt-1">
        <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div style={{ width: "12.5%" }} className="h-full bg-emerald-500" title="≤ 1.0 (Acceptable)" />
          <div style={{ width: "50%" }} className="h-full bg-amber-400" title="1.0 - 5.0 (Permissible)" />
          <div style={{ width: "37.5%" }} className="h-full bg-red-500/70" title="> 5.0 (Breach)" />
        </div>
        <div className="relative h-2 w-full">
          <div
            className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 border border-slate-900 shadow-[0_0_8px_#22d3ee]"
            style={{ left: `${Math.max(3, Math.min(97, percent))}%` }}
          />
        </div>
      </div>
    );
  }

  if (paramKey === "totalDissolvedSolids") {
    const clamped = Math.max(0, Math.min(2500, num));
    const percent = (clamped / 2500) * 100;

    return (
      <div className="space-y-1.5 pt-1">
        <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div style={{ width: "20%" }} className="h-full bg-emerald-500" title="≤ 500 (Acceptable)" />
          <div style={{ width: "60%" }} className="h-full bg-amber-400" title="500 - 2000 (Permissible)" />
          <div style={{ width: "20%" }} className="h-full bg-red-500/70" title="> 2000 (Breach)" />
        </div>
        <div className="relative h-2 w-full">
          <div
            className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 border border-slate-900 shadow-[0_0_8px_#22d3ee]"
            style={{ left: `${Math.max(3, Math.min(97, percent))}%` }}
          />
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Concise Live Parameter Comparison Section
 * Dark glassmorphic cards showing live telemetry vs BIS limits.
 */
const BisLiveComparisonSection = ({
  latestRecord,
  evaluations,
  overallAssessment,
  esp32Status,
  onRefresh
}) => {
  const isStale = (esp32Status?.lastSeenSecondsAgo || 0) > 30;

  const getStatusBadge = (level, label) => {
    switch (level) {
      case "success":
        return {
          cls: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
          text: label || "Within Acceptable Limit"
        };
      case "warning":
        return {
          cls: "bg-amber-950/60 text-amber-300 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
          text: label || "Within Permissible Limit"
        };
      case "danger":
        return {
          cls: "bg-red-950/60 text-red-300 border-red-800/60 shadow-[0_0_10px_rgba(239,68,68,0.15)]",
          icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />,
          text: label || "Exceeds Specified Limit"
        };
      default:
        return {
          cls: "bg-slate-900/60 text-slate-300 border-slate-700/60",
          icon: <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />,
          text: label || "Informational Metric"
        };
    }
  };

  const cards = [
    {
      config: BIS_PARAMETERS.ph,
      eval: evaluations?.ph,
      pin: "GPIO 34",
      accent: "border-t-4 border-t-cyan-500",
      accentTag: "bg-cyan-950/60 text-cyan-400 border-cyan-800/60",
      targetText: "6.5 – 8.5",
      permissibleText: "No relaxation (at 25°C)"
    },
    {
      config: BIS_PARAMETERS.turbidity,
      eval: evaluations?.turbidity,
      pin: "GPIO 35",
      accent: "border-t-4 border-t-teal-500",
      accentTag: "bg-teal-950/60 text-teal-400 border-teal-800/60",
      targetText: "Max 1.0 NTU",
      permissibleText: "Max 5.0 NTU (no alt source)"
    },
    {
      config: BIS_PARAMETERS.totalDissolvedSolids,
      eval: evaluations?.tds,
      pin: "GPIO 32",
      accent: "border-t-4 border-t-blue-500",
      accentTag: "bg-blue-950/60 text-blue-400 border-blue-800/60",
      targetText: "Max 500 mg/L",
      permissibleText: "Max 2000 mg/L (no alt source)"
    },
    {
      config: BIS_PARAMETERS.temperature,
      eval: evaluations?.temperature,
      pin: "GPIO 4",
      accent: "border-t-4 border-t-rose-500",
      accentTag: "bg-rose-950/60 text-rose-400 border-rose-800/60",
      targetText: "No numerical limit",
      permissibleText: "Ambient measurement"
    },
    {
      config: BIS_PARAMETERS.conductivity,
      eval: evaluations?.ec,
      pin: "TDS × 2.0",
      accent: "border-t-4 border-t-emerald-500",
      accentTag: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
      targetText: "No numerical limit",
      permissibleText: "Estimated from TDS"
    }
  ];

  return (
    <section className="space-y-6">
      {/* Telemetry Header Row */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            LIVE SENSOR READINGS VS BIS LIMITS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Physical ESP32 telemetry compared against BIS IS 10500:2012 specifications.
          </p>
        </div>

        {/* Live Device Status */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <Radio className={`w-3.5 h-3.5 ${esp32Status?.connected ? "text-emerald-400 animate-pulse" : "text-amber-400"}`} />
            <span className="text-slate-200 font-bold">
              {esp32Status?.connected ? "ESP32 Online" : "Hardware Standby"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatAcquisitionTimestamp(latestRecord)}</span>
          </div>
        </div>
      </div>

      {/* Inactivity Warning if Stale */}
      {isStale && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg">
          <span>
            <strong>Telemetry Standby:</strong> Showing the latest persisted reading from Supabase PostgreSQL.
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1 bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 rounded-lg text-amber-200 font-bold text-xs cursor-pointer"
            >
              Refresh
            </button>
          )}
        </div>
      )}

      {/* Overall Assessment Banner */}
      <BisOverallAssessmentCard assessment={overallAssessment} />

      {/* 5 Parameter Cards (Full-Width Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const val = c.eval?.value;
          const status = getStatusBadge(c.eval?.level, c.eval?.label);

          return (
            <div
              key={c.config.id}
              className={`bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 ${c.accent} rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md border ${c.accentTag}`}>
                  {c.pin}
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  IS 10500:2012
                </span>
              </div>

              {/* Title & Reading */}
              <div>
                <h3 className="text-base font-black text-white">{c.config.name}</h3>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {val !== null && val !== undefined ? val : "—"}
                  </span>
                  <span className="text-sm font-bold text-slate-400 font-mono">{c.config.unit}</span>
                </div>
              </div>

              {/* Status Pill */}
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${status.cls}`}>
                {status.icon}
                <span className="truncate">{status.text}</span>
              </div>

              {/* Gauge */}
              <SimpleGauge paramKey={c.config.id} value={val} />

              {/* Reference Benchmarks */}
              <div className="pt-3 border-t border-slate-800/80 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Acceptable:</span>
                  <span className="font-bold text-white font-mono">{c.targetText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Permissible:</span>
                  <span className="font-bold text-white font-mono">{c.permissibleText}</span>
                </div>
              </div>

              {/* Hardware pin note */}
              <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.config.sensingMethod}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BisLiveComparisonSection;