import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const ConfidenceBarChart = ({ history = [] }) => {
  // Take last 12 predictions in chronological order (oldest to newest)
  const chartData = [...history]
    .slice(0, 12)
    .reverse()
    .map((item, index) => ({
      index: index + 1,
      confidence: item.confidence,
      prediction: item.prediction
    }));

  const isEmpty = history.length === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div>
        <h3 className="text-base font-bold text-slate-100">Model Confidence Trend</h3>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          Confidence score distributions of latest 12 predictions
        </p>
      </div>

      <div className="flex-1 mt-6">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
            No history logged yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
              <XAxis dataKey="index" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "12px",
                  color: "#f8fafc"
                }}
                formatter={(value, name, props) => [`${value}%`, `Confidence (Result: ${props.payload.prediction})`]}
              />
              <Bar dataKey="confidence" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <option key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ConfidenceBarChart;
