import { useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ShieldAlert, Sparkles, Filter, FlaskConical } from "lucide-react";

const Handbook = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const sections = [
    {
      id: "ph",
      title: "pH Level Concentration",
      subtitle: "Hydrogen-ion activity & acidic/alkaline balance",
      icon: FlaskConical,
      color: "text-cyan-400 bg-cyan-950/20 border-cyan-900/30",
      optimal: "6.50 – 8.50 pH (WHO standard)",
      danger: "pH < 6.0 (Highly acidic) or pH > 9.0 (Highly alkaline)",
      content: "pH is a log scale measure of hydrogen ion activity in water. Water with low pH (acidic) leaches heavy metals like lead and copper from plumbing systems, presenting high toxic risks to organs. Water with high pH (alkaline) has a slippery feel, bitter soda taste, and causes scale accumulation in boilers and pipes. Alkaline water also compromises the efficacy of chlorine disinfection."
    },
    {
      id: "turbidity",
      title: "Turbidity Index",
      subtitle: "Water clarity, suspended solids, and cloudiness",
      icon: Filter,
      color: "text-teal-400 bg-teal-950/20 border-teal-900/30",
      optimal: "< 1.00 NTU (Target) / < 5.00 NTU (Allowable)",
      danger: "Turbidity > 5.00 NTU (High suspension)",
      content: "Turbidity is the measure of relative clarity of a liquid, caused by suspended matter such as clay, silt, fine organic matter, and microscopic organisms. High turbidity protects bacteria from disinfection agents, serves as a breeding ground for pathogens, and is strongly associated with gastrointestinal outbreaks. Treatment requires coagulation, sand filtration, or cartridge filters."
    },
    {
      id: "tds",
      title: "Total Dissolved Solids (TDS)",
      subtitle: "Dissolved inorganic salts, calcium, and minerals",
      icon: ShieldAlert,
      color: "text-blue-400 bg-blue-950/20 border-blue-900/30",
      optimal: "< 500 mg/L (WHO limit)",
      danger: "TDS > 1000 mg/L (High saturation / saline)",
      content: "TDS represents the total concentration of dissolved substances in water, primarily calcium, magnesium, sodium, bicarbonates, and sulfate minerals. While low TDS water can taste flat, extremely high TDS causes mineral taste, scales pipes, stains fixtures, and can cause laxative effects in sensitive populations. Best neutralized via Reverse Osmosis (RO) filtration systems."
    },
    {
      id: "ml",
      title: "How does the Aqualytica AI Predict Water Safety?",
      subtitle: "Random Forest Classifier model architecture details",
      icon: Sparkles,
      color: "text-purple-400 bg-purple-950/20 border-purple-900/30",
      optimal: "Confidence > 80% (High probability classifications)",
      danger: "Confidence < 60% (Marginal thresholds)",
      content: "Aqualytica uses a Python-trained Random Forest Classifier model. The algorithm processes 5 core physical and chemical parameters (pH, Temperature, Turbidity, Total Dissolved Solids, and Electrical Conductivity) across 10,000 stratified samples. By building an ensemble of 150 decision trees, it determines the probability of potability. A verdict is Approved Potable only when the cumulative confidence score surpasses the default 50% threshold."
    }
  ];

  return (
    <PageWrapper className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
          <BookOpen className="w-5 h-5 text-cyan-450" />
        </div>
        <div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider leading-none">
            Aqualytica Reference Encyclopedia
          </h2>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-widest mt-1">
            Water Safety Handbook
          </h1>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-4xl">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = activeAccordion === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300 shadow-xl"
            >
              {/* Header trigger */}
              <button
                onClick={() => setActiveAccordion(isOpen ? null : sec.id)}
                className="w-full p-6 flex justify-between items-center text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border shrink-0 ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{sec.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{sec.subtitle}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-450"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              {/* Collapsible panel content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="border-t border-slate-850/60"
                  >
                    <div className="p-6 bg-slate-950/20 space-y-4">
                      {/* Critical Threshold Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/20">
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">Optimal Safety standard</span>
                          <span className="text-xs font-bold text-slate-205 mt-1 block">{sec.optimal}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/20">
                          <span className="text-[9px] font-black text-rose-550 uppercase tracking-widest block">Anomalous / Danger range</span>
                          <span className="text-xs font-bold text-slate-205 mt-1 block">{sec.danger}</span>
                        </div>
                      </div>

                      {/* Explanation Body */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Description</h4>
                        <p className="text-xs text-slate-350 leading-relaxed font-medium">
                          {sec.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default Handbook;
