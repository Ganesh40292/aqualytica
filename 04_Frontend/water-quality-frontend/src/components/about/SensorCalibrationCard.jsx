import { Activity, Thermometer, Wind, Layers, Zap } from "lucide-react";

const sensorsData = [
  {
    name: "pH Electrode Sensor",
    gpio: "GPIO 34 (ADC1)",
    type: "Analog Potentiometric Probe",
    sampling: "50-sample moving average with 10ms sampling interval",
    formula: "pH = 7.00 + ((V_neutral - V_measured) / Sensitivity)",
    safeRange: "6.50 – 8.50 pH (WHO Drinking Standard)",
    icon: Activity,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
    desc: "Measures hydrogen-ion electrochemical activity across a glass electrode membrane. Mitigates ambient power jitter via a 50-sample moving average."
  },
  {
    name: "DS18B20 Digital Temperature Probe",
    gpio: "GPIO 4 (OneWire Bus)",
    type: "12-bit Digital Thermometer",
    sampling: "750ms asynchronous non-blocking conversion",
    formula: "T = RawDigitalValue × 0.0625 °C (Safeguarded against -127°C)",
    safeRange: "20.0°C – 30.0°C (Ambient Baseline: 25.0°C)",
    icon: Thermometer,
    color: "text-rose-400 border-rose-500/30 bg-rose-950/20",
    desc: "Provides temperature compensation for TDS and pH. Uses asynchronous conversion so MQTT message servicing and LED animations continue uninterrupted."
  },
  {
    name: "Turbidity Optical Sensor",
    gpio: "GPIO 35 (ADC1)",
    type: "Infrared Optical Transmittance Sensor",
    sampling: "41 samples with 16-point trimmed mean filter (delDiscard=5, delAverage=16)",
    formula: "NTU = -1120.4 × V^2 + 5742.3 × V - 4352.9 (Clamped: 0–1000 NTU)",
    safeRange: "< 1.0 NTU (Ideal Drinking Water) / < 5.0 NTU (Permissible)",
    icon: Wind,
    color: "text-teal-400 border-teal-500/30 bg-teal-950/20",
    desc: "Detects light scattering from colloidal particulates and suspended solids. Outliers are discarded using a 16-point trimmed mean filter."
  },
  {
    name: "TDS Submersible Probe",
    gpio: "GPIO 32 (ADC1)",
    type: "Analog Conductive Probe",
    sampling: "30-sample acquisition with 40ms interval & 2789 ADC saturation guard",
    formula: "TDS_raw = (133.42·V^3 - 255.86·V^2 + 857.39·V) × 0.5; TDS = TDS_raw / (1 + 0.02·(T - 25))",
    safeRange: "< 500 mg/L (WHO Desirable) / < 1000 mg/L (Max Permissible)",
    icon: Layers,
    color: "text-blue-400 border-blue-500/30 bg-blue-950/20",
    desc: "Quantifies dissolved inorganic minerals and ionized salts. Includes thermal compensation to normalize readings to standard 25°C."
  },
  {
    name: "Estimated Electrical Conductivity (EC)",
    gpio: "Derived (No dedicated ADC pin)",
    type: "Calculated Ionic Parameter",
    sampling: "Synchronized with TDS sampling cycle",
    formula: "EC (µS/cm) = TDS (mg/L) × 2.0 (EPA standard conversion ratio)",
    safeRange: "< 1000 µS/cm (Aesthetic Guideline)",
    icon: Zap,
    color: "text-amber-400 border-amber-500/30 bg-amber-950/20",
    desc: "Represents ionic transport capability in water. Computed dynamically using the empirical factor EC = TDS × 2.0 across firmware, backend, and frontend."
  }
];

const SensorCalibrationCard = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensorsData.map((sensor, idx) => {
          const Icon = sensor.icon;
          const isWide = idx === sensorsData.length - 1;
          return (
            <div
              key={sensor.name}
              className={`p-6 rounded-3xl bg-slate-900/30 backdrop-blur-2xl border border-slate-800/60 hover:border-slate-700 transition-all flex flex-col justify-between ${
                isWide ? "md:col-span-2" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl border ${sensor.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{sensor.name}</h4>
                      <span className="text-[10px] text-cyan-400 font-mono font-semibold">{sensor.gpio} &bull; {sensor.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {sensor.desc}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Calibration Formula / Equation:</div>
                  <div className="text-cyan-300 overflow-x-auto select-all">{sensor.formula}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/80">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mb-0.5">Sampling Protocol</span>
                    <span className="text-slate-300">{sensor.sampling}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/80">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mb-0.5">Safe Standard</span>
                    <span className="text-emerald-400 font-semibold">{sensor.safeRange}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorCalibrationCard;
