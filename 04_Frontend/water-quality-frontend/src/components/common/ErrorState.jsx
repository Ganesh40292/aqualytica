import { ServerCrash, RefreshCw } from "lucide-react";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 backdrop-blur-3xl border border-slate-800/40 rounded-3xl min-h-[400px] shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-red-500/5 rounded-full blur-3xl pointer-events-none w-80 h-80 -top-10" />
      
      <div className="p-4 rounded-full bg-red-950/20 border border-red-900/30 text-red-500 mb-6 shadow-md animate-pulse shrink-0">
        <ServerCrash className="w-12 h-12" />
      </div>

      <h3 className="text-2xl font-black text-slate-100 tracking-tight">
        Backend Service Offline
      </h3>
      
      <p className="text-slate-450 mt-3 text-sm max-w-md leading-relaxed">
        {message || "Unable to establish connection to the Spring Boot REST API at localhost:8080. Ensure the backend gateway service is active and local MySQL server instance is online."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-200 hover:text-white rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer transition-colors shadow-md hover:shadow-red-500/10"
        >
          <RefreshCw size={15} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
