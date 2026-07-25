import { motion } from "framer-motion";
import { Calendar, ShieldAlert, CheckCircle2, AlertOctagon } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const LatestPredictionCard = ({ latest }) => {
  if (!latest) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <span className="text-5xl mb-4">🧪</span>
        <h4 className="text-lg font-bold text-slate-300">Awaiting Telemetry Predictions</h4>
        <p className="text-xs text-slate-500 max-w-[240px] mt-2 leading-relaxed">
          Submit the prediction form or activate the ESP32 node stream simulator to display diagnostics.
        </p>
      </div>
    );
  }

  const isPotable = latest.prediction?.toLowerCase() === "potable";
  const relativeDate = latest.predictedAt
    ? new Date(latest.predictedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Just now";

  // Parameter keys list to display inside the latest details
  const params = [
    { label: "pH Level", val: latest.ph?.toFixed(2), unit: "pH", isSafe: latest.ph >= 6.5 && latest.ph <= 8.5 },
    { label: "Turbidity", val: latest.turbidity?.toFixed(2), unit: "NTU", isSafe: latest.turbidity < 5.0 },
    { label: "TDS", val: latest.totalDissolvedSolids?.toLocaleString(), unit: "mg/L", isSafe: latest.totalDissolvedSolids < 500 },
    { label: "Conductivity", val: latest.conductivity?.toLocaleString(), unit: "µS", isSafe: latest.conductivity < 1000 }
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-full min-h-[460px] hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
            Latest Diagnostics Verdict
          </h3>
          <StatusBadge prediction={latest.prediction} />
        </div>

        {/* Large Result Box */}
        <div className={`p-6 rounded-2xl border text-center relative overflow-hidden mb-6 ${
          isPotable ? "bg-green-950/20 border-green-500/25" : "bg-red-950/20 border-red-500/25"
        }`}>
          <span className="text-6xl mb-3 block select-none">{isPotable ? "💧" : "⚠️"}</span>
          <h4 className={`text-4xl font-black tracking-wider uppercase ${isPotable ? "text-green-400" : "text-red-400"}`}>
            {latest.prediction}
          </h4>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Classification Status</p>
        </div>

        {/* Parameter values check panel inside the card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {params.map((p, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{p.label}</span>
                <p className="text-sm font-black text-slate-200 mt-0.5">{p.val} <span className="text-[9px] font-bold text-slate-500">{p.unit}</span></p>
              </div>
              {p.isSafe ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <AlertOctagon className="w-4 h-4 text-yellow-500 shrink-0 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Confidence progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider">Prediction Confidence</span>
            <span className="text-cyan-400 font-black">{latest.confidence}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${latest.confidence}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${isPotable ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>
        </div>

        {/* Footer meta info */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 border-t border-slate-800/40 pt-4">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Received: {relativeDate}
          </span>
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Model Accuracy: 95.8%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LatestPredictionCard;
