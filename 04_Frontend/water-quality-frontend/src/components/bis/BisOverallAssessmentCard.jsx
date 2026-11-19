import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Concise Overall BIS Assessment Card
 * Dark glassmorphic styling matching Aqualytica 3D animated background.
 */
const BisOverallAssessmentCard = ({ assessment }) => {
  if (!assessment) return null;

  const { title, level, violations, missingList, hasViolations, hasMissing } = assessment;

  const styles = {
    danger: {
      card: "bg-slate-900/40 backdrop-blur-2xl border border-red-500/30 border-l-4 border-l-red-500 shadow-2xl",
      headerBg: "bg-red-950/30",
      titleColor: "text-red-400",
      badge: "bg-red-950/60 text-red-400 border-red-800/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]",
      badgeText: "Parameters Exceed Limits",
      icon: ShieldAlert,
      iconColor: "text-red-400"
    },
    warning: {
      card: "bg-slate-900/40 backdrop-blur-2xl border border-amber-500/30 border-l-4 border-l-amber-500 shadow-2xl",
      headerBg: "bg-amber-950/30",
      titleColor: "text-amber-300",
      badge: "bg-amber-950/60 text-amber-400 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      badgeText: "Permissible Range",
      icon: AlertTriangle,
      iconColor: "text-amber-400"
    },
    success: {
      card: "bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/30 border-l-4 border-l-emerald-500 shadow-2xl",
      headerBg: "bg-emerald-950/30",
      titleColor: "text-emerald-300",
      badge: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
      badgeText: "Compliant",
      icon: ShieldCheck,
      iconColor: "text-emerald-400"
    },
    neutral: {
      card: "bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 border-l-4 border-l-slate-600 shadow-2xl",
      headerBg: "bg-slate-900/40",
      titleColor: "text-slate-200",
      badge: "bg-slate-900/80 text-slate-400 border-slate-700/80",
      badgeText: "Pending Telemetry",
      icon: AlertCircle,
      iconColor: "text-slate-400"
    }
  };

  const style = styles[level] || styles.neutral;
  const IconComponent = style.icon;

  return (
    <div className={`rounded-3xl border ${style.card} overflow-hidden space-y-4`}>
      {/* Header Row */}
      <div className={`p-5 sm:p-6 ${style.headerBg} border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md shrink-0">
            <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              BIS IS 10500:2012 COMPLIANCE SUMMARY
            </span>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${style.titleColor}`}>
              {title}
            </h2>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${style.badge} self-start sm:self-auto`}>
          {style.badgeText}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 space-y-4 pt-0">
        {/* Itemized Detected Parameter Breaches */}
        {hasViolations ? (
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block">
              Specific Parameter Deviations ({violations.length}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {violations.map((v, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border text-xs font-medium space-y-1.5 ${
                    v.severity === "danger"
                      ? "bg-red-950/30 border-red-800/50 text-red-200"
                      : "bg-amber-950/30 border-amber-800/50 text-amber-200"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">{v.parameter}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 border border-current font-bold uppercase">
                      {v.severity === "danger" ? "Breach" : "Permissible"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">{v.message}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !hasMissing ? (
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>All monitored parameters (pH, Turbidity, TDS) conform strictly to BIS IS 10500:2012 acceptable limits.</span>
          </div>
        ) : null}

        {/* Missing Sensor Data Notice */}
        {hasMissing && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Awaiting telemetry for:</strong> {missingList.join(", ")}. Complete assessment updates automatically when valid readings arrive.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BisOverallAssessmentCard;