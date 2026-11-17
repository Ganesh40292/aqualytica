import { useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Droplets, Wind, Layers, Zap, Thermometer,
  FlaskConical, AlertTriangle, ShieldCheck, ArrowRight, Activity,
  Gauge, Info, BookOpen
} from "lucide-react";

/* ─────────────────────────────────────────────
   SENSOR & PARAMETER DATA
   ───────────────────────────────────────────── */
const sensorData = [
  {
    id: "ph",
    name: "pH Level",
    tagline: "Measures water acidity or alkalinity on a logarithmic scale",
    icon: FlaskConical,
    color: "cyan",
    colorClasses: {
      badge: "bg-cyan-950/60 border-cyan-700/50 text-cyan-300",
      icon: "text-cyan-400 bg-cyan-950/50",
      accent: "border-cyan-800/40",
      glow: "from-cyan-500/8",
      bar: "bg-cyan-500",
      barBg: "bg-cyan-950/40",
    },
    unit: "pH",
    sensor: "Analog Glass Electrode Probe",
    gpio: "GPIO 34 (ADC1_CH6)",
    absoluteMin: 0.0,
    absoluteMax: 14.0,
    safeMin: 6.5,
    safeMax: 8.5,
    idealMin: 7.0,
    idealMax: 7.5,
    whoGuideline: "6.5 – 8.5",
    description:
      "pH is the negative logarithm of hydrogen-ion concentration: pH = −log₁₀[H⁺]. It determines whether water is acidic (pH < 7), neutral (pH = 7), or alkaline (pH > 7). This single number governs heavy-metal solubility, chlorine disinfection effectiveness, and biological safety.",
    lowImpact:
      "Acidic water (pH < 6.5) corrodes metal pipes, leaching lead and copper into the water supply. Causes metallic taste and potential organ damage with long-term exposure.",
    highImpact:
      "Alkaline water (pH > 8.5) produces a bitter, soapy taste. Causes mineral encrustation inside pipes and reduces chlorine disinfection efficiency.",
    calibration:
      "The ESP32 reads the analog voltage from the glass electrode probe. A two-point calibration maps voltage to pH using the formula: pH = 7.00 + ((V_neutral − V_measured) / Sensitivity). A 50-sample moving average filter smooths readings.",
    flowSteps: [
      "Glass Electrode Probe detects H⁺ ions",
      "Analog voltage → ESP32 ADC (GPIO 34)",
      "50-sample moving average filter applied",
      "Two-point calibration converts voltage → pH",
      "Value published via MQTT to Spring Boot",
    ],
  },
  {
    id: "turbidity",
    name: "Turbidity",
    tagline: "Measures water clarity by detecting light scattered by suspended particles",
    icon: Wind,
    color: "teal",
    colorClasses: {
      badge: "bg-teal-950/60 border-teal-700/50 text-teal-300",
      icon: "text-teal-400 bg-teal-950/50",
      accent: "border-teal-800/40",
      glow: "from-teal-500/8",
      bar: "bg-teal-500",
      barBg: "bg-teal-950/40",
    },
    unit: "NTU",
    sensor: "Infrared Optical Sensor",
    gpio: "GPIO 35 (ADC1_CH7)",
    absoluteMin: 0,
    absoluteMax: 3000,
    safeMin: 0,
    safeMax: 5.0,
    idealMin: 0,
    idealMax: 1.0,
    whoGuideline: "< 1 NTU (ideal) / < 5 NTU (max permissible)",
    description:
      "Turbidity quantifies suspended particles — clay, silt, organic matter, and microorganisms — by measuring how much light is scattered when passed through a water sample. It is expressed in Nephelometric Turbidity Units (NTU). Clear drinking water should read below 1 NTU.",
    lowImpact:
      "Low turbidity (< 1 NTU) is ideal and indicates clean, clear water free of suspended contaminants.",
    highImpact:
      "High turbidity (> 5 NTU) means suspended particles are shielding bacteria and viruses from chlorine and UV disinfection, increasing the risk of waterborne disease outbreaks.",
    calibration:
      "The infrared sensor emits light through the water sample and measures scattered intensity on the opposite side. The ESP32 collects 41 raw samples, applies a 16-point trimmed-mean filter to reject bubble artifacts, then converts to NTU via a polynomial calibration curve.",
    flowSteps: [
      "IR LED emits light through water sample",
      "Photodetector measures scattered light intensity",
      "Analog signal → ESP32 ADC (GPIO 35)",
      "41 samples, 16-point trimmed-mean filter",
      "Polynomial curve converts voltage → NTU",
    ],
  },
  {
    id: "tds",
    name: "Total Dissolved Solids (TDS)",
    tagline: "Quantifies dissolved mineral ions and salts in water",
    icon: Layers,
    color: "blue",
    colorClasses: {
      badge: "bg-blue-950/60 border-blue-700/50 text-blue-300",
      icon: "text-blue-400 bg-blue-950/50",
      accent: "border-blue-800/40",
      glow: "from-blue-500/8",
      bar: "bg-blue-500",
      barBg: "bg-blue-950/40",
    },
    unit: "mg/L (ppm)",
    sensor: "Submersible Conductivity Probe",
    gpio: "GPIO 32 (ADC1_CH4)",
    absoluteMin: 0,
    absoluteMax: 2000,
    safeMin: 0,
    safeMax: 500,
    idealMin: 50,
    idealMax: 250,
    whoGuideline: "< 300 mg/L (excellent) / < 500 mg/L (desirable)",
    description:
      "TDS measures the total concentration of dissolved inorganic salts — calcium, magnesium, sodium, potassium, bicarbonates, chlorides, and sulfates. It is the primary indicator of mineral load and directly relates to water taste, hardness, and pipe scaling potential.",
    lowImpact:
      "Very low TDS (< 50 mg/L) indicates demineralized water that may taste flat. While not harmful, it lacks beneficial minerals like calcium and magnesium.",
    highImpact:
      "High TDS (> 500 mg/L) produces a brackish or salty taste, causes pipe scaling and fixture corrosion, and can lead to gastrointestinal discomfort. Values above 1000 mg/L are considered unpotable.",
    calibration:
      "The conductivity probe measures the electrical resistance of water. The ESP32 takes 30 polynomial-corrected samples with Nernst thermal compensation normalized to 25°C: TDS_actual = TDS_raw / (1.0 + 0.02 × (T − 25.0°C)).",
    flowSteps: [
      "Conductivity probe measures ionic resistance",
      "Analog signal → ESP32 ADC (GPIO 32)",
      "30-sample polynomial acquisition",
      "Temperature compensation (Nernst equation)",
      "Compensated TDS value in mg/L",
    ],
  },
  {
    id: "temperature",
    name: "Water Temperature",
    tagline: "Measures thermal energy affecting reaction rates and microbial growth",
    icon: Thermometer,
    color: "rose",
    colorClasses: {
      badge: "bg-rose-950/60 border-rose-700/50 text-rose-300",
      icon: "text-rose-400 bg-rose-950/50",
      accent: "border-rose-800/40",
      glow: "from-rose-500/8",
      bar: "bg-rose-500",
      barBg: "bg-rose-950/40",
    },
    unit: "°C",
    sensor: "DS18B20 Digital Temperature Probe",
    gpio: "GPIO 4 (OneWire Bus)",
    absoluteMin: -10,
    absoluteMax: 60,
    safeMin: 15,
    safeMax: 25,
    idealMin: 18,
    idealMax: 22,
    whoGuideline: "15 – 25 °C (ambient optimal)",
    description:
      "Temperature controls dissolved oxygen levels, chemical reaction rates, and bacterial metabolism. It also affects the accuracy of pH, TDS, and conductivity readings — making it the foundational compensation parameter for all other sensors.",
    lowImpact:
      "Cold water (< 15°C) has higher dissolved oxygen but can cause discomfort during consumption. Extremely low temperatures indicate possible sensor malfunction (DS18B20 returns −127°C when disconnected).",
    highImpact:
      "Warm water (> 25°C) accelerates bacterial growth rates (E. coli, Legionella), degrades chlorine residual faster, and promotes biofilm formation in distribution pipes.",
    calibration:
      "The DS18B20 is a digital sensor communicating over OneWire protocol with 12-bit precision (0.0625°C resolution). No ADC conversion is needed. The ESP32 reads the digital value asynchronously without blocking telemetry publishing.",
    flowSteps: [
      "DS18B20 probe measures water temperature",
      "Digital signal via OneWire bus (GPIO 4)",
      "12-bit precision (0.0625°C resolution)",
      "Non-blocking asynchronous read",
      "Used for TDS thermal compensation",
    ],
  },
  {
    id: "ec",
    name: "Electrical Conductivity (EC)",
    tagline: "Estimates ionic charge mobility from TDS using a standard multiplier",
    icon: Zap,
    color: "amber",
    colorClasses: {
      badge: "bg-amber-950/60 border-amber-700/50 text-amber-300",
      icon: "text-amber-400 bg-amber-950/50",
      accent: "border-amber-800/40",
      glow: "from-amber-500/8",
      bar: "bg-amber-500",
      barBg: "bg-amber-950/40",
    },
    unit: "µS/cm",
    sensor: "Calculated from TDS (no dedicated probe)",
    gpio: "Software-derived",
    absoluteMin: 0,
    absoluteMax: 4000,
    safeMin: 0,
    safeMax: 800,
    idealMin: 100,
    idealMax: 400,
    whoGuideline: "< 400 µS/cm (pristine) / < 800 µS/cm (permissible)",
    description:
      "Electrical Conductivity measures water's ability to conduct electric current, directly proportional to dissolved ion concentration. In Aqualytica, EC is not measured by a separate probe — it is derived from TDS using the EPA empirical formula: EC (µS/cm) = TDS (mg/L) × 2.0.",
    lowImpact:
      "Low EC (< 100 µS/cm) indicates very pure water with minimal dissolved minerals. While safe, it may lack essential trace minerals.",
    highImpact:
      "High EC (> 800 µS/cm) signals excessive dissolved ions from agricultural runoff, industrial discharge, or saline intrusion. Values above 1000 µS/cm warrant investigation.",
    calibration:
      "EC is calculated synchronously across the ESP32 firmware, Spring Boot backend, and Python ML service using the EPA standard: EC = TDS × 2.0. No separate sensor calibration is required since it inherits TDS accuracy.",
    flowSteps: [
      "TDS value obtained from conductivity probe",
      "EPA formula applied: EC = TDS × 2.0",
      "Calculated on ESP32, verified on backend",
      "Cross-validated in Python ML pipeline",
      "Used as ML feature for potability prediction",
    ],
  },
];

/* ─────────────────────────────────────────────
   RANGE BAR COMPONENT
   ───────────────────────────────────────────── */
const RangeBar = ({ sensor }) => {
  const { absoluteMin, absoluteMax, safeMin, safeMax, idealMin, idealMax, colorClasses } = sensor;
  const range = absoluteMax - absoluteMin;
  const safeLeft = ((safeMin - absoluteMin) / range) * 100;
  const safeWidth = ((safeMax - safeMin) / range) * 100;
  const idealLeft = ((idealMin - absoluteMin) / range) * 100;
  const idealWidth = ((idealMax - idealMin) / range) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>{absoluteMin} {sensor.unit}</span>
        <span>{absoluteMax} {sensor.unit}</span>
      </div>
      <div className="relative h-5 rounded-full bg-slate-800/80 overflow-hidden">
        {/* Danger zones (full bar) */}
        <div className="absolute inset-0 bg-red-950/30 rounded-full" />
        {/* Safe zone */}
        <div
          className="absolute top-0 h-full bg-emerald-900/40 border-x border-emerald-700/30"
          style={{ left: `${safeLeft}%`, width: `${safeWidth}%` }}
        />
        {/* Ideal zone */}
        <div
          className={`absolute top-0.5 h-4 rounded-full ${colorClasses.bar} opacity-60`}
          style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }}
        />
      </div>
      <div className="flex items-center justify-center gap-6 text-[10px] font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-red-950/60 border border-red-800/40 inline-block" />
          <span className="text-red-400">Hazardous</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-emerald-900/60 border border-emerald-700/40 inline-block" />
          <span className="text-emerald-400">Safe Range</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-2 rounded-sm ${colorClasses.bar} opacity-60 inline-block`} />
          <span className={`text-${sensor.color}-400`}>Ideal</span>
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FLOW DIAGRAM COMPONENT
   ───────────────────────────────────────────── */
const FlowDiagram = ({ steps, colorClasses }) => (
  <div className="flex flex-col items-start gap-0">
    {steps.map((step, i) => (
      <div key={i} className="flex items-start gap-3">
        {/* Vertical line + dot */}
        <div className="flex flex-col items-center w-5 shrink-0">
          <div className={`w-3 h-3 rounded-full ${colorClasses.bar} opacity-80 mt-1 shrink-0 ring-2 ring-slate-900`} />
          {i < steps.length - 1 && (
            <div className={`w-0.5 h-8 ${colorClasses.barBg} opacity-60`} />
          )}
        </div>
        {/* Label */}
        <p className="text-sm text-slate-300 leading-relaxed pb-2">{step}</p>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   SENSOR CARD COMPONENT (with dropdown)
   ───────────────────────────────────────────── */
const SensorCard = ({ sensor, isOpen, onToggle }) => {
  const Icon = sensor.icon;
  const c = sensor.colorClasses;

  return (
    <div className={`bg-slate-900/40 backdrop-blur-xl border ${c.accent} rounded-2xl overflow-hidden transition-all duration-300`}>
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
      >
        {/* Icon */}
        <div className={`p-3 rounded-xl ${c.icon} shrink-0`}>
          <Icon size={22} />
        </div>

        {/* Title + tagline */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">{sensor.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{sensor.tagline}</p>
        </div>

        {/* Quick badges */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${c.badge}`}>
            {sensor.unit}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-emerald-950/50 border-emerald-700/40 text-emerald-300">
            WHO: {sensor.whoGuideline}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={20}
          className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`border-t ${c.accent} px-5 sm:px-6 py-6 space-y-8`}>

              {/* Mobile badges */}
              <div className="flex sm:hidden items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${c.badge}`}>
                  {sensor.unit}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-emerald-950/50 border-emerald-700/40 text-emerald-300">
                  WHO: {sensor.whoGuideline}
                </span>
              </div>

              {/* ── Section 1: What It Measures ── */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info size={15} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">What It Measures</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-6">
                  {sensor.description}
                </p>
              </div>

              {/* ── Section 2: Value Ranges ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gauge size={15} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Value Ranges</h4>
                </div>

                {/* Range visual bar */}
                <div className="pl-6">
                  <RangeBar sensor={sensor} />
                </div>

                {/* Range table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-6">
                  <div className="bg-slate-800/40 rounded-xl p-3 text-center border border-slate-700/30">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Absolute Min</p>
                    <p className="text-base font-black text-slate-200">{sensor.absoluteMin}</p>
                    <p className="text-[10px] text-slate-500">{sensor.unit}</p>
                  </div>
                  <div className="bg-emerald-950/30 rounded-xl p-3 text-center border border-emerald-800/30">
                    <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Safe Range</p>
                    <p className="text-base font-black text-emerald-300">{sensor.safeMin} – {sensor.safeMax}</p>
                    <p className="text-[10px] text-emerald-500">{sensor.unit}</p>
                  </div>
                  <div className={`${c.barBg} rounded-xl p-3 text-center border ${c.accent}`}>
                    <p className={`text-[10px] uppercase font-bold mb-1 text-${sensor.color}-500`}>Ideal Range</p>
                    <p className={`text-base font-black text-${sensor.color}-300`}>{sensor.idealMin} – {sensor.idealMax}</p>
                    <p className={`text-[10px] text-${sensor.color}-500`}>{sensor.unit}</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-xl p-3 text-center border border-slate-700/30">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Absolute Max</p>
                    <p className="text-base font-black text-slate-200">{sensor.absoluteMax}</p>
                    <p className="text-[10px] text-slate-500">{sensor.unit}</p>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Health Impact ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Health Impact</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                  <div className="bg-blue-950/20 border border-blue-800/30 rounded-xl p-4">
                    <p className="text-[11px] text-blue-400 font-bold uppercase mb-1.5">↓ Too Low</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{sensor.lowImpact}</p>
                  </div>
                  <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-4">
                    <p className="text-[11px] text-red-400 font-bold uppercase mb-1.5">↑ Too High</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{sensor.highImpact}</p>
                  </div>
                </div>
              </div>

              {/* ── Section 4: Sensor Hardware & Calibration ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity size={15} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Sensor & Calibration</h4>
                </div>
                <div className="pl-6 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Sensor</p>
                      <p className="text-sm text-slate-200 font-medium">{sensor.sensor}</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">ESP32 Pin</p>
                      <p className="text-sm text-slate-200 font-medium">{sensor.gpio}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{sensor.calibration}</p>
                </div>
              </div>

              {/* ── Section 5: Measurement Flow ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowRight size={15} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Measurement Flow</h4>
                </div>
                <div className="pl-6">
                  <FlowDiagram steps={sensor.flowSteps} colorClasses={c} />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN HANDBOOK PAGE
   ───────────────────────────────────────────── */
const Handbook = () => {
  const [openSections, setOpenSections] = useState({});

  const toggle = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const allOpen = sensorData.every((s) => openSections[s.id]);

  const toggleAll = () => {
    const next = {};
    sensorData.forEach((s) => {
      next[s.id] = !allOpen;
    });
    setOpenSections(next);
  };

  return (
    <PageWrapper className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* ── Hero Header ── */}
      <div className="relative bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 sm:p-10 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Droplets size={12} /> 5 Sensor Channels
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={12} /> WHO Guidelines
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={12} /> Technical Reference
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
              Sensor & Parameter Handbook
            </h1>
            <p className="text-base text-cyan-400 font-semibold mt-1">
              Complete reference for every water quality parameter monitored by Aqualytica
            </p>
          </div>

          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Tap any sensor below to explore what it measures, its safe and hazardous value ranges,
            health impacts, ESP32 hardware details, calibration method, and the end-to-end measurement flow.
          </p>

          {/* Summary strip */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800/50">
            {sensorData.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/30">
                  <div className={`p-1.5 rounded-lg ${s.colorClasses.icon}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">{s.name.split("(")[0].trim()}</p>
                    <p className="text-[11px] text-slate-300 font-semibold">{s.unit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Expand/Collapse All ── */}
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/40 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
        >
          <ChevronDown size={14} className={`transition-transform ${allOpen ? "rotate-180" : ""}`} />
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* ── Sensor Cards ── */}
      <div className="space-y-5">
        {sensorData.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            isOpen={!!openSections[sensor.id]}
            onToggle={() => toggle(sensor.id)}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Handbook;
