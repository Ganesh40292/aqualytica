import { Link } from "react-router-dom";
import { ArrowRight, History } from "lucide-react";

const RecentActivity = ({ history = [] }) => {
  const items = history.slice(0, 5);

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between h-full hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <History className="w-5 h-5 text-cyan-400" />
            Recent Telemetry Feed
          </h3>
          <Link
            to="/history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors flex items-center gap-1 group"
          >
            Ledger View
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <span className="text-4xl mb-3">📁</span>
            <h4 className="text-sm font-bold text-slate-350">Ledger Empty</h4>
            <p className="text-xs text-slate-500 max-w-[220px] mt-1 leading-relaxed">No telemetry records registered yet in database.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isPotable = item.prediction?.toLowerCase() === "potable";
              const timeString = item.predictedAt
                ? new Date(item.predictedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })
                : "Just now";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isPotable ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-200">
                          {item.prediction}
                        </p>
                        {item.isAnomaly && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-400 font-bold uppercase">
                            Anomaly
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        pH: {item.ph?.toFixed(2)} | {item.temperature?.toFixed(1)}°C | TDS: {item.totalDissolvedSolids}ppm | EC: {item.conductivity || (item.totalDissolvedSolids * 2.0)}µS/cm
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-cyan-400 block font-mono">
                      {item.confidence}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {timeString}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
