import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Cpu, HardDrive, Monitor, ChevronDown, ChevronUp } from "lucide-react";

const AboutProject = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header Button for Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-950/20 transition-all text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">System Integration Pipeline</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Detailed IoT & Software Infrastructure Mappings
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-850 bg-slate-950/30 px-6 py-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-semibold">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 text-sm">ESP32 Hardware Node</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Physical micro-controller interfaces with analog sensors (pH, TDS, Turbidity, Temp) to sample raw telemetry.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                <HardDrive className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 text-sm">Spring Boot REST API</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Serves as a robust backend gateway, mapping incoming telemetry data into a local relational MySQL database.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                <Monitor className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 text-sm">Python Flask ML API</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Deserializes the trained Random Forest model and scales parameter features to compute classification safety.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                <Layers className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 text-sm">React 19 Dashboard</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Visualizes telemetry trends and metrics using interactive Recharts components and Framer Motion layout curves.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutProject;
