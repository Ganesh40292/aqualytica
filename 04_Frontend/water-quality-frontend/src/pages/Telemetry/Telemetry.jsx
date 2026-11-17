import { useEffect, useState, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import SkeletonCard from "../../components/common/SkeletonCard";
import { getRecentHistory } from "../../services/historyService";
import { getEsp32Status } from "../../services/esp32Service";
import { triggerHardwareTest } from "../../services/predictionService";
import { useSupabaseRealtime } from "../../hooks/useSupabaseRealtime";
import { useToast } from "../../context/ToastContext";
import ESP32StatusPanel from "../../components/telemetry/ESP32StatusPanel";
import SensorHealthPanel from "../../components/telemetry/SensorHealthPanel";
import CalculatedParametersPanel from "../../components/telemetry/CalculatedParametersPanel";
import TelemetryDataStreamParticles from "../../components/telemetry/TelemetryDataStreamParticles";
import ExportButton from "../../components/common/ExportButton";
import { exportExactPageToPDF } from "../../utils/exportUtils";
import GlassmorphicTooltip from "../../components/analytics/GlassmorphicTooltip";
import {
  Radio,
  Cpu,
  Activity,
  Thermometer,
  Wind,
  Layers,
  Zap,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const Telemetry = () => {
  const { showSuccess, showError, showWarning } = useToast();
  const [historyData, setHistoryData] = useState([]);
  const [esp32Status, setEsp32Status] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const fetchTelemetry = useCallback(async () => {
    try {
      const [data, status] = await Promise.all([
        getRecentHistory(),
        getEsp32Status().catch(() => null),
      ]);

      // Ensure every record has calculated conductivity populated (EC = TDS * 2.0)
      const sanitized = (data || []).map((item) => ({
        ...item,
        conductivity:
          item.conductivity !== null && item.conductivity !== undefined
            ? item.conductivity
            : item.totalDissolvedSolids
            ? Number((item.totalDissolvedSolids * 2.0).toFixed(2))
            : 0,
      }));

      // Reverse array to show chronological trend left-to-right
      setHistoryData(sanitized.slice().reverse());
      if (status) {
        setEsp32Status(status);
      }
      setSecondsAgo(0);
    } catch (err) {
      console.warn("Failed to load telemetry data:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to instant Supabase Realtime change-data-capture updates
  useSupabaseRealtime(fetchTelemetry);

  // Live seconds heartbeat ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Background polling every 5 seconds for telemetry refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTelemetry();
    }, 0);
    const interval = setInterval(fetchTelemetry, 5000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchTelemetry]);

  // On-demand hardware test trigger
  const handleTriggerHardwareTest = async () => {
    if (isTesting) return;
    setIsTesting(true);

    try {
      const response = await triggerHardwareTest();
      if (response && response.success && response.data) {
        if (response.data.isHardwareFault) {
          showWarning(response.data.hardwareFaultReason || "Hardware probe fault detected.");
        } else if (response.data.isAnomaly) {
          showWarning(`Physical anomaly detected: ${response.data.anomalyReason}`);
        } else {
          showSuccess(
            `Live Telemetry Acquired: pH ${Number(response.data.ph).toFixed(2)}, TDS ${Number(response.data.totalDissolvedSolids).toFixed(1)} ppm, EC ${Number(response.data.conductivity).toFixed(1)} µS/cm (${response.data.prediction})`
          );
        }
        await fetchTelemetry();
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
      }
      console.warn("Hardware test issue handled:", errorMsg);
      showError(errorMsg);
    } finally {
      setIsTesting(false);
    }
  };

  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  const recentData = historyData.length > 0 ? historyData[historyData.length - 1] : null;

  // Active status representation
  const activeESP32Data = esp32Status || (recentData ? {
    connected: secondsAgo < 35,
    connectionStatus: secondsAgo < 35 ? "Connected" : "Standby / Offline",
    lastUpdate: recentData.predictedAt ? new Date(recentData.predictedAt).toLocaleTimeString() : "Awaiting data",
    samplingInterval: "10 seconds",
    signalStrength: secondsAgo < 35 ? -52 : -92,
    firmwareVersion: "Aqualytica v3.2.1",
    ipAddress: "10.39.71.112",
    macAddress: "AQUALYTICA_ESP32",
  } : null);

  // Helper function to build custom area graphs for each parameter
  const renderParamChart = (title, dataKey, color, unit, domain, formula = null) => {
    const latestVal = recentData && recentData[dataKey] !== null && recentData[dataKey] !== undefined
      ? Number(recentData[dataKey]).toFixed(2)
      : "N/A";

    return (
      <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300 min-h-[270px]">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{title}</h4>
              {formula && (
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{formula}</p>
              )}
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${color.badge}`}>
              {latestVal} {unit}
            </span>
          </div>
        </div>

        <div className="h-[150px] w-full mt-3">
          {historyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-bold">
              Awaiting node telemetry stream...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color.hex} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color.hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="predictedAt"
                  tickFormatter={(val) =>
                    val ? new Date(val).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : ""
                  }
                  stroke="#475569"
                  fontSize={8}
                  tickLine={false}
                />
                <YAxis stroke="#475569" fontSize={8} domain={domain} tickLine={false} />
                <Tooltip content={<GlassmorphicTooltip unit={unit} />} />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color.hex}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${dataKey})`}
                  isAnimationActive={true}
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  };

  const chartConfigs = [
    {
      title: "pH Level Concentration",
      key: "ph",
      color: { hex: "#06b6d4", badge: "bg-cyan-950/40 border border-cyan-800/40 text-cyan-400" },
      unit: "pH",
      domain: [4, 10],
      formula: "pH = (0.01994284 × ADC) - 20.59731",
    },
    {
      title: "Water Temperature",
      key: "temperature",
      color: { hex: "#f43f5e", badge: "bg-rose-950/40 border border-rose-800/40 text-rose-400" },
      unit: "°C",
      domain: [10, 45],
      formula: "DS18B20 OneWire 12-bit Celsius",
    },
    {
      title: "Turbidity Optical Index",
      key: "turbidity",
      color: { hex: "#14b8a6", badge: "bg-teal-950/40 border border-teal-800/40 text-teal-400" },
      unit: "NTU",
      domain: [0, 10],
      formula: "41-sample trimmed mean (16-point filter)",
    },
    {
      title: "Total Dissolved Solids (TDS)",
      key: "totalDissolvedSolids",
      color: { hex: "#3b82f6", badge: "bg-blue-950/40 border border-blue-800/40 text-blue-400" },
      unit: "ppm",
      domain: [0, 1000],
      formula: "30-sample cubic polynomial with thermal comp",
    },
    {
      title: "Electrical Conductivity (EC)",
      key: "conductivity",
      color: { hex: "#10b981", badge: "bg-emerald-950/40 border border-emerald-800/40 text-emerald-400" },
      unit: "µS/cm",
      domain: [0, 2000],
      formula: "Calculated: EC = TDS × 2.0 (EPA multiplier)",
    },
  ];

  return (
    <PageWrapper className="space-y-8">
      {/* Dynamic Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            Node Telemetry Operations Panel
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time physical sensor acquisition and derived metric stream from ESP32 DevKit V1
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          {/* On-Demand Hardware Trigger */}
          <button
            type="button"
            onClick={handleTriggerHardwareTest}
            disabled={isTesting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 text-slate-100 text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.2)] flex items-center gap-2 disabled:opacity-50"
            title="Trigger real-time acquisition from ESP32"
          >
            <Cpu className={`w-4 h-4 text-emerald-200 ${isTesting ? "animate-spin" : "animate-pulse"}`} />
            <span>{isTesting ? "Acquiring..." : "Trigger Live Read"}</span>
          </button>

          {/* Node Heartbeat Indicator */}
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-sm relative overflow-hidden ${
              activeESP32Data?.connected
                ? "bg-slate-900/60 border-slate-800 text-slate-300"
                : "bg-amber-950/20 border-amber-800/40 text-amber-300"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <span className={`w-2 h-2 rounded-full ${activeESP32Data?.connected ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" : "bg-amber-400"}`} />
            <span className="truncate">{activeESP32Data?.connected ? "STREAM ACTIVE" : "STANDBY"}</span>
            <span className="text-slate-500 font-medium text-[11px]">| {secondsAgo === 0 ? "Just now" : `${secondsAgo}s ago`}</span>
          </div>

          <ExportButton onExportPDF={handleExportPDF} label="Export Page" />
        </div>
      </div>

      {/* 5-Parameter Live Telemetry Hero Strip */}
      {recentData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* pH */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">pH Level</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {recentData.ph !== null && recentData.ph !== undefined ? Number(recentData.ph).toFixed(2) : "N/A"}
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Standard: 6.5–8.5</span>
              <span className={recentData.ph >= 6.5 && recentData.ph <= 8.5 ? "text-green-400" : "text-amber-400"}>
                {recentData.ph >= 6.5 && recentData.ph <= 8.5 ? "Normal" : "Alert"}
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-rose-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">Temperature</span>
              <Thermometer className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {recentData.temperature !== null && recentData.temperature !== undefined
                ? `${Number(recentData.temperature).toFixed(1)}°C`
                : "N/A"}
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Ideal: 15–25°C</span>
              <span className="text-slate-400">DS18B20 OneWire</span>
            </div>
          </div>

          {/* Turbidity */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-teal-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">Turbidity</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {recentData.turbidity !== null && recentData.turbidity !== undefined
                ? `${Number(recentData.turbidity).toFixed(2)}`
                : "N/A"}{" "}
              <span className="text-xs text-slate-400">NTU</span>
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Safe: &lt; 1.0 NTU</span>
              <span className={recentData.turbidity <= 1.0 ? "text-green-400" : "text-amber-400"}>
                {recentData.turbidity <= 1.0 ? "Pristine" : "Cloudy"}
              </span>
            </div>
          </div>

          {/* TDS */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-blue-500/30 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold">Dissolved Solids</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {recentData.totalDissolvedSolids !== null && recentData.totalDissolvedSolids !== undefined
                ? Number(recentData.totalDissolvedSolids).toFixed(1)
                : "N/A"}{" "}
              <span className="text-xs text-slate-400">ppm</span>
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Safe: &lt; 300 ppm</span>
              <span className={recentData.totalDissolvedSolids <= 300 ? "text-green-400" : "text-amber-400"}>
                {recentData.totalDissolvedSolids <= 300 ? "Optimal" : "Elevated"}
              </span>
            </div>
          </div>

          {/* Conductivity (Calculated) */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold text-emerald-300">Conductivity</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {recentData.conductivity !== null && recentData.conductivity !== undefined
                ? Number(recentData.conductivity).toFixed(1)
                : "N/A"}{" "}
              <span className="text-xs text-emerald-300/80">µS/cm</span>
            </div>
            <div className="text-[10px] text-emerald-400/70 flex justify-between font-mono">
              <span>EC = TDS × 2.0</span>
              <span>Calculated</span>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Node Status, Diagnostics, and Calculated Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {/* Panel 1: ESP32 Hardware Controller Monitor */}
        <ESP32StatusPanel dataSource={activeESP32Data} />

        {/* Panel 2: Physical Sensor Health & Calibration Integrity */}
        <SensorHealthPanel
          ph={recentData ? recentData.ph : 7.20}
          turbidity={recentData ? recentData.turbidity : 0.80}
          tds={recentData ? recentData.totalDissolvedSolids : 180}
          temperature={recentData ? recentData.temperature : 25.0}
          conductivity={recentData ? recentData.conductivity : 360.0}
          temperatureValid={recentData ? recentData.temperatureValid !== false : true}
          isAnomaly={recentData ? !!recentData.isAnomaly : false}
        />

        {/* Panel 3: Scientific Calculated Parameters & Model Diagnostics */}
        <CalculatedParametersPanel
          data={recentData}
          onTriggerTest={handleTriggerHardwareTest}
          isTesting={isTesting}
        />
      </div>

      {/* IoT Intake Stream Particle Animation */}
      <TelemetryDataStreamParticles />

      {/* Real-Time Parametric Waveforms */}
      <div className="border-t border-slate-800/60 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">
              Real-Time Parametric Waveforms
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Chronological sensor metric series streamed directly from physical ESP32 telemetry packets
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-xl self-start sm:self-auto">
            {historyData.length} Live Data Points
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {chartConfigs.map((cfg) => (
              <div key={cfg.key}>
                {renderParamChart(cfg.title, cfg.key, cfg.color, cfg.unit, cfg.domain, cfg.formula)}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Telemetry;
