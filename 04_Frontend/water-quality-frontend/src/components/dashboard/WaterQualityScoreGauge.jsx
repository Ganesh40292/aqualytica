import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";

const WaterQualityScoreGauge = ({ ph = 7.2, turbidity = 0.8, tds = 180, temp = 25.0 }) => {
  // 1. Calculate individual parameter scores (0 - 100)
  const phScore = Math.max(0, 100 - Math.abs(ph - 7.0) * 20); // Peak at 7.0
  const turbScore = Math.max(0, 100 - turbidity * 18); // Optimal at 0 NTU
  const tdsScore = tds <= 150 ? 100 : Math.max(0, 100 - (tds - 150) * 0.22); // Optimal <= 150 mg/L
  const tempScore = temp >= 20 && temp <= 25 ? 100 : Math.max(0, 100 - Math.abs(temp - 22.5) * 8);

  // 2. Weighted average Water Quality Score (WQS)
  const rawScore = phScore * 0.3 + turbScore * 0.35 + tdsScore * 0.25 + tempScore * 0.1;
  const wqs = Math.round(Math.min(100, Math.max(0, rawScore)));

  // 3. Determine status classification
  let statusText = "Extremely Good";
  let statusColor = "text-emerald-450";
  let ringColor = "#10b981"; // Emerald

  if (wqs < 50) {
    statusText = "Hazardous";
    statusColor = "text-red-500 animate-pulse";
    ringColor = "#ef4444";
  } else if (wqs < 75) {
    statusText = "Acceptable";
    statusColor = "text-amber-500";
    ringColor = "#f59e0b";
  } else if (wqs < 90) {
    statusText = "Good Quality";
    statusColor = "text-cyan-400";
    ringColor = "#06b6d4";
  }

  // 4. Circle SVG Parameters
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (wqs / 100) * circumference;

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[354px] hover:border-cyan-500/20 transition-all duration-300 relative group overflow-hidden">
      {/* Design accents */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
      
      <div className="w-full text-center">
        <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Water Purity Index</h3>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Composite Health Index</p>
      </div>

      {/* Radial Progress SVG */}
      <div className="relative w-40 h-40 flex items-center justify-center mt-3 select-none">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
          <defs>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Base Background Ring */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Glow Ring */}
          <motion.circle
            cx="75"
            cy="75"
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: "url(#gauge-glow)" }}
          />
        </svg>

        {/* Floating WQS Text Inside */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-slate-100 tracking-tight leading-none"
          >
            {wqs}%
          </motion.span>
          <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Parameter Breakdown Checklist */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        {/* pH check */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-955/40 border border-slate-850 justify-start">
          {phScore >= 80 ? (
            <div className="w-4 h-4 rounded-full bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-amber-950/30 border border-amber-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
            </div>
          )}
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider truncate">pH level</span>
        </div>

        {/* Turbidity check */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-955/40 border border-slate-850 justify-start">
          {turbScore >= 80 ? (
            <div className="w-4 h-4 rounded-full bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-amber-950/30 border border-amber-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
            </div>
          )}
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider truncate">Turbidity</span>
        </div>

        {/* TDS check */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-955/40 border border-slate-850 justify-start">
          {tdsScore >= 80 ? (
            <div className="w-4 h-4 rounded-full bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-amber-950/30 border border-amber-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
            </div>
          )}
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider truncate">TDS Index</span>
        </div>

        {/* Temp check */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-955/40 border border-slate-850 justify-start">
          {tempScore >= 80 ? (
            <div className="w-4 h-4 rounded-full bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-amber-950/30 border border-amber-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
            </div>
          )}
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider truncate">Temperature</span>
        </div>
      </div>
    </div>
  );
};

export default WaterQualityScoreGauge;
