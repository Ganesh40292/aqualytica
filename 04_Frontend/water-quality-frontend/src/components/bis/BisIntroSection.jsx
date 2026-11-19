import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * Section 2: Small & Clear Introduction to BIS Standards
 * Optimized with bold, comfortable font sizes for high legibility.
 */
const BisIntroSection = () => {
  return (
    <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Section Header */}
      <div className="flex items-center gap-3.5">
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shadow-md">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400 block">
            REGULATORY FOUNDATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Introduction to BIS Standards
          </h2>
        </div>
      </div>

      {/* Plain Language Explanatory Content */}
      <div className="space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed">
        <p>
          The <strong className="text-white font-bold">Bureau of Indian Standards (BIS)</strong> is 
          the National Standards Body of India working under the Government of India. 
          Its main duty is to formulate clear quality, safety, and health standards for products and utilities nationwide.
        </p>
        <p>
          For drinking water, BIS published the standard <strong className="text-cyan-300 font-bold">IS 10500</strong>. 
          This standard outlines acceptable limits for physical, chemical, and biological characteristics to ensure that 
          water supplied for human consumption is pure, safe, and free from diseases or toxins.
        </p>
      </div>

      {/* Two Threshold Limits Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Acceptable Limit Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/60 border border-emerald-900/40 border-l-4 border-l-emerald-500 shadow-lg space-y-3.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-black text-emerald-300 uppercase tracking-wide">
              1. Acceptable Limit (Target Benchmark)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            This is the standard recommended limit. Water that stays within this threshold is completely safe, 
            palatable, and suitable for regular, long-term drinking without any negative health effects.
          </p>
        </div>

        {/* Permissible Limit Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/60 border border-amber-900/40 border-l-4 border-l-amber-500 shadow-lg space-y-3.5">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
              2. Permissible Limit (No Alternative Source)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            This is a temporary relaxed limit allowed <em>only</em> if no alternative potable water source is available. 
            If any parameter exceeds this permissible limit, the water is legally considered unsafe for direct drinking.
          </p>
        </div>
      </div>

      {/* Real-time Hardware Relevance Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <span>
          In the <strong className="text-white font-bold">Aqualytica</strong> project, our physical ESP32 sensors continuously screen 
          these physical-chemical limits in real time so deviations can be identified instantly.
        </span>
      </div>
    </section>
  );
};

export default BisIntroSection;
