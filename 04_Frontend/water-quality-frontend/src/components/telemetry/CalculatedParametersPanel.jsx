import { motion } from "framer-motion";
import { Calculator, Zap, Thermometer, ShieldCheck, Cpu, CheckCircle2, XCircle } from "lucide-react";

/**
 * Scientific Calculated Parameters & Diagnostic Inspector Panel.
 * Dynamically computes derived metrics (Electrical Conductivity, Thermal Compensation, WQI Score)
 * and displays the active Random Forest classification verdict from live telemetry.
 */
function CalculatedParametersPanel({
  data = null,
  onTriggerTest,
  isTesting = false,
}) {
  const ph = data?.ph ?? 7.2;
  const temp = data?.temperature ?? 25.0;
  const turb = data?.turbidity ?? 0.8;
  const tds = data?.totalDissolvedSolids ?? 180.0;
  const ec = data?.conductivity ?? (tds * 2.0);
  const prediction = data?.prediction;
  const confidence = data?.confidence ?? 0;
  const isPotable = prediction?.toLowerCase() === "potable";

  // 1. Calculate Thermal Compensation Coefficient: f(T) = 1.0 + 0.02 * (T - 25.0)
  const tempCompensationFactor = Number(1.0 + 0.02 * (temp - 25.0)).toFixed(3);

  // 2. Multi-parametric Water Quality Index (WQI Score) calculation
  const calculateWQI = () => {
    let score = 100;
    // pH penalty (ideal 6.5 - 8.5)
    if (ph < 6.5 || ph > 8.5) {
      score -= Math.min(30, Math.abs(ph - 7.0) * 15);
    }
    // Turbidity penalty (ideal < 1.0 NTU)
    if (turb > 1.0) {
      score -= Math.min(30, (turb - 1.0) * 7);
    }
    // TDS penalty (ideal < 300 mg/L)
    if (tds > 300) {
      score -= Math.min(25, ((tds - 300) / 300) * 12);
    }
    // Temperature penalty (ideal 15 - 25 °C)
    if (temp > 25.0) {
      score -= Math.min(15, (temp - 25.0) * 1.5);
    }
    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const wqiScore = calculateWQI();
  const getWQILabel = (score) => {
    if (score >= 85) return { label: "Excellent (WHO Class A)", color: "text-emerald-400" };
    if (score >= 70) return { label: "Good (WHO Class B)", color: "text-cyan-400" };
    if (score >= 50) return { label: "Fair / Requires Filtration", color: "text-yellow-400" };
    return { label: "Poor / Unsafe for Direct Intake", color: "text-rose-400" };
  };

  const wqiInfo = getWQILabel(wqiScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-cyan-400">
              <Calculator className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Calculated Metrics & Physics</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Derived Hydrodynamic Formulas
              </p>
            </div>
          </div>
          {onTriggerTest && (
            <button
              type="button"
              onClick={onTriggerTest}
              disabled={isTesting}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              title="Acquire on-demand measurement from ESP32"
            >
              <Cpu className={`w-3.5 h-3.5 ${isTesting ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isTesting ? "Testing..." : "Test ESP32"}</span>
            </button>
          )}
        </div>

        {/* Calculated Metrics Grid */}
        <div className="space-y-3">
          {/* 1. Electrical Conductivity (EC = TDS * 2.0) */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Zap size={13} className="text-amber-400" /> Electrical Conductivity (EC)
              </span>
              <span className="text-xs font-black font-mono text-amber-300 bg-amber-950/40 border border-amber-800/30 px-2 py-0.5 rounded">
                {Number(ec).toFixed(1)} µS/cm
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Formula: EC = TDS × 2.00</span>
              <span className="text-slate-400">({Number(tds).toFixed(1)} × 2.0)</span>
            </div>
          </div>

          {/* 2. Temperature Compensation Factor */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Thermometer size={13} className="text-rose-400" /> Thermal Compensation Factor
              </span>
              <span className="text-xs font-black font-mono text-rose-300 bg-rose-950/40 border border-rose-800/30 px-2 py-0.5 rounded">
                {tempCompensationFactor}×
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>f(T) = 1.0 + 0.02×(T - 25°C)</span>
              <span className="text-slate-400">T = {Number(temp).toFixed(1)}°C</span>
            </div>
          </div>

          {/* 3. Water Quality Index (WQI Score) */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-cyan-400" /> Water Quality Index (WQI)
              </span>
              <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${wqiInfo.color} bg-slate-950 border border-slate-800`}>
                {wqiScore} / 100
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  wqiScore >= 70 ? "bg-cyan-400" : wqiScore >= 50 ? "bg-yellow-400" : "bg-rose-400"
                }`}
                style={{ width: `${wqiScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">{wqiInfo.label}</p>
          </div>

          {/* 4. Active ML Model Classification Verdict */}
          {prediction && (
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isPotable
                ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-300"
                : "bg-rose-950/20 border-rose-800/30 text-rose-300"
            }`}>
              <div className="flex items-center gap-2">
                {isPotable ? <CheckCircle2 size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-rose-400" />}
                <span className="text-xs font-black uppercase tracking-wider">{prediction}</span>
              </div>
              <span className="text-[10px] font-bold font-mono opacity-80">
                {Number(confidence).toFixed(1)}% ML Confidence
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Standard: WHO Guidelines</span>
        <span>Model: Random Forest 5-Feature</span>
      </div>
    </motion.div>
  );
}

export default CalculatedParametersPanel;
