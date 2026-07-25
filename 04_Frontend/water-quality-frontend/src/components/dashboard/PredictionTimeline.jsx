import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

function PredictionTimeline({ history = [] }) {
  // Take last 10 predictions, reverse chronological (recent first)
  const timelineData = history.slice(0, 10);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 15 } }
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-2xl space-y-6 hover:border-cyan-500/20 transition-all duration-300">
      <div>
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Live Prediction Timeline
        </h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
          Chronological classification ledger feed (Recent 10)
        </p>
      </div>

      {timelineData.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-xs font-bold uppercase tracking-wider">
          Awaiting prediction transactions...
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative pl-6 border-l-2 border-slate-800/80 ml-3 space-y-6"
        >
          {timelineData.map((item, index) => {
            const isPotable = item.prediction?.toLowerCase() === "potable";
            const formattedTime = item.predictedAt
              ? new Date(item.predictedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })
              : "N/A";

            return (
              <motion.div
                key={item.id || index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Timeline Dot Indicator */}
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 ${
                  isPotable 
                    ? "border-green-500 shadow-[0_0_8px_#22c55e]" 
                    : "border-red-500 shadow-[0_0_8px_#ef4444]"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isPotable ? "bg-green-400" : "bg-red-400"}`} />
                </div>

                {/* Timeline Card */}
                <div className="p-4 rounded-2xl bg-slate-955/35 border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        {formattedTime}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-405 bg-cyan-950/20 border border-cyan-900/20 px-1.5 py-0.2 rounded">
                        Conf: {item.confidence}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase tracking-tight ${isPotable ? "text-green-400" : "text-red-400"}`}>
                        {item.prediction}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-650" />
                      <span className="text-[10px] text-slate-400 font-semibold truncate max-w-md">
                        pH: {item.ph?.toFixed(1)} | Temp: {item.temperature?.toFixed(1)}°C | Turbidity: {item.turbidity?.toFixed(1)} NTU
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge prediction={item.prediction} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default PredictionTimeline;
