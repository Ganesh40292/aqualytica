import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen, Activity, Thermometer, Wind, Layers, Zap, Filter, FlaskConical } from "lucide-react";

const parameterData = [
  {
    name: "pH",
    icon: Activity,
    safeRange: "6.5 – 8.5",
    unit: "pH",
    color: "text-cyan-400",
    bgColor: "bg-cyan-950/30 border-cyan-800/30",
    barColor: "bg-cyan-500",
    description: "Measures hydrogen-ion activity. Values below 6.5 indicate acidic water; above 8.5 indicates alkaline conditions."
  },
  {
    name: "Temperature",
    icon: Thermometer,
    safeRange: "20°C – 30°C",
    unit: "°C",
    color: "text-rose-400",
    bgColor: "bg-rose-950/30 border-rose-800/30",
    barColor: "bg-rose-500",
    description: "Water temperature affects dissolved oxygen levels and microbial activity. Optimal range supports safe biological processes."
  },
  {
    name: "Total Dissolved Solids",
    icon: Layers,
    safeRange: "Less than 500 ppm",
    unit: "mg/L",
    color: "text-blue-400",
    bgColor: "bg-blue-950/30 border-blue-800/30",
    barColor: "bg-blue-500",
    description: "Represents total dissolved minerals, salts, and organic matter. High TDS affects taste and may indicate contamination."
  },
  {
    name: "Turbidity",
    icon: Wind,
    safeRange: "Less than 1 NTU",
    unit: "NTU",
    color: "text-teal-400",
    bgColor: "bg-teal-950/30 border-teal-800/30",
    barColor: "bg-teal-500",
    description: "Measures water clarity by detecting suspended particles. High turbidity may harbor harmful microorganisms."
  },
  {
    name: "Conductivity",
    icon: Zap,
    safeRange: "200 – 800 µS/cm",
    unit: "µS/cm",
    color: "text-yellow-400",
    bgColor: "bg-yellow-950/30 border-yellow-800/30",
    barColor: "bg-yellow-500",
    description: "Measures the water's ability to conduct electricity, indicating dissolved ion content and potential impurities."
  },
  {
    name: "Nitrate",
    icon: Filter,
    safeRange: "Less than 10 mg/L",
    unit: "mg/L",
    color: "text-purple-400",
    bgColor: "bg-purple-950/30 border-purple-800/30",
    barColor: "bg-purple-500",
    description: "High nitrate levels indicate agricultural runoff or sewage contamination. Dangerous for infants (blue baby syndrome)."
  },
  {
    name: "Chloride",
    icon: FlaskConical,
    safeRange: "Less than 250 mg/L",
    unit: "mg/L",
    color: "text-indigo-400",
    bgColor: "bg-indigo-950/30 border-indigo-800/30",
    barColor: "bg-indigo-500",
    description: "Elevated chloride levels suggest sewage contamination, industrial discharge, or saltwater intrusion."
  }
];

function ParameterReferencePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl shadow-xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-950/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Parameter Reference</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              WHO Safe Range Guidelines
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-3">
              {parameterData.map((param, index) => {
                const Icon = param.icon;
                return (
                  <motion.div
                    key={param.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 text-xs font-bold ${param.color}`}>
                        <div className={`p-1.5 rounded-lg border ${param.bgColor}`}>
                          <Icon size={12} />
                        </div>
                        {param.name}
                      </span>
                      <span className="text-[10px] font-bold text-green-400 bg-green-950/40 border border-green-900/30 px-2 py-0.5 rounded">
                        {param.safeRange}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pl-8">
                      {param.description}
                    </p>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden ml-8 max-w-[calc(100%-2rem)]">
                      <div className={`h-full w-3/4 ${param.barColor} rounded-full opacity-60`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ParameterReferencePanel;
