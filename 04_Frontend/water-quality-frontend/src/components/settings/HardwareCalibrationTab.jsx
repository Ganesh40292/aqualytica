import { useState } from "react";
import { Cpu, CheckCircle2, RotateCcw } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { playSplashChime } from "../../utils/audioHelper";

/**
 * Hardware Calibration & Firmware Offsets Configuration Tab
 * Realistically exposes actual ESP32 calibration constants, GPIO pinouts, and acquisition windows.
 * Full-width dark glassmorphic layout.
 */
const HardwareCalibrationTab = () => {
  const toast = useToast();

  const [phSlope, setPhSlope] = useState(() => localStorage.getItem("wqms-cal-ph-slope") || "0.01994284");
  const [phIntercept, setPhIntercept] = useState(() => localStorage.getItem("wqms-cal-ph-intercept") || "-20.59731");
  const [phSamples, setPhSamples] = useState(() => localStorage.getItem("wqms-cal-ph-samples") || "50");

  const [turbSamples, setTurbSamples] = useState(() => localStorage.getItem("wqms-cal-turb-samples") || "41");
  const [turbTrim, setTurbTrim] = useState(() => localStorage.getItem("wqms-cal-turb-trim") || "8");

  const [tdsTempCoeff, setTdsTempCoeff] = useState(() => localStorage.getItem("wqms-cal-tds-coeff") || "2.00");
  const [tdsSaturationAdc, setTdsSaturationAdc] = useState(() => localStorage.getItem("wqms-cal-tds-sat") || "2789");

  const [samplingInterval, setSamplingInterval] = useState(() => localStorage.getItem("wqms-sampling-interval") || "10");

  const handleSave = () => {
    localStorage.setItem("wqms-cal-ph-slope", phSlope);
    localStorage.setItem("wqms-cal-ph-intercept", phIntercept);
    localStorage.setItem("wqms-cal-ph-samples", phSamples);
    localStorage.setItem("wqms-cal-turb-samples", turbSamples);
    localStorage.setItem("wqms-cal-turb-trim", turbTrim);
    localStorage.setItem("wqms-cal-tds-coeff", tdsTempCoeff);
    localStorage.setItem("wqms-cal-tds-sat", tdsSaturationAdc);
    localStorage.setItem("wqms-sampling-interval", samplingInterval);

    playSplashChime();
    toast.showSuccess("Hardware calibration constants updated in local firmware profile");
  };

  const handleResetDefaults = () => {
    setPhSlope("0.01994284");
    setPhIntercept("-20.59731");
    setPhSamples("50");
    setTurbSamples("41");
    setTurbTrim("8");
    setTdsTempCoeff("2.00");
    setTdsSaturationAdc("2789");
    setSamplingInterval("10");

    localStorage.removeItem("wqms-cal-ph-slope");
    localStorage.removeItem("wqms-cal-ph-intercept");
    localStorage.removeItem("wqms-cal-ph-samples");
    localStorage.removeItem("wqms-cal-turb-samples");
    localStorage.removeItem("wqms-cal-turb-trim");
    localStorage.removeItem("wqms-cal-tds-coeff");
    localStorage.removeItem("wqms-cal-tds-sat");
    localStorage.removeItem("wqms-sampling-interval");

    toast.showInfo("Restored factory firmware calibration values");
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Physical Signal Acquisition
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            ESP32 Sensor Calibration & Signal Conditioning
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Calibrated analog-to-digital polynomial equations, sample filtering buffers, and thermal compensation factors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Offsets</span>
          </button>
        </div>
      </div>

      {/* Grid of Hardware Sensor Parameters (2x2 Equal Heights) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: pH Sensor Calibration */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 border-t-4 border-t-cyan-500 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 px-2.5 py-0.5 rounded-md">
                GPIO 34 • ADC1_CH6
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1.5">Analog pH Probe Sensor</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Linear Slope
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Calibrated Slope (m)
              </label>
              <input
                type="text"
                value={phSlope}
                onChange={(e) => setPhSlope(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Formula: pH = (m × ADC) + c</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Calibrated Intercept (c)
              </label>
              <input
                type="text"
                value={phIntercept}
                onChange={(e) => setPhIntercept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Arithmetic Sample Window (Samples)
              </label>
              <input
                type="number"
                value={phSamples}
                onChange={(e) => setPhSamples(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">50 continuous ADC samples averaged per telemetry packet</span>
            </div>
          </div>
        </div>

        {/* Card 2: Turbidity Optical Sensor */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 border-t-4 border-t-teal-500 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase bg-teal-950/60 text-teal-400 border border-teal-800/60 px-2.5 py-0.5 rounded-md">
                GPIO 35 • ADC1_CH7
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1.5">Optical Turbidity Sensor</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Piecewise Map
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Total Voltage Sample Window (analogReadMilliVolts)
              </label>
              <input
                type="number"
                value={turbSamples}
                onChange={(e) => setTurbSamples(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Trimmed Outlier Discard Count (Each Side)
              </label>
              <input
                type="number"
                value={turbTrim}
                onChange={(e) => setTurbTrim(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-teal-300 focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Discards lowest 8 and highest 8 readings; averages remaining 25</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="font-bold text-teal-400 block mb-1">Piecewise Calibration Anchors:</span>
              <span>2.0, 5.0, 10.0, 20.0, 75.0, 200.0 NTU</span>
            </div>
          </div>
        </div>

        {/* Card 3: TDS Sensor & Thermal Compensation */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 border-t-4 border-t-blue-500 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase bg-blue-950/60 text-blue-400 border border-blue-800/60 px-2.5 py-0.5 rounded-md">
                GPIO 32 • ADC1_CH4
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1.5">Analog TDS Probe Sensor</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Thermal Comp
            </span>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Temperature Compensation Factor (EC / TDS)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tdsTempCoeff}
                  onChange={(e) => setTdsTempCoeff(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-blue-300 focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs font-bold text-slate-400 font-mono">%/°C</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Standard aqueous electrolyte multiplier (EC = TDS × 2.0)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                ADC Saturation Cutoff Threshold
              </label>
              <input
                type="number"
                value={tdsSaturationAdc}
                onChange={(e) => setTdsSaturationAdc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-blue-300 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Protects hardware from short-circuits (Flags saturation at &gt;= 2789 ADC)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Temperature Sensor & Sampling Cadence */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 border-t-4 border-t-rose-500 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase bg-rose-950/60 text-rose-400 border border-rose-800/60 px-2.5 py-0.5 rounded-md">
                GPIO 4 • OneWire
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1.5">DS18B20 Digital Temperature</h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              12-Bit Digital
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between font-bold text-white">
                <span>Firmware Validation Range:</span>
                <span className="text-rose-400">-10.0°C to &lt; 85.0°C</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Rejected Values:</span>
                <span>-127.0°C (Disconnect) &amp; 85.0°C (Reset)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-1.5">
                <span>Hardware Telemetry Cadence</span>
                <span className="text-cyan-400 font-mono font-black">{samplingInterval} Seconds</span>
              </label>
              <div className="grid grid-cols-4 gap-2.5 pt-1">
                {["5", "10", "30", "60"].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSamplingInterval(sec)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                      samplingInterval === sec
                        ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Frequency of MQTT telemetry publication from ESP32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareCalibrationTab;