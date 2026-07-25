import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getChartThemeColors } from "../../utils/chartThemeHelper";

import GlassmorphicTooltip from "./GlassmorphicTooltip";

const PredictionGrowthAreaChart = ({ history = [] }) => {
  const colors = getChartThemeColors();
  
  // Sort history chronologically (oldest first) to calculate cumulative growth
  const sortedHistory = [...history].sort((a, b) => {
    return new Date(a.predictedAt || 0) - new Date(b.predictedAt || 0);
  });

  // Build cumulative counts
  const chartData = sortedHistory.map((item, index) => {
    const dateStr = item.predictedAt
      ? new Date(item.predictedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
      : `Index ${index + 1}`;

    return {
      date: dateStr,
      cumulativeCount: index + 1
    };
  });

  const isEmpty = history.length === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div>
        <h3 className="text-base font-bold text-slate-100">Cumulative Database Growth</h3>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          Historical growth of total evaluations stored in database
        </p>
      </div>

      <div className="flex-1 mt-6">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
            No growth records logged yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.secondary} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip content={<GlassmorphicTooltip unit="evals" />} />
              <Area
                type="monotone"
                dataKey="cumulativeCount"
                stroke={colors.primary}
                strokeWidth={2}
                fill="url(#growthGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PredictionGrowthAreaChart;
