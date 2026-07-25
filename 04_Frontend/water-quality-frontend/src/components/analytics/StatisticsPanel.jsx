import { CheckCircle2, AlertTriangle, Star, TrendingUp, Calendar } from "lucide-react";

const StatisticsPanel = ({ history = [] }) => {
  const total = history.length;
  
  const potableCount = history.filter(
    (h) => h.prediction?.toLowerCase() === "potable"
  ).length;
  
  const notPotableCount = total - potableCount;

  // Confidence aggregates
  const confidences = history.map((h) => h.confidence);
  const averageConfidence = total > 0
    ? Math.round(confidences.reduce((acc, c) => acc + c, 0) / total)
    : 0;
  const highestConfidence = total > 0 ? Math.max(...confidences) : 0;
  const lowestConfidence = total > 0 ? Math.min(...confidences) : 0;

  const latest = history[0];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <h3 className="text-base font-bold text-slate-100 mb-6">Database Insights Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Safe vs Untreated volumes */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Class Distributions
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Safe Water
              </span>
              <span className="text-green-400">{potableCount} Reports</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="flex items-center gap-2 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Contaminated
              </span>
              <span className="text-red-400">{notPotableCount} Reports</span>
            </div>
          </div>
        </div>

        {/* Confidence extremes */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Star className="w-4 h-4 text-cyan-400" />
            Confidence Ranges
          </h4>
          <div className="space-y-3 text-sm font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Highest Score</span>
              <span className="text-slate-200">{highestConfidence}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Lowest Score</span>
              <span className="text-slate-200">{lowestConfidence}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Average Confidence</span>
              <span className="text-slate-200">{averageConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Latest entry metadata */}
        <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Latest Transaction
          </h4>
          {latest ? (
            <div className="space-y-2 text-xs font-semibold text-slate-400">
              <div className="flex justify-between">
                <span>Result</span>
                <span className={latest.prediction?.toLowerCase() === "potable" ? "text-green-400" : "text-red-400"}>
                  {latest.prediction}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Confidence</span>
                <span className="text-slate-200">{latest.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span>pH Value</span>
                <span className="text-slate-200">{latest.ph}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-semibold italic">No transaction history found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
