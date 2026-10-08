import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal, Info } from "lucide-react";
import { predictWaterQuality } from "../../services/predictionService";
import { sensorFields } from "../../constants/sensorFields";
import { useToast } from "../../context/ToastContext";
import PredictionResult from "./PredictionResult";
import PredictionWorkflow from "./PredictionWorkflow";
import LoadingSpinner from "../common/LoadingSpinner";
import { playSplashChime, playWarningChime } from "../../utils/audioHelper";

function PredictionForm({ onPredictionSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    ph: "",
    temperature: "",
    turbidity: "",
    totalDissolvedSolids: "",
    conductivity: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [errors, setErrors] = useState({});

  const rangeInfo = {
    ph: "Model Safe Range: 6.8 - 7.6 pH (Ideal ~7.2)",
    temperature: "Model Safe Range: 15.0 - 25.0 °C (Ideal ~20°C)",
    turbidity: "Model Safe Range: < 1.0 NTU (Critical for Potable)",
    totalDissolvedSolids: "Model Safe Range: < 250 mg/L (Critical for Potable)",
    conductivity: "Model Safe Range: < 400 µS/cm (Critical for Potable)"
  };

  const validateField = (name, value) => {
    const field = sensorFields.find((f) => f.name === name);
    if (!field) return "";
    
    if (value === "") return "This field is required";
    const num = Number(value);
    
    if (num < field.min) return `Minimum value is ${field.min}`;
    if (num > field.max) return `Maximum value is ${field.max}`;
    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData((previous) => ({
      ...previous,
      [name]: value === "" ? "" : Number(value)
    }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  const handleWorkflowComplete = useCallback(() => {
    if (pendingResult) {
      setResult(pendingResult);
      
      // Trigger status audio verification chimes
      const isPotable = pendingResult.prediction?.toLowerCase() === "potable";
      if (isPotable) {
        playSplashChime();
      } else {
        playWarningChime();
      }

      setPendingResult(null);
      setShowWorkflow(false);
      setLoading(false);
    }
  }, [pendingResult]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newErrors = {};
    let hasErrors = false;
    
    sensorFields.forEach((field) => {
      const val = formData[field.name];
      const errorMsg = validateField(field.name, val);
      if (errorMsg) {
        newErrors[field.name] = errorMsg;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      toast.showWarning("Please fix parameter validation errors first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setShowWorkflow(true);
    setProcessingTime(null);

    const startTime = performance.now();

    try {
      const prediction = await predictWaterQuality(formData);
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setProcessingTime(elapsed);
      setPendingResult(prediction);
      toast.showSuccess("Water sample analysis completed.");

      if (onPredictionSuccess) {
        await onPredictionSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.showError("Analysis failed. Verify API server connection.");
      setShowWorkflow(false);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="mt-2">
      <div className="bg-slate-900/20 backdrop-blur-3xl border border-slate-800/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-cyan-400">
              <SlidersHorizontal className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                Water Sample Analysis
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Enter sample parameters for safety evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ph: 7.2,
                  temperature: 20.0,
                  turbidity: 0.3,
                  totalDissolvedSolids: 180.0,
                  conductivity: 300.0
                });
                setErrors({});
                toast.showSuccess("Loaded Safe Drinking Water Preset");
              }}
              className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Safe Preset
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ph: 4.5,
                  temperature: 32.0,
                  turbidity: 8.5,
                  totalDissolvedSolids: 1200.0,
                  conductivity: 1800.0
                });
                setErrors({});
                toast.showWarning("Loaded Contaminated Water Preset");
              }}
              className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" /> Unsafe Preset
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quick Model Guidance Notice */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Model Decision Boundary Guidance:</span>
              <p className="text-slate-300 mt-1">
                Random Forest evaluates multi-feature combinations. For a guaranteed <b>Potable</b> outcome, click <b className="text-emerald-400">Safe Preset</b> or ensure <b>Turbidity &lt; 1.0 NTU</b>, <b>TDS &lt; 250 mg/L</b>, and <b>Conductivity &lt; 400 µS/cm</b>.
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6"
          >
            {sensorFields.map((field) => {
              const Icon = field.icon;
              const hasError = !!errors[field.name];

              return (
                <motion.div
                  key={field.name}
                  variants={itemVariants}
                  className="flex flex-col gap-2 p-5 rounded-xl bg-slate-955/40 border border-slate-850/60 focus-within:border-cyan-500/30 transition-all duration-300 shadow-sm"
                >
                  <label className="text-xs font-bold text-slate-350 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Icon className="w-4.5 h-4.5 text-cyan-400" />
                      {field.label}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-950/60 border border-slate-800/60 rounded px-2.5 py-0.5">
                      {field.unit}
                    </span>
                  </label>

                  {/* Restrict input box maximum width to keep it short (max-w-md) while card container fills the page */}
                  <div className="relative flex items-center mt-2 w-full max-w-md">
                    <input
                      type="number"
                      step={field.step}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-955/85 border rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 transition-all text-sm font-semibold ${
                        hasError
                          ? "border-red-500/50 focus:ring-red-500/10"
                          : "border-slate-800/80 focus:border-cyan-500/40 focus:ring-cyan-500/5"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1 mt-2 text-[11px] font-semibold">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Info size={12} className="text-slate-600 shrink-0" />
                      {rangeInfo[field.name]}
                    </span>
                    {hasError && (
                      <span className="font-bold text-red-450 mt-0.5">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="flex justify-center mt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-12 py-4.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 border border-cyan-400/40 disabled:bg-slate-800 disabled:text-slate-500 text-slate-100 font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(6,182,212,0.25)] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="w-5 h-5" />
                  <span>Analyzing Water Sample...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse text-cyan-200" />
                  <span>Analyze Sample Potability</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* AI Processing Workflow Animation (Feature 3) */}
      <AnimatePresence>
        {showWorkflow && (
          <PredictionWorkflow isActive={showWorkflow} onComplete={handleWorkflowComplete} />
        )}
      </AnimatePresence>

      {/* Prediction Result display Section */}
      <PredictionResult result={result} parameters={formData} processingTime={processingTime} />
    </div>
  );
}

export default PredictionForm;