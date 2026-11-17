import { BarChart3, Droplets, Target, Calendar } from "lucide-react";
import DashboardCard from "../dashboard/DashboardCard";
import StatusBadge from "../common/StatusBadge";

const SummaryCards = ({ history = [] }) => {
  const total = history.length;
  
  const potableCount = history.filter(
    (h) => h.prediction?.toLowerCase() === "potable"
  ).length;
  
  const potablePercentage = total > 0 ? Math.round((potableCount / total) * 100) : 0;
  
  const averageConfidence = total > 0
    ? Math.round(history.reduce((acc, h) => acc + h.confidence, 0) / total)
    : 0;

  const latest = history[0] ? history[0].prediction : "None";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <DashboardCard
        title="Evaluations Counter"
        value={total}
        color="text-cyan-400"
        icon={<BarChart3 size={22} />}
      />

      <DashboardCard
        title="Safety Rating"
        value={potablePercentage}
        suffix="%"
        color="text-green-400"
        icon={<Droplets size={22} />}
      />

      <DashboardCard
        title="Inference Accuracy"
        value={averageConfidence}
        suffix="%"
        color="text-yellow-400"
        icon={<Target size={22} />}
      />

      {/* Latest Prediction Custom Card aligned with DashboardCards */}
      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800/50 flex flex-col items-center justify-center text-center min-h-[165px] sm:min-h-[180px] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/40 transition-all duration-300">
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10 w-full">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 text-purple-400 shadow-md shrink-0">
            <Calendar size={22} />
          </div>
          <div className="space-y-1.5 w-full flex flex-col items-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider leading-none">
              Latest Output
            </p>
            <div className="pt-0.5">
              {history[0] ? (
                <StatusBadge prediction={latest} />
              ) : (
                <span className="text-slate-500 font-bold text-xs">No records yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
