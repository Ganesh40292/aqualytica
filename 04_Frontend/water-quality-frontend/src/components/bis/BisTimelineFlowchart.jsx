import { History, ArrowRight, ArrowDown, Calendar, CheckCircle } from "lucide-react";

/**
 * Section 3: Flowchart of Standards Evolution (1983 to Present)
 * Visual flowchart with larger typography and clear phase progression.
 */
const BisTimelineFlowchart = () => {
  const steps = [
    {
      year: "1983",
      title: "First Standard Formulated",
      subtitle: "IS 10500:1983",
      status: "Initial Baseline",
      description:
        "The first unified national drinking water standard formulated by the Indian Standards Institution (ISI, later renamed BIS) to establish uniform quality guidelines across India.",
      highlight: false
    },
    {
      year: "1991",
      title: "First Major Revision",
      subtitle: "IS 10500:1991",
      status: "Global Harmonization",
      description:
        "Updated to align with World Health Organization (WHO) international drinking water guidelines. Introduced the two-tier structure: 'Desirable Limit' and 'Permissible Limit'.",
      highlight: false
    },
    {
      year: "2012",
      title: "Second Revision (Current)",
      subtitle: "IS 10500:2012",
      status: "Active Statutory Standard",
      description:
        "Comprehensive overhaul setting strict Acceptable Limits and Permissible Limits. This is the official statutory benchmark evaluated by our Aqualytica monitoring system.",
      highlight: true
    },
    {
      year: "Present Day",
      title: "Amendments & National Adoption",
      subtitle: "Active Implementation",
      status: "Mandatory Testing",
      description:
        "Enforced nationwide by the Ministry of Jal Shakti (Jal Jeevan Mission) with official amendments (2018, 2021) for mandatory testing of household piped water supplies.",
      highlight: false
    }
  ];

  return (
    <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Section Header */}
      <div className="flex items-center gap-3.5">
        <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shadow-md">
          <History className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400 block">
            HISTORICAL EVOLUTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Evolution of BIS Drinking Water Standards (1983 – Present)
          </h2>
        </div>
      </div>

      <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
        The Indian Drinking Water Standard has evolved over four decades to reflect advancing water science, 
        improved sensor technology, and public health requirements:
      </p>

      {/* Flowchart Container (Horizontal on Desktop, Vertical on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 relative pt-2">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="relative flex flex-col justify-between">
              {/* Step Card */}
              <div
                className={`p-6 sm:p-7 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between h-full space-y-4 ${
                  step.highlight
                    ? "bg-slate-950/80 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700 shadow-lg"
                }`}
              >
                {/* Card Header: Year Badge & Phase */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-cyan-300 font-mono text-xs sm:text-sm font-black">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{step.year}</span>
                  </div>

                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    step.highlight
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}>
                    Step 0{idx + 1}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {step.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-mono font-bold text-cyan-400 mt-1">
                    {step.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom Tag */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CheckCircle className={`w-4 h-4 ${step.highlight ? "text-cyan-400" : "text-slate-500"}`} />
                  <span className={step.highlight ? "text-cyan-200" : "text-slate-400"}>
                    {step.status}
                  </span>
                </div>
              </div>

              {/* Connecting Arrows between steps */}
              {!isLast && (
                <>
                  {/* Desktop Right Arrow */}
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-cyan-400 bg-slate-900 p-1.5 rounded-full border border-slate-700 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  {/* Mobile Down Arrow */}
                  <div className="flex lg:hidden justify-center my-2 text-cyan-400">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BisTimelineFlowchart;
