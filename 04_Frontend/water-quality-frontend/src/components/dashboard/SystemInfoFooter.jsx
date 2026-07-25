import { BookOpen, GitMerge, FileCheck, ShieldAlert } from "lucide-react";

const SystemInfoFooter = () => {
  return (
    <footer className="mt-12 bg-slate-900/40 backdrop-blur-xl border border-slate-850 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <h4 className="text-slate-200">ML Model</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Random Forest Classifier</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GitMerge className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <h4 className="text-slate-200">Deployment</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Flask API Microservice</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FileCheck className="w-4 h-4 text-green-400 shrink-0" />
          <div>
            <h4 className="text-slate-200">Database</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">MySQL Local Server</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0" />
          <div>
            <h4 className="text-slate-200">Hardware</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">ESP32 Binding Active</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-850/60 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <span>WQMS Systems</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
};

export default SystemInfoFooter;
