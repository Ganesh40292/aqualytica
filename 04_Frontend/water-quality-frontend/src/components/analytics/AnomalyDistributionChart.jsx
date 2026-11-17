import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { AlertTriangle, ShieldCheck } from "lucide-react";

const AnomalyDistributionChart = ({ history = [] }) => {
  const anomalyCount = history.filter((h) => h.isAnomaly === true).length;
  const normalCount = history.length - anomalyCount;
  const total = history.length;

  const normalPct = total > 0 ? ((normalCount / total) * 100).toFixed(1) : 0;
  const anomalyPct = total > 0 ? ((anomalyCount / total) * 100).toFixed(1) : 0;

  const data = [
    { name: `Normal Telemetry (${normalPct}%)`, value: normalCount, color: "#06b6d4" },
    { name: `Hardware/Sensor Anomaly (${anomalyPct}%)`, value: anomalyCount, color: "#f59e0b" }
  ];

  const isEmpty = history.length === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Anomaly Distribution
          </h3>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Physical sensor bounds vs anomalous telemetry outliers
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 font-mono">{anomalyCount}</span>
          <span className="text-[11px] text-slate-500 ml-1">/ {total} flagged</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-2">
        {isEmpty ? (
          <div className="text-slate-500 text-sm font-semibold">No dataset history logged yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`anomaly-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "12px",
                  color: "#f8fafc"
                }}
                formatter={(val, name) => [`${val} samples (${total > 0 ? Math.round((val / total) * 100) : 0}%)`, name]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          {normalCount} Clean ({normalPct}%)
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          {anomalyCount} Flagged ({anomalyPct}%)
        </span>
      </div>
    </div>
  );
};

export default AnomalyDistributionChart;
