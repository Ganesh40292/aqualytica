import { motion } from "framer-motion";
import { Activity, Thermometer, Wind, Layers, Zap, Filter, FlaskConical, Heart } from "lucide-react";

function SensorHealthPanel({ ph = 7.2, turbidity = 0.8, tds = 180 }) {
  // Check if sensors are in warning thresholds
  const isPhWarning = ph < 6.5 || ph > 8.5;
  const isTurbWarning = turbidity > 5.0;
  const isTdsWarning = tds > 500;

  const sensors = [
    { 
      name: "pH Electrode Probe", 
      icon: Activity, 
      status: isPhWarning ? "warning" : "healthy", 
      color: "text-cyan-400",
      statusText: isPhWarning ? "Drift Warning" : "Healthy",
      statusColor: isPhWarning ? "text-amber-500 bg-amber-950/20 border-amber-900/20" : "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: isPhWarning ? "bg-amber-500" : "bg-green-500",
      pingColor: isPhWarning ? "bg-amber-400" : "bg-green-400"
    },
    { 
      name: "Temp Transducer", 
      icon: Thermometer, 
      status: "healthy", 
      color: "text-rose-400",
      statusText: "Healthy",
      statusColor: "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: "bg-green-500",
      pingColor: "bg-green-400"
    },
    { 
      name: "TDS Electrical Probe", 
      icon: Layers, 
      status: isTdsWarning ? "warning" : "healthy", 
      color: "text-blue-400",
      statusText: isTdsWarning ? "High Saturation" : "Healthy",
      statusColor: isTdsWarning ? "text-amber-500 bg-amber-950/20 border-amber-900/20" : "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: isTdsWarning ? "bg-amber-500" : "bg-green-500",
      pingColor: isTdsWarning ? "bg-amber-400" : "bg-green-400"
    },
    { 
      name: "Turbidity Optical Sensor", 
      icon: Wind, 
      status: isTurbWarning ? "warning" : "healthy", 
      color: "text-teal-400",
      statusText: isTurbWarning ? "Optical Clouding" : "Healthy",
      statusColor: isTurbWarning ? "text-amber-500 bg-amber-950/20 border-amber-900/20" : "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: isTurbWarning ? "bg-amber-500" : "bg-green-500",
      pingColor: isTurbWarning ? "bg-amber-400" : "bg-green-400"
    },
    { 
      name: "Conductivity Sensor", 
      icon: Zap, 
      status: "healthy", 
      color: "text-yellow-400",
      statusText: "Healthy",
      statusColor: "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: "bg-green-500",
      pingColor: "bg-green-400"
    },
    { 
      name: "Nitrate Filter Sensor", 
      icon: Filter, 
      status: "healthy", 
      color: "text-purple-400",
      statusText: "Healthy",
      statusColor: "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: "bg-green-500",
      pingColor: "bg-green-400"
    },
    { 
      name: "Chloride Electrode", 
      icon: FlaskConical, 
      status: "healthy", 
      color: "text-indigo-400",
      statusText: "Healthy",
      statusColor: "text-green-400 bg-green-950/20 border-green-900/20",
      indicatorColor: "bg-green-500",
      pingColor: "bg-green-400"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl hover:border-cyan-500/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
            <Heart className="w-5 h-5 text-cyan-455 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Sensor Diagnostic Health</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Real-time Hardware Status Check
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.name}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-850 shrink-0 ${sensor.color}`}>
                  <Icon size={12} />
                </div>
                <span className="text-xs font-bold text-slate-200">{sensor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sensor.pingColor}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${sensor.indicatorColor}`} />
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded ${sensor.statusColor}`}>
                  {sensor.statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SensorHealthPanel;
