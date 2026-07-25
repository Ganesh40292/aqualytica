import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const steps = [
  { label: "Collecting Sensor Values", icon: "📊" },
  { label: "Sending Data to AI Model", icon: "📡" },
  { label: "Running Random Forest Prediction", icon: "🌲" },
  { label: "Analyzing Water Quality", icon: "🔬" },
  { label: "Prediction Completed", icon: "✅" },
];

function PredictionWorkflow({ isActive, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => {
        setCurrentStep(0);
      }, 0);
      return () => clearTimeout(timer);
    }

    const stepDuration = 350; // ~350ms per step, total ~1.75s
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 300);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mt-8 rounded-2xl p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            AI Processing Pipeline
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
            Multi-stage classification engine
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-950 border border-slate-800/80 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400"
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: isPending ? 0.3 : 1,
                x: 0,
              }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? "bg-cyan-950/20 border border-cyan-800/30"
                  : isCompleted
                  ? "bg-slate-950/20 border border-slate-900/40"
                  : "border border-transparent"
              }`}
            >
              {/* Step Icon */}
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </motion.div>
                ) : isCurrent ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-lg"
                  >
                    {step.icon}
                  </motion.span>
                ) : (
                  <span className="text-lg opacity-40">{step.icon}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-xs font-bold tracking-wide ${
                  isCurrent
                    ? "text-cyan-300"
                    : isCompleted
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    ...
                  </motion.span>
                )}
                {isCompleted && " ✓"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PredictionWorkflow;
