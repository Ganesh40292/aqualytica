import { ExternalLink, Award, Info } from "lucide-react";
import { BIS_STANDARD_META } from "../../constants/bisStandardsConfig";

/**
 * Concise Official Standard Reference & Scope Note
 * Clear, direct, zero speculative claims in dark glassmorphism.
 */
const BisDisclaimerCard = () => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-cyan-400 shadow-md shrink-0 mt-0.5">
          <Award className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              OFFICIAL REFERENCE
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-xs font-bold text-slate-400 font-mono">
              {BIS_STANDARD_META.standardNumber}
            </span>
          </div>
          <h4 className="text-base font-black text-white">
            Bureau of Indian Standards: Drinking Water Specification (IS 10500:2012, Second Revision)
          </h4>
          <p className="text-xs text-slate-300 flex items-center gap-2 pt-0.5 leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Real-time monitoring covers physical-chemical parameters. Complete potability verification requires statutory laboratory testing for microbiological and chemical toxins.
            </span>
          </p>
        </div>
      </div>

      <a
        href={BIS_STANDARD_META.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-teal-600/30 hover:from-cyan-600/50 hover:to-teal-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 self-start sm:self-auto shadow-[0_0_15px_rgba(6,182,212,0.15)]"
      >
        <span>View on Official BIS Portal</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

export default BisDisclaimerCard;