import { BookOpen, ShieldCheck, Brain, Network, Activity, Info, Layers } from "lucide-react";
import { BIS_PARAMETERS } from "../../constants/bisStandardsConfig";

/**
 * Section D: BIS PARAMETER CARDS & MULTI-TIER INTELLIGENCE ARCHITECTURE
 * Provides detailed educational summaries of parameter chemistry, limits,
 * relaxation conditions, and separates BIS evaluation from ML classification.
 * High-readability white laboratory style with backend telemetry accents.
 */
const BisParameterReferenceCards = () => {
  const params = [
    {
      ...BIS_PARAMETERS.ph,
      accentBorder: "border-t-4 border-t-cyan-500",
      accentTag: "bg-cyan-50 text-cyan-800 border-cyan-200"
    },
    {
      ...BIS_PARAMETERS.turbidity,
      accentBorder: "border-t-4 border-t-teal-500",
      accentTag: "bg-teal-50 text-teal-800 border-teal-200"
    },
    {
      ...BIS_PARAMETERS.totalDissolvedSolids,
      accentBorder: "border-t-4 border-t-blue-500",
      accentTag: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      ...BIS_PARAMETERS.conductivity,
      accentBorder: "border-t-4 border-t-emerald-500",
      accentTag: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      ...BIS_PARAMETERS.temperature,
      accentBorder: "border-t-4 border-t-rose-500",
      accentTag: "bg-rose-50 text-rose-800 border-rose-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Parameter Cards Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
            Chemical Profiles & Sensory Impacts
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            MONITORED PARAMETER SPECIFICATIONS & HEALTH SIGNIFICANCE
          </h3>
        </div>
      </div>

      {/* Grid of 5 In-Depth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {params.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-slate-200/90 ${p.accentBorder} rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-300`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${p.accentTag}`}>
                  {p.sensorPin}
                </span>
                <span className="font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200/60">
                  {p.unit}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 pt-0.5">{p.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {p.description}
              </p>
            </div>

            {/* Threshold Block */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Acceptable Limit:</span>
                <span className="font-black text-slate-900 text-right">{p.acceptableLimit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Permissible Limit:</span>
                <span className="font-black text-slate-900 text-right">{p.permissibleLimit}</span>
              </div>
              {p.referenceCondition && (
                <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/60 font-medium">
                  Reference: {p.referenceCondition}
                </div>
              )}
            </div>

            {/* Health and Relaxation Notes */}
            <div className="space-y-2.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3 font-medium">
              <div>
                <strong className="text-slate-800 block text-[11px] font-black">Health & Sensory Impact:</strong>
                <p className="text-slate-500 mt-0.5 leading-relaxed">{p.healthSignificance}</p>
              </div>
              <div>
                <strong className="text-slate-800 block text-[11px] font-black">Relaxation & Standard Note:</strong>
                <p className="text-slate-500 mt-0.5 leading-relaxed">{p.relaxationNote}</p>
              </div>
              {p.unitEquivalenceNote && (
                <div className="p-2 rounded-lg bg-sky-50/80 border border-sky-100 text-[10px] text-sky-900 italic font-medium">
                  {p.unitEquivalenceNote}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MULTI-TIER INTELLIGENCE ARCHITECTURE CARD (STRICT SEPARATION) ═══ */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            <Layers className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Architectural Separation & System Integrity
            </span>
            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              INDEPENDENT INTELLIGENCE TIERS: REGULATORY STANDARDS VS. MACHINE LEARNING
            </h4>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          AQUALYTICA maintains strict functional, algorithmic, and statistical separation between statutory standard evaluations, supervised predictive classification, unsupervised anomaly detection, and deterministic physical sensor guards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Layer 1: BIS Evaluation */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5 text-xs flex flex-col justify-between hover:bg-emerald-50/70 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-black">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>1. BIS Evaluation</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                Deterministic comparison of individual physical-chemical metrics against official Bureau of Indian Standards (BIS IS 10500:2012) acceptable and permissible limits.
              </p>
            </div>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-black self-start">
              Deterministic Limits
            </span>
          </div>

          {/* Layer 2: Random Forest ML */}
          <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-200/80 space-y-2.5 text-xs flex flex-col justify-between hover:bg-sky-50/70 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sky-800 font-black">
                <Brain className="w-4 h-4 shrink-0 text-sky-600" />
                <span>2. Random Forest ML</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                Supervised machine learning ensemble (100 decision trees) trained on empirical water parameter distributions to classify multi-parameter water characteristics.
              </p>
            </div>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-black self-start">
              Supervised Classifier
            </span>
          </div>

          {/* Layer 3: Isolation Forest */}
          <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/80 space-y-2.5 text-xs flex flex-col justify-between hover:bg-purple-50/70 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-purple-800 font-black">
                <Network className="w-4 h-4 shrink-0 text-purple-600" />
                <span>3. Isolation Forest</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                Unsupervised anomaly detection algorithm that isolates multidimensional feature space outliers and atypical parameter combinations across the dataset distribution.
              </p>
            </div>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-black self-start">
              Unsupervised Outliers
            </span>
          </div>

          {/* Layer 4: Physical Sensor Validation */}
          <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-2.5 text-xs flex flex-col justify-between hover:bg-amber-50/70 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800 font-black">
                <Activity className="w-4 h-4 shrink-0 text-amber-600" />
                <span>4. Physical Guardrails</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                Deterministic firmware validation (DS18B20 -127°C disconnect, TDS ADC 2789 saturation) and backend plausibility bounds protecting ML from corrupted telemetry.
              </p>
            </div>
            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-black self-start">
              Firmware Hardware Bounds
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-medium">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-900">Methodology Distinction:</strong> A water sample may be within BIS acceptable limits yet flagged as an anomaly due to rapid drift or atypical multidimensional correlation. Conversely, a sample can exceed a BIS acceptable limit while conforming to a non-anomalous distribution. Machine learning results represent statistical approximations and do not constitute drinking-water safety certification.
          </span>
        </div>
      </div>
    </div>
  );
};

export default BisParameterReferenceCards;