import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Award, Database, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const AboutModel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const data = [
    { name: "pH Level", importance: 34, color: "#06b6d4" },
    { name: "TDS", importance: 26, color: "#3b82f6" },
    { name: "Turbidity", importance: 20, color: "#14b8a6" },
    { name: "Conductivity", importance: 14, color: "#10b981" },
    { name: "Temperature", importance: 6, color: "#f43f5e" }
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Header Button for Dropdown Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-950/20 transition-all text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-slate-100">Model Architecture</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Random Forest Estimator & Decision Weights
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-semibold">
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                  <Award className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-slate-200 text-sm">Algorithm Model</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Ensemble classifier utilizing bootstrapped decision trees to avoid overfitting and capture complex non-linear parameter boundaries.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-900/50 border border-slate-850">
                  <Database className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-slate-200 text-sm">Dataset Scope</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Trained on 1,048,575 water samples from 6 merged databases, optimizing metrics check precision for real-world scenarios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Importance Recharts Horizontal Bar Chart - Enlarged */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 flex flex-col h-[220px]">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Relative Parameter Decision Weight (%)
                </h4>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={data}
                      margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#f8fafc"
                        }}
                        formatter={(value) => [`${value}%`, "Weight"]}
                      />
                      <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={10}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutModel;
