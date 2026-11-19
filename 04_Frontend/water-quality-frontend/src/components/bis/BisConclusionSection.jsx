import { Award, ExternalLink, CheckCircle2, ShieldAlert } from "lucide-react";
import { BIS_STANDARD_META } from "../../constants/bisStandardsConfig";

/**
 * Section 5: Conclusion & Practical Summary
 * Clear summary with bold, comfortable typography.
 */
const BisConclusionSection = () => {
  return (
    <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Section Header */}
      <div className="flex items-center gap-3.5">
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shadow-md">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400 block">
            SUMMARY & PRACTICAL TAKEAWAY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Conclusion & Evaluation Takeaway
          </h2>
        </div>
      </div>

      {/* 3 Clear Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>Statutory Benchmark</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Official Indian Standard
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            BIS IS 10500:2012 is the primary regulatory standard for drinking water across India. 
            All municipal and rural supply networks evaluate against these acceptable and permissible limits.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>Continuous Early Warning</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Real-Time IoT Screening
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            While laboratory water tests can take days, our ESP32 IoT hardware continuously measures 
            physical-chemical parameters in real time, detecting contamination spikes the moment they happen.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Technical Accuracy</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Sensor vs Laboratory Scope
          </h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            Our sensors screen key physical parameters (pH, Turbidity, TDS, Temp, EC). Complete certification 
            of drinking water also includes periodic lab testing for microbiological bacteria (e.g. E. coli).
          </p>
        </div>
      </div>

      {/* Official Citation and Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
            OFFICIAL GOVERNMENT DOCUMENTATION
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-200">
            Bureau of Indian Standards — Drinking Water Specification IS 10500:2012
          </span>
        </div>

        <a
          href={BIS_STANDARD_META.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-teal-600/30 hover:from-cyan-600/50 hover:to-teal-600/50 text-cyan-200 border border-cyan-500/40 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shrink-0 self-start sm:self-auto shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <span>View on Official BIS Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default BisConclusionSection;
