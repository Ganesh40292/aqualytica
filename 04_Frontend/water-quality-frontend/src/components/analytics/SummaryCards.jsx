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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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

      {/* Latest Prediction Custom Card */}
      <div className="bg-slate-900/30 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-slate-800/40 flex items-center justify-between min-h-[160px] hover:shadow-[0_0_35px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 transition-all duration-300">
        <div className="space-y-2">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Latest Output</p>
          <div className="pt-2">
            {history[0] ? (
              <StatusBadge prediction={latest} />
            ) : (
              <span className="text-slate-500 font-bold text-sm">No predictions yet</span>
            )}
          </div>
        </div>
        <div className="text-3xl p-4.5 rounded-2xl bg-slate-950/50 border border-slate-800/40 text-purple-400">
          <Calendar size={22} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
