import { motion } from "framer-motion";
import { Brain, Database, ShieldCheck, Activity } from "lucide-react";

const metrics = [
  { label: "Training Accuracy", value: "98.2%", color: "text-green-400", barColor: "bg-green-500" },
  { label: "Testing Accuracy", value: "95.8%", color: "text-cyan-400", barColor: "bg-cyan-500" },
  { label: "Precision Score", value: "96.1%", color: "text-teal-400", barColor: "bg-teal-500" },
  { label: "Recall Score", value: "95.4%", color: "text-purple-400", barColor: "bg-purple-500" },
  { label: "F1-Score Profile", value: "95.7%", color: "text-indigo-400", barColor: "bg-indigo-500" },
  { label: "ROC-AUC Consensus", value: "98.9%", color: "text-yellow-400", barColor: "bg-yellow-500" }
];

function ModelInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-6 hover:border-cyan-500/20 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-green-950/30 border border-green-800/30 text-green-400 animate-pulse">
          <Brain className="w-6.5 h-6.5 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-100">Random Forest Classifier Specifications</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Machine Learning Engine Diagnostics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* ML Performance Metrics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-green-400" /> Statistical Benchmarks
          </h4>
          <div className="space-y-3.5">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">{metric.label}</span>
                  <span className={metric.color}>{metric.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 border border-slate-905 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.barColor}`}
                    style={{ width: metric.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Meta Information */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-cyan-400" /> Metadata Parameters
            </h4>
            <div className="grid grid-cols-2 gap-3.5 text-xs font-bold text-slate-350">
              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Model Classifier</span>
                <span className="text-slate-200">Random Forest</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Training Samples</span>
                <span className="text-slate-200">1,048,575</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Input Features</span>
                <span className="text-slate-200">7 Features</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-900/60">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Model Version</span>
                <span className="text-slate-200">v2.1.0 (Inference)</span>
              </div>
            </div>
          </div>

          <div className="p-4.5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
            <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Why Random Forest Classifier?
            </span>
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              Selected for its robustness against sensor noise, ability to model non-linear boundaries across diverse indicators, and prevention of overfitting through multi-tree aggregation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ModelInfoCard;
