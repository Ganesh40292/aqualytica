import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";

const MiniPieChart = ({ statistics }) => {
  const data = [
    { name: "Potable", value: statistics.potableCount || 0, color: "#22c55e" },
    { name: "Not Potable", value: statistics.notPotableCount || 0, color: "#ef4444" }
  ];

  const isEmpty = (statistics.potableCount || 0) === 0 && (statistics.notPotableCount || 0) === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Safety Ratio
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[160px] relative">
        {isEmpty ? (
          <div className="text-center text-xs font-semibold text-slate-500">No chart data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "12px",
                  color: "#f8fafc"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {!isEmpty && (
        <div className="flex justify-around text-xs font-semibold text-slate-400 mt-2 border-t border-slate-800/50 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>Potable: {statistics.potableCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Not Potable: {statistics.notPotableCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniPieChart;
