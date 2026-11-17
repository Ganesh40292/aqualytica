import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

const CustomDot = ({ cx, cy, payload, parameterKey, isOutOfRange }) => {
  if (!cx || !cy) return null;
  const val = payload[parameterKey];
  const outOfRange = isOutOfRange ? isOutOfRange(val) : false;

  if (outOfRange) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#ef4444"
        stroke="#ffffff"
        strokeWidth={1.5}
        className="animate-pulse"
      />
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#06b6d4"
      stroke="#0f172a"
      strokeWidth={1}
    />
  );
};

const ParameterTrendChart = ({
  title,
  subtitle,
  parameterKey,
  unit,
  lineColor = "#06b6d4",
  referenceLines = [],
  isOutOfRange,
  badgeText,
  history = [],
  maxPoints = 25
}) => {
  // Take the most recent items and reverse so they appear chronological left-to-right
  const chartData = [...history]
    .slice(0, maxPoints)
    .reverse()
    .map((item, idx) => {
      const date = item.predictedAt ? new Date(item.predictedAt) : null;
      const timeLabel = date
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : `#${idx + 1}`;
      
      const val = item[parameterKey] !== undefined && item[parameterKey] !== null
        ? Number(Number(item[parameterKey]).toFixed(2))
        : null;

      return {
        id: item.id,
        time: timeLabel,
        fullTime: date ? date.toLocaleString() : "N/A",
        [parameterKey]: val,
        isAnomaly: item.isAnomaly,
        prediction: item.prediction
      };
    });

  const isEmpty = chartData.length === 0;

  // Compute current average and range
  const validVals = chartData.map((d) => d[parameterKey]).filter((v) => v !== null && !isNaN(v));
  const avgVal = validVals.length > 0
    ? (validVals.reduce((a, b) => a + b, 0) / validVals.length).toFixed(2)
    : "—";
  const minVal = validVals.length > 0 ? Math.min(...validVals).toFixed(2) : "—";
  const maxVal = validVals.length > 0 ? Math.max(...validVals).toFixed(2) : "—";

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-[340px]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
            {badgeText && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-[10px] font-mono font-bold">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-bold text-slate-200">
            Avg: <span className="text-cyan-400 font-mono">{avgVal} {unit}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Range: {minVal} - {maxVal}
          </div>
        </div>
      </div>

      <div className="flex-1 mt-4">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
            No telemetry records recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={["auto", "auto"]} />
              
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const val = data[parameterKey];
                    const outOfRange = isOutOfRange ? isOutOfRange(val) : false;
                    return (
                      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-1">
                        <div className="text-slate-400 font-medium">{data.fullTime}</div>
                        <div className="font-bold flex items-center gap-2">
                          <span className="text-slate-200">{title}:</span>
                          <span className={`font-mono ${outOfRange ? "text-red-400 font-black" : "text-cyan-400"}`}>
                            {val} {unit}
                          </span>
                          {outOfRange && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                              Out of Limits
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Verdict: <span className={data.prediction?.toLowerCase() === "potable" ? "text-green-400" : "text-red-400"}>{data.prediction}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {referenceLines.map((ref, idx) => (
                <ReferenceLine
                  key={`ref-${idx}`}
                  y={ref.y}
                  stroke={ref.color || "#ef4444"}
                  strokeDasharray={ref.dashArray || "3 3"}
                  strokeWidth={1.5}
                  label={{
                    value: ref.label,
                    fill: ref.color || "#ef4444",
                    fontSize: 9,
                    position: ref.position || "insideTopLeft"
                  }}
                />
              ))}

              <Line
                type="monotone"
                dataKey={parameterKey}
                name={title}
                stroke={lineColor}
                strokeWidth={2.5}
                dot={(props) => (
                  <CustomDot
                    {...props}
                    parameterKey={parameterKey}
                    isOutOfRange={isOutOfRange}
                  />
                )}
                activeDot={{ r: 6, stroke: "#38bdf8", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ParameterTrendChart;
