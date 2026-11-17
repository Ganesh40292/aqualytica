import { Cpu, Brain, AlertTriangle } from "lucide-react";

const AnomalyDetectionOverview = () => {
  return (
    <div className="bg-slate-900/30 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md uppercase tracking-wider">
          Dual-Layer Intelligence Architecture
        </span>
        <h4 className="text-lg font-bold text-slate-100 mt-1">
          Two-Tier Anomaly Detection & Sensor Integrity Defense
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          Aqualytica implements a defense-in-depth approach separating physical hardware fault detection from probabilistic potability classification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer 1: Rule-based Sensor Bounds Engine */}
        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-850 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-400">
              <Cpu size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tier 1 &bull; Deterministic Rules</span>
              <h5 className="text-sm font-bold text-slate-200">Physical Sensor Bound Safeguards</h5>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Executed in the Spring Boot backend prior to machine learning inference. Catches broken probe connections, voltage saturation, disconnected ground lines, and extreme physical hazards.
          </p>

          <div className="space-y-2 text-xs font-mono">
            {[
              { param: "pH Level", rule: "pH < 2.0  ||  pH > 12.0", fault: "Severe chemical corrosion or probe failure" },
              { param: "Temperature", rule: "Temp < 0.0°C  ||  Temp > 60.0°C", fault: "Freezing/scalding or DS18B20 disconnected (-127°C)" },
              { param: "Turbidity", rule: "Turbidity > 500.0 NTU", fault: "Optical sensor blockage or extreme sludge" },
              { param: "TDS Density", rule: "TDS > 2,500 mg/L", fault: "Electrode saturation or mineral brine overload" },
              { param: "Estimated EC", rule: "EC > 5,000 µS/cm", fault: "Excessive electrical conductivity threshold" }
            ].map((r) => (
              <div key={r.param} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="text-slate-200 font-bold">{r.param}</span>
                <span className="text-amber-300 font-semibold">{r.rule}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/30 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <span><strong>ML Guardrail:</strong> When a hardware probe fault is flagged (e.g. invalid temperature), model inference is bypassed to prevent skewed predictions, and the anomaly reason is permanently logged.</span>
          </div>
        </div>

        {/* Layer 2: Random Forest Multivariate Potability */}
        <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-850 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Brain size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Tier 2 &bull; Statistical AI</span>
              <h5 className="text-sm font-bold text-slate-200">Multivariate Decision Tree Voting</h5>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Executed in the Python Flask microservice using a 100-tree Random Forest classifier. Evaluates non-linear correlations across all 5 standardized features simultaneously.
          </p>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-medium">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-[11px] block">Standardized Z-Score Preprocessing</span>
              <p className="text-[11px]">
                Features are scaled using <code className="text-slate-200 font-mono">z = (x - µ) / σ</code> to prevent parameters with large magnitudes (such as TDS) from overpowering subtle pH and turbidity shifts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-green-400 font-bold text-[11px] block">Subtle Cross-Parameter Contamination</span>
              <p className="text-[11px]">
                Water that passes single-parameter checks (e.g. pH 6.6, Turbidity 4.8 NTU, TDS 490 ppm) may still be classified as <strong>Not Potable</strong> because the ensemble recognizes that simultaneous near-limit values indicate chemical runoff.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-purple-400 font-bold text-[11px] block">Confidence Probability Scoring</span>
              <p className="text-[11px]">
                Outputs the exact percentage of decision trees voting for the winning class, providing transparent probability measures for field analysts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetectionOverview;
