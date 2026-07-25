import { Database, Droplets, AlertTriangle, Activity } from "lucide-react";
import DashboardCard from "../dashboard/DashboardCard";

const HistoryStats = ({ history = [] }) => {
  const total = history.length;
  
  const potableCount = history.filter(
    (h) => h.prediction?.toLowerCase() === "potable"
  ).length;
  
  const notPotableCount = total - potableCount;
  
  const averageConfidence = total > 0
    ? Math.round(history.reduce((acc, h) => acc + h.confidence, 0) / total)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <DashboardCard
        title="Evaluated Logs"
        value={total}
        color="text-cyan-400"
        icon={<Database size={22} />}
      />

      <DashboardCard
        title="Potable Reports"
        value={potableCount}
        color="text-green-400"
        icon={<Droplets size={22} />}
      />

      <DashboardCard
        title="Contaminated"
        value={notPotableCount}
        color="text-red-400"
        icon={<AlertTriangle size={22} />}
      />

      <DashboardCard
        title="Avg Confidence"
        value={averageConfidence}
        suffix="%"
        color="text-yellow-400"
        icon={<Activity size={22} />}
      />
    </div>
  );
};

export default HistoryStats;
