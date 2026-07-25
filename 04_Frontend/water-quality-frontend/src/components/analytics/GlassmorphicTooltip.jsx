const GlassmorphicTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    const dataVal = Number(payload[0].value);
    const colorHex = payload[0].stroke || payload[0].fill || "#06b6d4";
    const dateStr = label ? new Date(label).toLocaleString() : "";

    return (
      <div className="bg-slate-950/85 backdrop-blur-2xl border border-slate-800/80 px-4.5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col gap-1.5 z-50">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
          {dateStr || "Analysis Record"}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: colorHex, 
              boxShadow: `0 0 10px ${colorHex}` 
            }} 
          />
          <span className="text-xs font-black text-slate-100 tracking-wide">
            {payload[0].name || "Value"}:
          </span>
          <span className="text-sm font-black text-slate-500 tracking-tight ml-0.5" style={{ color: colorHex }}>
            {isNaN(dataVal) ? payload[0].value : dataVal.toFixed(2)}
            <span className="text-[10px] uppercase font-bold text-slate-450 ml-1">{unit}</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default GlassmorphicTooltip;
