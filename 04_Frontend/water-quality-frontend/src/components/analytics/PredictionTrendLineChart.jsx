import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { getChartThemeColors } from "../../utils/chartThemeHelper";

import GlassmorphicTooltip from "./GlassmorphicTooltip";

const PredictionTrendLineChart = ({ history = [] }) => {
  const colors = getChartThemeColors();

  // Group predictions by day
  const dailyData = [...history]
    .slice(0, 30) // take up to 30 items
    .reduce((acc, curr) => {
      if (!curr.predictedAt) return acc;
      const dateKey = new Date(curr.predictedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, total: 0, potable: 0 };
      }
      acc[dateKey].total += 1;
      if (curr.prediction?.toLowerCase() === "potable") {
        acc[dateKey].potable += 1;
      }
      return acc;
    }, {});

  // Convert to array and reverse to chronological order
  const chartData = Object.values(dailyData).reverse().slice(-7);

  const isEmpty = history.length === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div>
        <h3 className="text-base font-bold text-slate-100">Daily Prediction Trends</h3>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          Volume of water samples analyzed over the last 7 days
        </p>
      </div>

      <div className="flex-1 mt-6">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
            No history logged yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip content={<GlassmorphicTooltip unit="evals" />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Evaluated"
                stroke={colors.primary}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="potable"
                name="Potable Output"
                stroke={colors.secondary}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PredictionTrendLineChart;
