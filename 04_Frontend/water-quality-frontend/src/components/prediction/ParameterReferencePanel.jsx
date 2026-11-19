import { motion } from "framer-motion";
import { BookOpen, Activity, Thermometer, Wind, Layers, Zap, Brain, ShieldCheck } from "lucide-react";

/**
 * Section 2: Prominent Parameter Target Ranges & Statutory Benchmark Reference
 * Displayed directly below Water Sample Analysis in a spacious full-width grid.
 */
const parameterData = [
  {
    name: "pH Level",
    icon: Activity,
    safeRange: "6.5 – 8.5 pH",
    unit: "pH",
    badgeCls: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60",
    barColor: "bg-cyan-500",
    barWidth: "w-[80%]",
    description:
      "Measures hydrogen-ion concentration. Values within 6.5–8.5 prevent pipe corrosion and bitter alkaline taste."
  },
  {
    name: "Turbidity",
    icon: Wind,
    safeRange: "Max 1.0 NTU",
    unit: "NTU",
    badgeCls: "text-teal-400 bg-teal-950/60 border-teal-800/60",
    barColor: "bg-teal-400",
    barWidth: "w-[65%]",
    description:
      "Measures suspended particulate cloudiness. Low turbidity ensures water clarity and effective disinfection."
  },
  {
    name: "Total Dissolved Solids (TDS)",
    icon: Layers,
    safeRange: "Max 500 mg/L",
    unit: "mg/L (ppm)",
    badgeCls: "text-blue-400 bg-blue-950/60 border-blue-800/60",
    barColor: "bg-blue-500",
    barWidth: "w-[75%]",
    description:
      "Total concentration of dissolved mineral salts. Values below 500 mg/L guarantee pleasant taste and minimal scaling."
  },
  {
    name: "Water Temperature",
    icon: Thermometer,
    safeRange: "15°C – 25°C Ideal",
    unit: "°C",
    badgeCls: "text-rose-400 bg-rose-950/60 border-rose-800/60",
    barColor: "bg-rose-500",
    barWidth: "w-[70%]",
    description:
      "Ambient sample temperature. Crucial for thermal compensation of pH and TDS analog probe calibration curves."
  },
  {
    name: "Electrical Conductivity (EC)",
    icon: Zap,
    safeRange: "< 400 µS/cm",
    unit: "µS/cm",
    badgeCls: "text-amber-400 bg-amber-950/60 border-amber-800/60",
    barColor: "bg-amber-400",
    barWidth: "w-[60%]",
    description:
      "Electric current conductance from dissolved ions. Functionally estimated as EC ≈ TDS × 2.0 µS/cm."
  }
];

function ParameterReferencePanel() {
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Section Header */}
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block">
            STATUTORY BENCHMARK REFERENCE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Parameter Target Ranges
          </h2>
        </div>
      </div>

      {/* Spacious 5-Card Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {parameterData.map((param, index) => {
          const Icon = param.icon;

          return (
            <motion.div
              key={param.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-3.5 group shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] min-h-[175px]"
            >
              {/* Card Top: Icon, Title & Badge */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0">
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-lg border ${param.badgeCls}`}
                  >
                    {param.safeRange}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                  {param.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {param.description}
              </p>

              {/* Visual Target Bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden pt-0.5">
                <div
                  className={`h-full ${param.barWidth} ${param.barColor} rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor]`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full-Width Machine Learning Evaluation Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 text-cyan-400 font-black text-sm uppercase tracking-wider">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span className="text-white">Random Forest Classifier</span>
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
              100 Trees Ensemble
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Multi-layer classification engine validating 5-dimensional hydrodynamic parameters against standardized WHO thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-4 py-2.5 rounded-xl shrink-0 self-start lg:self-auto">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Cross-validated decision consensus with anomaly scoring</span>
        </div>
      </div>
    </div>
  );
}

export default ParameterReferencePanel;
