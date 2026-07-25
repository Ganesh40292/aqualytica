/* eslint-disable react-refresh/only-export-components */
import { Activity } from "lucide-react";

const ConfidenceGauge = ({ value }) => {
  const confidence = value || 0;
  
  // SVG arc math parameters
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc is a semi-circle, so we stroke 50% max
  const semiCircumference = circumference / 2;
  const strokeDashoffset = semiCircumference - (confidence / 100) * semiCircumference;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Average Confidence
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-3 min-h-[140px]">
        <div className="relative flex items-center justify-center w-36 h-20 overflow-hidden">
          <svg className="absolute top-0 w-36 h-36 -rotate-180 transform" viewBox="0 0 120 120">
            {/* Background Arch */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeDasharray={`${semiCircumference} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Animated Gauge Arch */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="url(#cyanGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${semiCircumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Label inside */}
          <div className="absolute bottom-0 text-center flex flex-col">
            <span className="text-3xl font-extrabold text-slate-100 leading-none">{confidence}%</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Accuracy</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs font-medium text-slate-400 border-t border-slate-800/50 pt-3">
        Based on overall dataset training metrics
      </div>
    </div>
  );
};

export default ConfidenceGauge;
const getDashoffset = (val) => {
  return val;
};
export { getDashoffset };
