import { Link } from "react-router-dom";
import { ArrowRight, History } from "lucide-react";

const RecentActivity = ({ history = [] }) => {
  const items = history.slice(0, 5);

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-full min-h-[460px] hover:shadow-[0_0_30px_rgba(6,182,212,0.08)] transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <History className="w-5.5 h-5.5 text-cyan-400" />
            Recent Transmission Logs
          </h3>
          <Link
            to="/history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors flex items-center gap-1 group"
          >
            History Ledger
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center pt-24">
            <span className="text-5xl mb-4">📁</span>
            <h4 className="text-base font-bold text-slate-350">Ledger Ledger Empty</h4>
            <p className="text-xs text-slate-500 max-w-[200px] mt-2 leading-relaxed">No telemetry packets registered in MySQL database.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const isPotable = item.prediction?.toLowerCase() === "potable";
              const timeString = item.predictedAt
                ? new Date(item.predictedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "Just now";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${isPotable ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`} />
                    <div>
                      <p className="text-base font-bold text-slate-200">
                        {item.prediction}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        pH: {item.ph?.toFixed(2)} | Temp: {item.temperature?.toFixed(1)}°C | TDS: {item.totalDissolvedSolids}mg/L
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-400">
                      {item.confidence}%
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{timeString}</p>
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
