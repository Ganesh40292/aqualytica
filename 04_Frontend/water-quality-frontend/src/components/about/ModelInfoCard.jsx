import { motion } from "framer-motion";
import { Brain, ShieldCheck, Activity, BarChart2, Zap } from "lucide-react";

// Grounded directly from official Model_Evaluation_Report.csv & Full_Algorithm_Comparison.csv
const verifiedMetrics = [
  { label: "Testing Accuracy", value: "82.60%", num: 82.60, color: "text-cyan-400", barColor: "bg-cyan-500", note: "Comparative benchmark: 85.80%" },
  { label: "Precision Score", value: "89.06%", num: 89.06, color: "text-green-400", barColor: "bg-green-500", note: "Positive predictive value" },
  { label: "Recall / Sensitivity", value: "88.36%", num: 88.36, color: "text-teal-400", barColor: "bg-teal-500", note: "True positive rate" },
  { label: "F1-Score Harmonic Mean", value: "88.71%", num: 88.71, color: "text-purple-400", barColor: "bg-purple-500", note: "Balanced precision & recall" },
  { label: "ROC-AUC Discriminator", value: "76.46%", num: 76.46, color: "text-yellow-400", barColor: "bg-yellow-500", note: "Area under ROC curve" },
];

// Grounded directly from fitted Water_Potability_RF_Model.pkl (feature_importances_)
const featureWeights = [
  { name: "pH Level", weight: 57.14, color: "bg-cyan-400", textCol: "text-cyan-400", desc: "Primary chemical acidity/alkalinity indicator" },
  { name: "Temperature (°C)", weight: 23.29, color: "bg-rose-400", textCol: "text-rose-400", desc: "Thermal state & dissociation kinetics" },
  { name: "Turbidity (NTU)", weight: 9.73, color: "bg-amber-400", textCol: "text-amber-400", desc: "Colloidal & particulate suspension density" },
  { name: "Total Dissolved Solids", weight: 5.99, color: "bg-blue-400", textCol: "text-blue-400", desc: "Dissolved mineral & inorganic salts density" },
  { name: "Estimated Conductivity", weight: 3.86, color: "bg-indigo-400", textCol: "text-indigo-400", desc: "Calculated ionic mobility (TDS × 2.0)" },
];

function ModelInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-8 hover:border-cyan-500/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
            <Brain className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-100">Random Forest Classifier Architecture</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              Verified Machine Learning Metrics & Explainability Weights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-850 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-400">Inference Latency:</span>
          <span className="text-yellow-400 font-bold">0.03 ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ML Performance Metrics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Grounded Evaluation Benchmarks
          </h4>
          <div className="space-y-3">
            {verifiedMetrics.map((metric) => (
              <div key={metric.label} className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/80 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{metric.label}</span>
                  <span className={`${metric.color} font-mono`}>{metric.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.barColor}`}
                    style={{ width: `${metric.num}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">{metric.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Importance & Model Explainability */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Model Feature Importances (Gini Impurity)
          </h4>
          <div className="space-y-2.5">
            {featureWeights.map((f) => (
              <div key={f.name} className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/80 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-200">{f.name}</span>
                  <span className={`${f.textCol} font-mono`}>{f.weight}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${f.color}`}
                    style={{ width: `${f.weight}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Metadata Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Classifier Engine</span>
          <span className="text-xs font-bold text-slate-200">Random Forest</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Ensemble Size</span>
          <span className="text-xs font-bold text-slate-200">100 Decision Trees</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Feature Dimension</span>
          <span className="text-xs font-bold text-slate-200">5-Vector Standardized</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-1">Feature Scaler</span>
          <span className="text-xs font-bold text-slate-200">StandardScaler (Z-Score)</span>
        </div>
      </div>

      {/* Architectural Rationale */}
      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-1.5">
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Why Random Forest for IoT Water Potability?
        </span>
        <p className="text-xs text-slate-400 leading-relaxed">
          Random Forest combines multiple decorrelated decision trees using bagging and random feature subsampling. This makes it highly resilient to electromagnetic sensor jitter from ADC probes, resistant to multicollinearity between TDS and conductivity, and fast enough to execute inference in 0.03 milliseconds.
        </p>
      </div>
    </motion.div>
  );
}

export default ModelInfoCard;
