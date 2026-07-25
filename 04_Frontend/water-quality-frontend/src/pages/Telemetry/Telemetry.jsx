import { useEffect, useState, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import SkeletonCard from "../../components/common/SkeletonCard";
import { getRecentHistory } from "../../services/historyService";
import ESP32StatusPanel from "../../components/telemetry/ESP32StatusPanel";
import SensorHealthPanel from "../../components/telemetry/SensorHealthPanel";
import TelemetryDataStreamParticles from "../../components/telemetry/TelemetryDataStreamParticles";
import ExportButton from "../../components/common/ExportButton";
import { exportExactPageToPDF } from "../../utils/exportUtils";
import GlassmorphicTooltip from "../../components/analytics/GlassmorphicTooltip";
import { Radio } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const Telemetry = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Anomaly drift simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPh, setSimPh] = useState(0); // offset range: -3.0 to 3.0
  const [simTurb, setSimTurb] = useState(0); // offset range: -2.0 to 5.0
  const [simTds, setSimTds] = useState(0); // offset range: -150 to 400

  const fetchTelemetry = useCallback(async () => {
    try {
      const data = await getRecentHistory();
      // Reverse array to show trend left-to-right (chronological)
      setHistoryData((data || []).slice().reverse());
    } catch (err) {
      console.error("Failed to load telemetry data", err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  // Map simulated drift values on top of active database history log array
  const simulatedHistoryData = isSimulating
    ? historyData.map((item) => ({
        ...item,
        ph: Math.min(14, Math.max(0, (item.ph || 7.2) + simPh)),
        turbidity: Math.min(10, Math.max(0, (item.turbidity || 0.8) + simTurb)),
        totalDissolvedSolids: Math.min(1000, Math.max(0, (item.totalDissolvedSolids || 180) + simTds)),
      }))
    : historyData;

  const recentData = simulatedHistoryData.length > 0 ? simulatedHistoryData[simulatedHistoryData.length - 1] : null;

  const mockESP32Data = recentData ? {
    connected: true,
    connectionStatus: "Connected",
    lastUpdate: recentData.predictedAt ? new Date(recentData.predictedAt).toLocaleTimeString() : "Just now",
    samplingInterval: "5 seconds",
    signalStrength: -45,
    firmwareVersion: "v3.2.1",
    ipAddress: "192.168.1.105",
    macAddress: "A4:CF:12:8B:3E:F0"
  } : null;

  // Helper function to build custom area graphs for each parameter
  const renderParamChart = (title, dataKey, color, unit, domain) => {
    return (
      <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300 min-h-[260px]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-sm font-bold text-slate-355 uppercase tracking-widest">{title}</h4>
            <span className={`text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${color.badge}`}>
              {simulatedHistoryData.length > 0 ? `${simulatedHistoryData[simulatedHistoryData.length - 1][dataKey]?.toFixed(2)} ${unit}` : "N/A"}
            </span>
          </div>
        </div>

        <div className="h-[150px] w-full mt-2">
          {simulatedHistoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-bold">
              Awaiting Node stream data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulatedHistoryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color.hex} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color.hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="predictedAt" 
                  tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
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
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  };

  const chartConfigs = [
    { title: "pH Level Concentration", key: "ph", color: { hex: "#06b6d4", badge: "bg-cyan-950/40 border border-cyan-800/40 text-cyan-400" }, unit: "pH", domain: [4, 10] },
    { title: "Water Temperature", key: "temperature", color: { hex: "#f43f5e", badge: "bg-rose-950/40 border border-rose-800/40 text-rose-400" }, unit: "°C", domain: [10, 40] },
    { title: "Turbidity Index", key: "turbidity", color: { hex: "#14b8a6", badge: "bg-teal-950/40 border border-teal-800/40 text-teal-400" }, unit: "NTU", domain: [0, 10] },
    { title: "Total Dissolved Solids", key: "totalDissolvedSolids", color: { hex: "#3b82f6", badge: "bg-blue-950/40 border border-blue-800/40 text-blue-400" }, unit: "mg/L", domain: [100, 800] },
    { title: "Electrical Conductivity", key: "conductivity", color: { hex: "#10b981", badge: "bg-emerald-950/40 border border-emerald-800/40 text-emerald-400" }, unit: "µS", domain: [200, 1200] },
    { title: "Nitrate Concentration", key: "nitrate", color: { hex: "#a855f7", badge: "bg-purple-950/40 border border-purple-800/40 text-purple-400" }, unit: "mg/L", domain: [0, 20] },
    { title: "Chloride Concentration", key: "chloride", color: { hex: "#6366f1", badge: "bg-indigo-950/40 border border-indigo-800/40 text-indigo-400" }, unit: "mg/L", domain: [100, 400] }
  ];

  return (
    <PageWrapper className="space-y-8">
      {/* Dynamic Status Header */}
      <div className="flex justify-between items-center">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          Node Telemetry Operations Panel
        </div>
        <div className="flex items-center gap-4.5 no-print">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-355 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>WIFI STREAM ACTIVE</span>
          </div>
          <ExportButton
            onExportPDF={handleExportPDF}
            label="Export Page"
          />
        </div>
      </div>

      {/* Hardware Node Status & Simulation Overrides Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <ESP32StatusPanel dataSource={mockESP32Data} />
        
        <SensorHealthPanel 
          ph={recentData ? recentData.ph : 7.20} 
          turbidity={recentData ? recentData.turbidity : 0.80} 
          tds={recentData ? recentData.totalDissolvedSolids : 180} 
        />
        
        {/* Anomaly Drift Console */}
        <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-slate-100">Anomaly Drift Simulator</h3>
              <button
                onClick={() => {
                  setIsSimulating(!isSimulating);
                  if (isSimulating) {
                    setSimPh(0);
                    setSimTurb(0);
                    setSimTds(0);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isSimulating 
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" 
                    : "bg-slate-950/40 border-slate-850 text-slate-500"
                }`}
              >
                {isSimulating ? "Active" : "Disabled"}
              </button>
            </div>
            
            {isSimulating ? (
              <div className="space-y-4">
                {/* pH Drift */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-450">
                    <span>pH Drift Override</span>
                    <span className={simPh === 0 ? "text-slate-500" : simPh > 0 ? "text-cyan-400" : "text-rose-400"}>
                      {simPh > 0 ? `+${simPh.toFixed(1)}` : simPh.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-3.0"
                    max="3.0"
                    step="0.1"
                    value={simPh}
                    onChange={(e) => setSimPh(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Turbidity Drift */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-450">
                    <span>Turbidity Drift</span>
                    <span className={simTurb === 0 ? "text-slate-500" : "text-teal-400"}>
                      {simTurb > 0 ? `+${simTurb.toFixed(1)}` : simTurb.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="5.0"
                    step="0.1"
                    value={simTurb}
                    onChange={(e) => setSimTurb(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                {/* TDS Drift */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-450">
                    <span>TDS Saturation</span>
                    <span className={simTds === 0 ? "text-slate-500" : "text-rose-455"}>
                      {simTds > 0 ? `+${simTds}` : simTds}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-150"
                    max="400"
                    step="10"
                    value={simTds}
                    onChange={(e) => setSimTds(Number(e.target.value))}
                    className="w-full h-1 bg-slate-955 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
                
                <button
                  onClick={() => {
                    setSimPh(0);
                    setSimTurb(0);
                    setSimTds(0);
                  }}
                  className="w-full py-2 bg-slate-955/40 border border-slate-850 hover:border-slate-750 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer mt-2"
                >
                  Reset Offsets
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl p-4 bg-slate-950/20">
                <p className="text-[10px] font-bold uppercase tracking-widest">Simulator Standby</p>
                <p className="text-[9px] font-semibold text-slate-600 tracking-wider mt-2.5 leading-relaxed">
                  Enable simulation overrides to shift pH, turbidity, or TDS saturation thresholds and test alarm triggers live.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IoT intake stream animation card */}
      <TelemetryDataStreamParticles />

      <div className="border-t border-slate-855/40 pt-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">
          Real-time Parametric Waveforms
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
            <SkeletonCard className="h-[280px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {chartConfigs.map((cfg) => (
              <div key={cfg.key}>
                {renderParamChart(cfg.title, cfg.key, cfg.color, cfg.unit, cfg.domain)}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Telemetry;
