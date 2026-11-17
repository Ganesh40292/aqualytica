import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal, Info, Cpu, AlertTriangle, X, RotateCcw } from "lucide-react";
import { predictWaterQuality, triggerHardwareTest } from "../../services/predictionService";
import { sensorFields } from "../../constants/sensorFields";
import { useToast } from "../../context/ToastContext";
import PredictionResult from "./PredictionResult";
import PredictionWorkflow from "./PredictionWorkflow";
import HardwareTestResult from "./HardwareTestResult";
import LoadingSpinner from "../common/LoadingSpinner";
import { playSplashChime, playWarningChime } from "../../utils/audioHelper";

function PredictionForm({ onPredictionSuccess }) {
  const toast = useToast();

  // ==========================================
  // METHOD 1: MANUAL SAMPLE ANALYSIS STATE
  // ==========================================
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

  // ==========================================
  // METHOD 2: REAL-TIME IoT HARDWARE ANALYSIS STATE
  // (Maintained strictly independent of manual inputs)
  // ==========================================
  const [hardwareResult, setHardwareResult] = useState(null);
  const [hardwareLoading, setHardwareLoading] = useState(false);
  const [hardwareStatus, setHardwareStatus] = useState("");
  const [hardwareError, setHardwareError] = useState(null);

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

  // Handle Manual Form Submission (METHOD 1)
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

  // Handle On-Demand Physical Hardware Test (METHOD 2)
  const handleHardwareTest = async () => {
    if (hardwareLoading || loading) return;

    setHardwareLoading(true);
    setHardwareStatus("Connecting to hardware...");
    setHardwareError(null);

    // Dynamic phase indicator for responsive user feedback
    const timer = setTimeout(() => {
      setHardwareStatus("Acquiring calibrated sensor readings...");
    }, 2000);

    try {
      const response = await triggerHardwareTest();
      clearTimeout(timer);

      if (response && response.success && response.data) {
        setHardwareResult(response.data);
        setHardwareError(null);

        // Health audit and notification chimes
        if (response.data.isHardwareFault) {
          toast.showWarning(response.data.hardwareFaultReason || "Hardware fault: DS18B20 temperature probe disconnected.");
          playWarningChime();
        } else if (response.data.isAnomaly) {
          toast.showWarning(`Physical anomaly detected: ${response.data.anomalyReason}`);
          playWarningChime();
        } else {
          toast.showSuccess(response.message || "Hardware Reading Acquired and Classified Successfully");
          if (response.data.prediction?.toLowerCase() === "potable") {
            playSplashChime();
          } else {
            playWarningChime();
          }
        }

        if (onPredictionSuccess) {
          await onPredictionSuccess();
        }
      } else {
        throw new Error(response?.message || "Failed to acquire hardware telemetry.");
      }
    } catch (err) {
      clearTimeout(timer);

      let errorMsg = "Hardware acquisition failed. Verify backend and ESP32 connection.";
      if (err.response?.status === 409) {
        errorMsg = err.response?.data?.message || err.response?.data?.detail || "ESP32 hardware is currently busy executing another routine. Please retry shortly.";
      } else if (err.response?.status === 504) {
        errorMsg = "ESP32 hardware did not respond within the 10-second timeout window. Please ensure device is powered on and connected to hotspot.";
      } else if (err.response?.status === 429) {
        errorMsg = err.response?.data?.message || err.response?.data?.detail || "Rate limit reached. Please wait a moment before retriggering.";
      } else if (err.response?.status === 500) {
        const detail = err.response?.data?.message || err.response?.data?.detail;
        if (detail && typeof detail === "string") {
          errorMsg = detail;
        } else {
          errorMsg = "Hardware acquisition error occurred on ESP32/MQTT bridge. Please verify ESP32 is powered on and retry.";
        }
      } else if (err.response?.data?.message && typeof err.response.data.message === "string") {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.detail && typeof err.response.data.detail === "string") {
        errorMsg = err.response.data.detail;
      } else if (err.message && typeof err.message === "string" && !err.message.includes("status code")) {
        errorMsg = err.message;
      }

      console.warn("Hardware test notification:", errorMsg);
      setHardwareError(errorMsg);
      toast.showError(errorMsg);
    } finally {
      setHardwareLoading(false);
      setHardwareStatus("");
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

        {/* Header Section with Presets & Quick Hardware Trigger */}
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
                Enter sample parameters or trigger on-demand physical hardware measurement
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Hardware Action Header Pill */}
            <button
              type="button"
              onClick={handleHardwareTest}
              disabled={hardwareLoading || loading}
              className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              title="Trigger real-time measurement from ESP32 node"
            >
              <Cpu className={`w-3.5 h-3.5 ${hardwareLoading ? "animate-spin text-emerald-300" : ""}`} />
              <span>{hardwareLoading ? "Acquiring..." : "Trigger Hardware"}</span>
            </button>

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
              className="px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
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

        {/* Manual Parameter Input Form (METHOD 1) */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Model Guidance Notice */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Analysis Methods Available:</span>
              <p className="text-slate-300 mt-1">
                You can manually test water quality metrics using <b className="text-cyan-400">Analyze Sample Potability</b> below, or initiate a live acquisition from physical ESP32 sensors using <b className="text-emerald-400">Start Hardware Test</b>.
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >
            {sensorFields.map((field, idx) => {
              const Icon = field.icon;
              const hasError = !!errors[field.name];
              const isSpanFull = idx === sensorFields.length - 1; // 5th field (Conductivity) spans gracefully

              return (
                <motion.div
                  key={field.name}
                  variants={itemVariants}
                  className={`flex flex-col justify-between gap-3 p-5 rounded-2xl bg-slate-950/40 border border-slate-850/80 focus-within:border-cyan-500/40 transition-all duration-300 shadow-sm ${
                    isSpanFull ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      {field.label}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/40 rounded-md px-2 py-0.5 font-bold">
                      {field.unit}
                    </span>
                  </label>

                  <div className="relative flex items-center w-full">
                    <input
                      type="number"
                      step={field.step}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all text-sm font-semibold font-mono ${
                        hasError
                          ? "border-red-500/50 focus:ring-red-500/10"
                          : "border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/10"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-[11px] font-medium pt-1 border-t border-slate-900/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Info size={12} className="text-slate-500 shrink-0" />
                      {rangeInfo[field.name]}
                    </span>
                    {hasError && (
                      <span className="font-bold text-red-400 mt-0.5">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Hardware Error Notice Banner with Retry Action */}
          {hardwareError && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-300">Hardware Acquisition Notice:</span>
                  <p className="text-slate-300 mt-0.5">{hardwareError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleHardwareTest}
                  disabled={hardwareLoading}
                  className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 text-red-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${hardwareLoading ? "animate-spin" : ""}`} />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHardwareError(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs p-1 cursor-pointer"
                  title="Dismiss notice"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* DUAL ACTION BUTTON CONTAINER: METHOD 1 & METHOD 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-800/40">
            {/* BUTTON 1: EXISTING MANUAL ANALYSIS (PRESERVED 100%) */}
            <motion.button
              type="submit"
              disabled={loading || hardwareLoading}
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(6, 182, 212, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 border border-cyan-400/40 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700/40 text-slate-100 font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(6,182,212,0.25)] flex items-center justify-center gap-3"
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

            {/* BUTTON 2: NEW INDEPENDENT REAL-TIME HARDWARE TEST */}
            <motion.button
              type="button"
              onClick={handleHardwareTest}
              disabled={hardwareLoading || loading}
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700/40 text-slate-100 font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(16,185,129,0.25)] flex items-center justify-center gap-3"
            >
              {hardwareLoading ? (
                <>
                  <LoadingSpinner size="w-5 h-5" />
                  <span>{hardwareStatus || "Acquiring Sensor Readings..."}</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5 text-emerald-200 animate-pulse" />
                  <span>Start Hardware Test</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      {/* AI Processing Workflow Animation (for manual analysis) */}
      <AnimatePresence>
        {showWorkflow && (
          <PredictionWorkflow isActive={showWorkflow} onComplete={handleWorkflowComplete} />
        )}
      </AnimatePresence>

      {/* Real-time Hardware Test Result Section (METHOD 2) */}
      <AnimatePresence>
        {hardwareResult && (
          <HardwareTestResult
            result={hardwareResult}
            onClear={() => setHardwareResult(null)}
            onRetest={handleHardwareTest}
            isRetesting={hardwareLoading}
          />
        )}
      </AnimatePresence>

      {/* Manual Prediction Result display Section (METHOD 1) */}
      <PredictionResult result={result} parameters={formData} processingTime={processingTime} />
    </div>
  );
}

export default PredictionForm;
