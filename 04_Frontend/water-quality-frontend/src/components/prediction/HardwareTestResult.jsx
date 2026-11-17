import { motion } from "framer-motion";
import {
  Cpu,
  Radio,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Thermometer,
  Droplets,
  Layers,
  Zap,
  Clock,
  RotateCcw,
  X,
  Server,
  Gauge
} from "lucide-react";

/**
 * Dedicated presentation component for displaying real-time physical IoT hardware telemetry
 * and Machine Learning potability classification acquired from the ESP32 node.
 */
function HardwareTestResult({ result, onClear, onRetest, isRetesting }) {
  if (!result) return null;

  const isPotable = result.prediction?.toLowerCase() === "potable";
  const hasHardwareFault = !!result.isHardwareFault || result.temperatureValid === false;
  const hasAnomaly = !!result.isAnomaly;

  // Determine overall status tone
  const statusTheme = hasHardwareFault
    ? {
        border: "border-amber-500/40",
        shadow: "shadow-[0_0_35px_rgba(245,158,11,0.15)]",
        badgeBg: "bg-amber-950/40 border-amber-600/50 text-amber-300",
        label: "HARDWARE PROBE FAULT",
        sublabel: "Sensor reading rejected to safeguard Machine Learning classification",
      }
    : hasAnomaly
    ? {
        border: "border-rose-500/40",
        shadow: "shadow-[0_0_35px_rgba(244,63,94,0.15)]",
        badgeBg: "bg-rose-950/40 border-rose-600/50 text-rose-300",
        label: "ANOMALOUS SAMPLE",
        sublabel: "Physical readings breach environmental plausibility bounds",
      }
    : isPotable
    ? {
        border: "border-emerald-500/30",
        shadow: "shadow-[0_0_35px_rgba(16,185,129,0.15)]",
        badgeBg: "bg-emerald-950/40 border-emerald-600/50 text-emerald-300",
        label: "POTABLE DRINKING WATER",
        sublabel: "Physical readings meet WHO standards and Random Forest classification",
      }
    : {
        border: "border-rose-500/30",
        shadow: "shadow-[0_0_35px_rgba(239,68,68,0.15)]",
        badgeBg: "bg-rose-950/40 border-rose-600/50 text-rose-300",
        label: "NOT POTABLE / CONTAMINATED",
        sublabel: "Water sample requires purification before safe consumption",
      };

  const formattedTimestamp = result.timestamp
    ? new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
      " • " +
      new Date(result.timestamp).toLocaleDateString()
    : new Date().toLocaleTimeString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`mt-8 rounded-3xl p-6 md:p-8 bg-slate-900/30 backdrop-blur-3xl border ${statusTheme.border} ${statusTheme.shadow} relative overflow-hidden`}
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/5 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar: IoT Telemetry Indicator and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                IoT Physical Node Telemetry
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/60 border border-cyan-800/50 text-cyan-300">
                ESP32 DevKit V1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Acquired via Mosquitto MQTT: <span className="font-semibold text-slate-300">{formattedTimestamp}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onRetest && (
            <button
              type="button"
              onClick={onRetest}
              disabled={isRetesting}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              title="Trigger a new hardware reading"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetesting ? "animate-spin text-cyan-400" : ""}`} />
              <span>{isRetesting ? "Acquiring..." : "Retest Hardware"}</span>
            </button>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Close hardware reading"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hardware Fault Warning Banner */}
      {hasHardwareFault && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Hardware Sensor Probe Fault Detected
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {result.hardwareFaultReason ||
                "DS18B20 Temperature Sensor probe disconnected or returned an invalid reading (-127°C / 85°C)."}
            </p>
            <p className="text-[11px] text-amber-300/70 font-semibold pt-1">
              Safety Enforcement: Artificial temperature was not fabricated and ML classification was withheld to avoid model distortion.
            </p>
          </div>
        </div>
      )}

      {/* Physical Sensor Anomaly Warning Banner */}
      {hasAnomaly && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-950/30 border border-rose-600/40 text-rose-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-300">
              Physical Plausibility Anomaly Detected
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {result.anomalyReason || "Sensor reading deviates beyond plausible chemical limits."}
            </p>
          </div>
        </div>
      )}

      {/* Primary ML Verdict & Confidence Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5">
        <div className="md:col-span-2 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Random Forest Water Potability Assessment
          </span>
          <div className="flex items-center gap-3">
            {hasHardwareFault ? (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-7 h-7 text-amber-400" />
                <span className="text-2xl md:text-3xl font-black text-amber-300">
                  CLASSIFICATION WITHHELD
                </span>
              </div>
            ) : isPotable ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                <span className="text-2xl md:text-3xl font-black text-emerald-400">
                  POTABLE WATER
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-7 h-7 text-rose-400" />
                <span className="text-2xl md:text-3xl font-black text-rose-400">
                  NOT POTABLE
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {statusTheme.sublabel}
          </p>
        </div>

        {/* Model Confidence Metric */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-center items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> Prediction Confidence
          </span>
          <span className="text-2xl font-black text-slate-100 mt-1">
            {hasHardwareFault ? "0.0%" : `${Number(result.confidence || 0).toFixed(1)}%`}
          </span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                hasHardwareFault
                  ? "w-0 bg-slate-700"
                  : isPotable
                  ? "bg-emerald-400"
                  : "bg-rose-400"
              }`}
              style={{ width: `${hasHardwareFault ? 0 : Math.min(100, Math.max(0, result.confidence || 0))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Calibrated Hardware Parameters Grid */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Physical Calibrated Sensor Measurements
          </h4>
          <span className="text-[10px] font-mono text-slate-500">5-Parameter Telemetry Vector</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* pH */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-cyan-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold">pH Level</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-slate-100">
              {result.ph !== null && result.ph !== undefined ? Number(result.ph).toFixed(2) : "N/A"}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Safe: 6.5 - 8.5 pH
            </div>
          </div>

          {/* Temperature */}
          <div
            className={`p-4 rounded-xl bg-slate-950/60 border transition-all space-y-1 ${
              result.temperatureValid === false || result.temperature === null
                ? "border-amber-500/50 bg-amber-950/20"
                : "border-slate-800/70 hover:border-orange-500/30"
            }`}
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold">Temperature</span>
              <Thermometer
                className={`w-4 h-4 ${
                  result.temperatureValid === false ? "text-amber-400" : "text-orange-400"
                }`}
              />
            </div>
            <div
              className={`text-lg font-black ${
                result.temperatureValid === false ? "text-amber-400 text-sm font-bold" : "text-slate-100"
              }`}
            >
              {result.temperatureValid === false
                ? "DISCONNECTED"
                : result.temperature !== null && result.temperature !== undefined
                ? `${Number(result.temperature).toFixed(1)} °C`
                : "N/A"}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              {result.temperatureValid === false ? "Probe Error (-127°C)" : "Safe: 15.0 - 25.0 °C"}
            </div>
          </div>

          {/* Turbidity */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-teal-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold">Turbidity</span>
              <Droplets className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-lg font-black text-slate-100">
              {result.turbidity !== null && result.turbidity !== undefined
                ? `${Number(result.turbidity).toFixed(2)} NTU`
                : "N/A"}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Safe: &lt; 1.0 NTU
            </div>
          </div>

          {/* Total Dissolved Solids */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-green-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold">TDS</span>
              <Layers className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-lg font-black text-slate-100">
              {result.totalDissolvedSolids !== null && result.totalDissolvedSolids !== undefined
                ? `${Number(result.totalDissolvedSolids).toFixed(1)} ppm`
                : "N/A"}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Safe: &lt; 250 mg/L
            </div>
          </div>

          {/* Electrical Conductivity */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 hover:border-amber-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold">Conductivity</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-black text-slate-100">
              {result.conductivity !== null && result.conductivity !== undefined
                ? `${Number(result.conductivity).toFixed(1)} µS/cm`
                : "N/A"}
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              Safe: &lt; 400 µS/cm
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics and Pipeline Health Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-slate-400">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> Pipeline: ESP32 → Mosquitto MQTT → Spring Boot → Flask ML
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono text-slate-400">
            Node: AQUALYTICA_ESP32
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono text-slate-400">
            Persisted: Supabase PostgreSQL
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default HardwareTestResult;
