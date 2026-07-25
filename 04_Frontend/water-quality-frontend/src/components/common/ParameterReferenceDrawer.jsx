import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, AlertTriangle, HelpCircle, Activity } from "lucide-react";

const parameterGuides = {
  ph: {
    name: "Potential of Hydrogen (pH)",
    safeRange: "6.5 - 8.5 pH",
    unit: "pH",
    causes: "Industrial runoffs, chemical waste disposal, organic decay, or acid rain leaching.",
    treatments: "Soda ash (sodium carbonate) injection or calcite/corosex neutralizing filters.",
    impact: "Corrosive to copper/lead plumbing, bitter metallic taste, and skin irritation."
  },
  turbidity: {
    name: "Turbidity (Clarity Index)",
    safeRange: "< 5.0 NTU (Recommended < 1.0)",
    unit: "NTU",
    causes: "Soil erosion, clay suspensions, active algae blooms, or urban storm runoffs.",
    treatments: "Coagulation-sedimentation tanks, media sand filters, or micro-filtration units.",
    impact: "Shields pathogenic bacteria from chlorine/UV disinfection, causing gastrointestinal risks."
  },
  totalDissolvedSolids: {
    name: "Total Dissolved Solids (TDS)",
    safeRange: "< 500 mg/L",
    unit: "mg/L",
    causes: "Mineral springs leaching, agricultural fertilizers, sewage, or road de-icing salts.",
    treatments: "Reverse osmosis (RO) membranes, distillation systems, or deionization resins.",
    impact: "Causes scale buildup in pipes and household boilers, salty/brackish taste, and hard water."
  },
  conductivity: {
    name: "Electrical Conductivity (EC)",
    safeRange: "< 1,000 µS/cm",
    unit: "µS/cm",
    causes: "Dissolved inorganic salts, sewer spillages, mining discharge, or marine incursions.",
    treatments: "Reverse osmosis, demineralizers, or ion exchange filtration.",
    impact: "Highly corrosive to copper pipes, stunts plant growth in irrigation, and alters taste."
  },
  temperature: {
    name: "Water Temperature",
    safeRange: "20.0°C - 30.0°C",
    unit: "°C",
    causes: "Solar radiation, power plant cooling effluents, or seasonal heating anomalies.",
    treatments: "Thermal cooling reservoirs, aerated tanks, or shaded storage systems.",
    impact: "Alters dissolution of gases (lowers dissolved oxygen), accelerates biological growth."
  },
  nitrate: {
    name: "Nitrate Concentration",
    safeRange: "< 10.0 mg/L",
    unit: "mg/L",
    causes: "Septic tank leakages, animal waste, synthetic fertilizer runoffs, or agricultural wastes.",
    treatments: "Anion exchange systems, reverse osmosis, or electrodialysis filters.",
    impact: "Triggers 'Blue Baby Syndrome' (methemoglobinemia) in infants, locking blood oxygen transport."
  },
  chloride: {
    name: "Chloride Concentration",
    safeRange: "< 250 mg/L",
    unit: "mg/L",
    causes: "Road salts, wastewater treatment outfall, agricultural runoff, or mineral leaching.",
    treatments: "Reverse osmosis systems or thermal distillation filters.",
    impact: "Corrodes structural concrete/metal, damages plant roots, and imparts a heavy metallic taste."
  }
};

const ParameterReferenceDrawer = () => {
  const [selectedParam, setSelectedParam] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      const paramKey = e.detail?.toLowerCase().replace(/\s+/g, "");
      // Map standard names to guide keys
      let key = "ph";
      if (paramKey.includes("ph")) key = "ph";
      else if (paramKey.includes("turbidity")) key = "turbidity";
      else if (paramKey.includes("tds") || paramKey.includes("dissolved")) key = "totalDissolvedSolids";
      else if (paramKey.includes("cond") || paramKey.includes("elect")) key = "conductivity";
      else if (paramKey.includes("temp")) key = "temperature";
      else if (paramKey.includes("nitrate")) key = "nitrate";
      else if (paramKey.includes("chloride")) key = "chloride";
      
      setSelectedParam(parameterGuides[key]);
      setIsOpen(true);
    };

    window.addEventListener("open-parameter-drawer", handleOpen);
    return () => window.removeEventListener("open-parameter-drawer", handleOpen);
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && selectedParam && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-slate-950 z-[990] cursor-pointer"
          />

          {/* Sliding drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900/95 backdrop-blur-3xl border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[999] p-8 flex flex-col justify-between overflow-y-auto select-none"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">Parameter Handbook</h3>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl bg-slate-950/60 border border-slate-850 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Title / Name */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-200 tracking-tight leading-snug">{selectedParam.name}</h2>
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  EPA Guideline
                </span>
              </div>

              {/* Safe Threshold Details */}
              <div className="p-5 rounded-2xl bg-cyan-950/10 border border-cyan-900/20 space-y-2 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-cyan-455 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-350 leading-none">Safe Range Limit</h4>
                  <p className="text-lg font-black text-cyan-400 mt-1">{selectedParam.safeRange}</p>
                </div>
              </div>

              {/* Common Causes */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-955/20 border border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 leading-none">
                  <HelpCircle size={13} className="text-purple-400" /> Typical Causes
                </h4>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{selectedParam.causes}</p>
              </div>

              {/* Environmental/Health Impacts */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-955/20 border border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 leading-none">
                  <AlertTriangle size={13} className="text-red-400" /> Potential Health Risks
                </h4>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{selectedParam.impact}</p>
              </div>
            </div>

            {/* Standard Treatment recommendations */}
            <div className="border-t border-slate-800 pt-6 mt-8 space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-450 leading-none">Recommended Treatment</h4>
              <p className="text-xs text-slate-400 font-semibold leading-normal">{selectedParam.treatments}</p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ParameterReferenceDrawer;
