import { motion } from "framer-motion";
import { Wifi, WifiOff, Clock, Radio, Signal, Cpu } from "lucide-react";

function ESP32StatusPanel({ dataSource = null }) {
  // Mock data — will be replaced by real ESP32 data via dataSource prop
  const status = dataSource || {
    connected: true,
    connectionStatus: "Connected",
    lastUpdate: new Date().toLocaleTimeString(),
    samplingInterval: "5 seconds",
    signalStrength: -42,
    firmwareVersion: "v3.2.1",
    ipAddress: "192.168.1.105",
    macAddress: "A4:CF:12:8B:3E:F0"
  };

  const isConnected = status.connected;

  const getSignalLevel = (dbm) => {
    if (dbm > -50) return { label: "Excellent", bars: 4, color: "text-green-400" };
    if (dbm > -60) return { label: "Good", bars: 3, color: "text-green-400" };
    if (dbm > -70) return { label: "Fair", bars: 2, color: "text-yellow-400" };
    return { label: "Weak", bars: 1, color: "text-red-400" };
  };

  const signal = getSignalLevel(status.signalStrength);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl hover:border-cyan-500/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${isConnected ? "bg-green-950/30 border-green-800/30" : "bg-red-950/30 border-red-800/30"}`}>
            <Cpu className={`w-5 h-5 ${isConnected ? "text-green-400" : "text-red-400"}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">ESP32 Node Status</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Hardware Controller Monitor
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${
          isConnected 
            ? "bg-green-950/40 border-green-800/30 text-green-400" 
            : "bg-red-950/40 border-red-800/30 text-red-400"
        }`}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {status.connectionStatus}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-955/40 border border-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock size={10} /> Last Update
          </span>
          <p className="text-xs font-bold text-slate-300">{status.lastUpdate}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-955/40 border border-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Radio size={10} /> Sampling
          </span>
          <p className="text-xs font-bold text-slate-300">{status.samplingInterval}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-955/40 border border-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Signal size={10} /> Signal
          </span>
          <p className={`text-xs font-bold ${signal.color}`}>
            {status.signalStrength} dBm ({signal.label})
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-955/40 border border-slate-900/60 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Cpu size={10} /> Firmware
          </span>
          <p className="text-xs font-bold text-slate-300">{status.firmwareVersion}</p>
        </div>
      </div>

      {/* Signal Strength Bars */}
      <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">WiFi Signal:</span>
        <div className="flex items-end gap-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1.5 rounded-sm transition-colors ${
                bar <= signal.bars ? "bg-green-400" : "bg-slate-800"
              }`}
              style={{ height: `${bar * 4 + 4}px` }}
            />
          ))}
        </div>
        <span className={`text-[10px] font-bold ${signal.color}`}>{signal.label}</span>
      </div>
    </motion.div>
  );
}

export default ESP32StatusPanel;
