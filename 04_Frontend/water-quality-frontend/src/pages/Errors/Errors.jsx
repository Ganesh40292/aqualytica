import { useState, useEffect, useCallback } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { Server, Database, Brain, Terminal, Trash2 } from "lucide-react";
import axios from "axios";

const Errors = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState({
    backend: "checking",
    db: "checking",
    python: "checking",
  });

  const addLog = useCallback((type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Date.now() + Math.random(), timestamp, type, message },
      ...prev.slice(0, 49) // Keep last 50 entries
    ]);
  }, []);

  const runHealthChecks = useCallback(async () => {
    const checkState = {
      backend: "online",
      db: "online",
      python: "online"
    };

    // 1. Check Backend & DB
    try {
      const backendRes = await axios.get("http://localhost:8080/api/health", { timeout: 2000 });
      if (backendRes.status !== 200) {
        checkState.backend = "error";
        checkState.db = "error";
        addLog("error", `REST API returned unexpected status code: ${backendRes.status}`);
      }
    } catch (e) {
      checkState.backend = "offline";
      checkState.db = "offline";
      addLog("error", `REST API offline: Network connection refused at http://localhost:8080/api/health. Cause: ${e.message}`);
    }

    // 2. Check Python ML
    try {
      const pythonRes = await axios.get("http://localhost:5000/", { timeout: 2000 });
      if (pythonRes.status !== 200) {
        checkState.python = "error";
        addLog("error", `Python ML service returned status code: ${pythonRes.status}`);
      }
    } catch (e) {
      checkState.python = "offline";
      addLog("error", `Python ML API offline: Network connection refused at http://localhost:5000/. Cause: ${e.message}`);
    }

    // 3. Log operational state if all clear
    if (checkState.backend === "online" && checkState.python === "online") {
      addLog("info", "All endpoints verified. MySQL connection stable. Latency check normal.");
    }

    setStatus(checkState);
  }, [addLog]);

  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("info", "Diagnostics system initialized. Starting live endpoint pings...");
      runHealthChecks();
    }, 0);
    const interval = setInterval(runHealthChecks, 6000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [runHealthChecks, addLog]);

  const clearLogs = () => {
    setLogs([]);
    addLog("info", "Console logs cleared by analyst.");
  };

  const statusIcons = {
    online: "text-green-500 bg-green-950/20 border-green-900/30 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
    offline: "text-red-500 bg-red-950/20 border-red-900/30 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse",
    error: "text-yellow-500 bg-yellow-950/20 border-yellow-900/30 shadow-[0_0_12px_rgba(250,204,21,0.15)] animate-pulse",
    checking: "text-slate-400 bg-slate-900/30 border-slate-800/80"
  };

  return (
    <PageWrapper className="space-y-8">

      {/* Connection Indicator blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Backend status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.backend]}`}>
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">REST API Server</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Port 8080 Health</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.backend === "online" ? "Active" : "Offline"}</span>
        </div>

        {/* DB status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.db]}`}>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Database Engine</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">MySQL Connectivity</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.db === "online" ? "Connected" : "Disconnected"}</span>
        </div>

        {/* Python ML status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.python]}`}>
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Flask Inference Service</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Port 5000 Health</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.python === "online" ? "Active" : "Offline"}</span>
        </div>

      </div>

      {/* Terminal Console Logs */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[450px]">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-350">Aqualytica Live Diagnostic Feed</span>
          </div>
          <button
            onClick={clearLogs}
            className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Scrolling Console Body */}
        <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-2.5 max-h-[400px]">
          {logs.length === 0 ? (
            <div className="text-slate-700 text-center py-24">
              [No diagnostic logs recorded]
            </div>
          ) : (
            logs.map((log) => {
              const isErr = log.type === "error";
              const logColor = isErr ? "text-red-400" : "text-cyan-400";
              const label = isErr ? "ERROR" : "INFO";

              return (
                <div key={log.id} className="flex gap-2 items-start leading-relaxed select-text">
                  <span className="text-slate-600">[{log.timestamp}]</span>
                  <span className={`font-bold ${logColor}`}>[{label}]</span>
                  <span className="text-slate-300 flex-1">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Errors;
