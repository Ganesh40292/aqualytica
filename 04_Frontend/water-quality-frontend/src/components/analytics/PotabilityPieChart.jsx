import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const PotabilityPieChart = ({ history = [] }) => {
  const potableCount = history.filter((h) => h.prediction?.toLowerCase() === "potable").length;
  const notPotableCount = history.length - potableCount;

  const data = [
    { name: "Potable Water", value: potableCount, color: "#10b981" },
    { name: "Not Potable Water", value: notPotableCount, color: "#ef4444" }
  ];

  const isEmpty = history.length === 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div>
        <h3 className="text-base font-bold text-slate-100">Potability Breakdown</h3>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          Proportion of potable vs contaminated samples
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-4">
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
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PotabilityPieChart;
