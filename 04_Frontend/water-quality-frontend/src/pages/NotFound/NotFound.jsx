import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 min-h-[70vh] relative overflow-hidden select-none">
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="p-4.5 rounded-full bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 mb-6 animate-pulse shrink-0 shadow-lg">
        <AlertCircle className="w-14 h-14" />
      </div>

      <h2 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 tracking-tighter">
        404
      </h2>

      <h3 className="text-2xl font-black text-slate-100 mt-4 tracking-tight">
        Resource Node Not Found
      </h3>

      <p className="text-slate-500 mt-2 text-sm max-w-sm leading-relaxed">
        The requested path does not map to any active telemetry dashboard node or security routing clearance.
      </p>

      <Link
        to="/"
        className="mt-8 flex items-center gap-2.5 px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 border border-cyan-550 text-slate-100 rounded-xl text-sm font-bold uppercase tracking-widest cursor-pointer transition-colors shadow-lg hover:shadow-cyan-500/10"
      >
        <ArrowLeft size={15} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
