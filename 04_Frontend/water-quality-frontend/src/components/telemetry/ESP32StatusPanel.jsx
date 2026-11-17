import { motion } from "framer-motion";
import { Wifi, WifiOff, Clock, Radio, Signal, Cpu, Network } from "lucide-react";

/**
 * Controller Monitor Panel reflecting the active hardware state of the physical ESP32 DevKit V1 node
 * connected to the Mosquitto MQTT broker over Wi-Fi.
 */
function ESP32StatusPanel({ dataSource = null }) {
  const status = dataSource || {
    connected: true,
    connectionStatus: "Connected",
    lastUpdate: new Date().toLocaleTimeString(),
    samplingInterval: "10 seconds",
    signalStrength: -52,
    firmwareVersion: "Aqualytica v3.2.1",
    ipAddress: "10.39.71.112",
    macAddress: "AQUALYTICA_ESP32",
  };

  const isConnected = status.connected;

  const getSignalLevel = (dbm) => {
    if (dbm > -50) return { label: "Excellent", bars: 4, color: "text-green-400" };
    if (dbm > -65) return { label: "Good", bars: 3, color: "text-green-400" };
    if (dbm > -80) return { label: "Fair", bars: 2, color: "text-yellow-400" };
    return { label: "Weak", bars: 1, color: "text-red-400" };
  };

  const signal = getSignalLevel(status.signalStrength ?? -60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isConnected ? "bg-green-950/30 border-green-800/30" : "bg-red-950/30 border-red-800/30"}`}>
              <Cpu className={`w-5 h-5 ${isConnected ? "text-green-400" : "text-red-400"}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">ESP32 Controller Node</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Hardware Node Telemetry Link
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
            isConnected
              ? "bg-green-950/40 border-green-800/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
              : "bg-red-950/40 border-red-800/30 text-red-400"
          }`}>
            {isConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}
            {status.connectionStatus}
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock size={10} className="text-cyan-400" /> Heartbeat
            </span>
            <p className="text-xs font-bold text-slate-300 truncate">{status.lastUpdate}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Radio size={10} className="text-teal-400" /> Interval
            </span>
            <p className="text-xs font-bold text-slate-300 truncate">10s (Periodic)</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Signal size={10} className="text-emerald-400" /> Wi-Fi RSSI
            </span>
            <p className={`text-xs font-bold ${signal.color}`}>
              {status.signalStrength} dBm ({signal.label})
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Network size={10} className="text-blue-400" /> Broker Protocol
            </span>
            <p className="text-xs font-bold text-slate-300 truncate">Mosquitto (1883)</p>
          </div>
        </div>

        {/* MQTT Topic Architecture Box */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900/80 space-y-1 text-[10px]">
          <div className="flex justify-between items-center text-slate-400 font-mono">
            <span className="text-slate-500">Ingest Topic:</span>
            <span className="text-cyan-400 font-bold">aqualytica/sensors</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 font-mono">
            <span className="text-slate-500">Command:</span>
            <span className="text-emerald-400 font-bold">aqualytica/device/command</span>
          </div>
        </div>
      </div>

      {/* Signal Strength Visualizer */}
      <div className="mt-4 flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Wi-Fi Link:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1.5 rounded-sm transition-colors ${
                  bar <= signal.bars ? "bg-green-400" : "bg-slate-800"
                }`}
                style={{ height: `${bar * 3.5 + 4}px` }}
              />
            ))}
          </div>
          <span className={`text-[10px] font-bold ${signal.color}`}>{signal.label}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default ESP32StatusPanel;
