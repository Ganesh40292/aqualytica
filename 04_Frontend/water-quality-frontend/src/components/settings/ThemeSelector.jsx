import { useState } from "react";
import { Check, Palette } from "lucide-react";

const ThemeSelector = () => {
  const [chartTheme, setChartTheme] = useState(() => {
    return localStorage.getItem("wqms-chart-theme") || "ocean";
  });

  const selectChartTheme = (mode) => {
    setChartTheme(mode);
    localStorage.setItem("wqms-chart-theme", mode);
  };

  const chartThemes = [
    {
      id: "ocean",
      name: "Ocean Breeze",
      colorDot: "bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]",
      description: "Cyan to Teal gradients for a clean marine aesthetic."
    },
    {
      id: "emerald",
      name: "Deep Emerald",
      colorDot: "bg-gradient-to-r from-teal-450 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
      description: "Teal to Green gradients matching natural safety indexes."
    },
    {
      id: "cyber",
      name: "Neon Cyber",
      colorDot: "bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]",
      description: "Purple to Fuchsia gradients for high tech telemetry."
    }
  ];

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Palette className="w-5.5 h-5.5 text-cyan-400" />
          Analytics Chart Themes
        </h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
          Select dynamic gradient color templates for data visualizers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {chartThemes.map((t) => {
            const isActive = chartTheme === t.id;

            return (
              <button
                key={t.id}
                onClick={() => selectChartTheme(t.id)}
                className={`flex flex-col text-left p-6 rounded-2xl border transition-all cursor-pointer relative group min-h-[120px] justify-center ${
                  isActive
                    ? "bg-slate-950/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-slate-200"
                    : "bg-slate-950/30 border-slate-850 hover:border-slate-700/50 text-slate-400"
                }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4 p-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-400">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${t.colorDot}`} />
                  <span className="text-base font-bold text-slate-100">{t.name}</span>
                </div>
                <span className="text-xs text-slate-500 mt-2 leading-relaxed">{t.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
