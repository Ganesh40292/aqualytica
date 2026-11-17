import { motion } from "framer-motion";
import { Activity, Thermometer, Wind, Layers, Zap, Heart, AlertTriangle } from "lucide-react";

/**
 * Diagnostic panel presenting real-time hardware integrity checks for all 5 physical/derived sensors.
 * Reflects physical ESP32 pin assignments, sampling protocols, and probe connectivity statuses.
 */
function SensorHealthPanel({
  ph = 7.2,
  turbidity = 0.8,
  tds = 180,
  temperature = 25.0,
  conductivity = 360,
  temperatureValid = true,
  isAnomaly = false,
}) {
  const isPhWarning = ph < 6.5 || ph > 8.5;
  const isTurbWarning = turbidity > 5.0;
  const isTdsWarning = tds > 500;
  const isTempFault = temperatureValid === false || temperature === null || temperature < 0;
  const isCondWarning = conductivity > 1000;

  const sensors = [
    {
      name: "pH Electrode Sensor",
      pin: "GPIO 34 (ADC1)",
      value: `${Number(ph).toFixed(2)} pH`,
      icon: Activity,
      color: "text-cyan-400",
      statusText: isPhWarning ? (ph < 6.5 ? "Acidic Drift" : "Alkaline Drift") : "Optimal (6.5 - 8.5)",
      statusColor: isPhWarning
        ? "text-amber-400 bg-amber-950/20 border-amber-800/30"
        : "text-green-400 bg-green-950/20 border-green-800/30",
      indicatorColor: isPhWarning ? "bg-amber-400" : "bg-green-400",
      subtext: "50-sample moving average calibration",
    },
    {
      name: "DS18B20 Temp Probe",
      pin: "GPIO 4 (OneWire)",
      value: isTempFault ? "DISCONNECTED" : `${Number(temperature).toFixed(1)} °C`,
      icon: Thermometer,
      color: isTempFault ? "text-amber-400" : "text-rose-400",
      statusText: isTempFault ? "Probe Fault (-127°C)" : "Healthy (12-bit)",
      statusColor: isTempFault
        ? "text-amber-400 bg-amber-950/30 border-amber-700/40"
        : "text-green-400 bg-green-950/20 border-green-800/30",
      indicatorColor: isTempFault ? "bg-amber-500" : "bg-green-400",
      subtext: isTempFault ? "Conversion invalid — ML safeguarded" : "750ms asynchronous thermal acquisition",
    },
    {
      name: "Turbidity Optical Sensor",
      pin: "GPIO 35 (ADC1)",
      value: `${Number(turbidity).toFixed(2)} NTU`,
      icon: Wind,
      color: "text-teal-400",
      statusText: isTurbWarning ? "Optical Clouding (>5.0 NTU)" : "Pristine Clarity (<1.0 NTU)",
      statusColor: isTurbWarning
        ? "text-amber-400 bg-amber-950/20 border-amber-800/30"
        : "text-green-400 bg-green-950/20 border-green-800/30",
      indicatorColor: isTurbWarning ? "bg-amber-400" : "bg-green-400",
      subtext: "41 samples with 16-point trimmed mean filter",
    },
    {
      name: "TDS Submersible Probe",
      pin: "GPIO 32 (ADC1)",
      value: `${Number(tds).toFixed(1)} ppm`,
      icon: Layers,
      color: "text-blue-400",
      statusText: tds > 1000 ? "Saturation Clamped" : isTdsWarning ? "Elevated Dissolved Solids" : "Optimal (0 - 500 ppm)",
      statusColor: isTdsWarning || tds > 1000
        ? "text-amber-400 bg-amber-950/20 border-amber-800/30"
        : "text-green-400 bg-green-950/20 border-green-800/30",
      indicatorColor: isTdsWarning || tds > 1000 ? "bg-amber-400" : "bg-green-400",
      subtext: "30-sample acquisition with thermal compensation",
    },
    {
      name: "Electrical Conductivity",
      pin: "Calculated (EC = TDS × 2)",
      value: `${Number(conductivity).toFixed(1)} µS/cm`,
      icon: Zap,
      color: "text-amber-400",
      statusText: isCondWarning ? "High Conductivity" : "Normal Ionic Range",
      statusColor: isCondWarning
        ? "text-amber-400 bg-amber-950/20 border-amber-800/30"
        : "text-green-400 bg-green-950/20 border-green-800/30",
      indicatorColor: isCondWarning ? "bg-amber-400" : "bg-green-400",
      subtext: "Computed dynamically via EPA standard multiplier",
    },
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
            <Heart className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Physical Sensor Diagnostics</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              ESP32 Calibrated Hardware Health
            </p>
          </div>
        </div>
        {isAnomaly && (
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/40 border border-rose-800/30 px-2 py-0.5 rounded">
            <AlertTriangle size={11} /> Anomaly Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.name}
              className="flex flex-col gap-1 p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-850 shrink-0 ${sensor.color}`}>
                    <Icon size={12} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{sensor.name}</span>
                    <span className="text-[9px] font-mono text-slate-500">{sensor.pin}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black font-mono text-slate-100">{sensor.value}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${sensor.indicatorColor} shadow-[0_0_6px_currentColor]`} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${sensor.statusColor}`}>
                      {sensor.statusText}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 pl-8 font-semibold">{sensor.subtext}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default SensorHealthPanel;
