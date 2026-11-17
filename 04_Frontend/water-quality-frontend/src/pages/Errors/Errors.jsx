import { useState, useEffect, useCallback, useMemo } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { 
  Server, Database, Brain, Terminal, Trash2, AlertTriangle, 
  ShieldCheck, Activity, Cpu, Search, RefreshCw, ChevronDown, ChevronUp 
} from "lucide-react";
import axios from "axios";
import { getAllHistory } from "../../services/historyService";

const Errors = () => {
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [anomalySearch, setAnomalySearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [status, setStatus] = useState({
    backend: "checking",
    db: "checking",
    python: "checking",
    hardware: "checking"
  });

  const addLog = useCallback((type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Date.now() + Math.random(), timestamp, type, message },
      ...prev.slice(0, 49) // Keep last 50 entries
    ]);
  }, []);

  const fetchHistoryData = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const data = await getAllHistory();
      setHistory(data || []);
      addLog("info", `Retrieved ${data?.length || 0} telemetry historical records from Supabase PostgreSQL.`);
    } catch (e) {
      addLog("error", `Failed to fetch telemetry history: ${e.message}`);
    } finally {
      setLoadingHistory(false);
    }
  }, [addLog]);

  const runHealthChecks = useCallback(async () => {
    const checkState = {
      backend: "checking",
      db: "checking",
      python: "checking",
      hardware: "checking"
    };

    // 1. Check Backend & DB
    try {
      const backendRes = await axios.get("http://localhost:8080/api/health", { timeout: 2500 });
      if (backendRes.status === 200) {
        checkState.backend = "online";
        checkState.db = "online";
      } else {
        checkState.backend = "error";
        checkState.db = "error";
        addLog("error", `REST API returned unexpected status code: ${backendRes.status}`);
      }
    } catch (e) {
      checkState.backend = "offline";
      checkState.db = "offline";
      addLog("error", `REST API offline: Connection refused at http://localhost:8080/api/health. Cause: ${e.message}`);
    }

    // 2. Check Python ML
    try {
      const pythonRes = await axios.get("http://localhost:5000/", { timeout: 2500 });
      if (pythonRes.status === 200) {
        checkState.python = "online";
      } else {
        checkState.python = "error";
        addLog("error", `Python ML service returned status code: ${pythonRes.status}`);
      }
    } catch (e) {
      checkState.python = "offline";
      addLog("error", `Python ML API offline: Connection refused at http://localhost:5000/. Cause: ${e.message}`);
    }

    // 3. Check Hardware status from latest database telemetry timestamp
    try {
      const historyRes = await getAllHistory();
      if (historyRes && historyRes.length > 0) {
        const latestTime = new Date(historyRes[0].predictedAt).getTime();
        const diffSeconds = (Date.now() - latestTime) / 1000;
        if (diffSeconds < 60) {
          checkState.hardware = "online";
        } else if (diffSeconds < 300) {
          checkState.hardware = "idle";
        } else {
          checkState.hardware = "standby";
        }
      } else {
        checkState.hardware = "standby";
      }
    } catch {
      checkState.hardware = "offline";
    }

    setStatus(checkState);
  }, [addLog]);

  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("info", "Anomaly intelligence diagnostics initialized. Running endpoint probes...");
      runHealthChecks();
      fetchHistoryData();
    }, 0);
    const interval = setInterval(runHealthChecks, 10000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [runHealthChecks, fetchHistoryData, addLog]);

  const clearLogs = () => {
    setLogs([]);
    addLog("info", "Diagnostics console cleared by operator.");
  };

  // Anomaly metrics
  const totalSamples = history.length;
  const anomalyRecords = useMemo(() => {
    return history.filter((h) => h.isAnomaly === true);
  }, [history]);

  const anomalyCount = anomalyRecords.length;
  const anomalyRate = totalSamples > 0 ? ((anomalyCount / totalSamples) * 100).toFixed(1) : 0;

  // Filtered anomaly records for table
  const filteredAnomalies = useMemo(() => {
    if (!anomalySearch.trim()) return anomalyRecords;
    const q = anomalySearch.toLowerCase();
    return anomalyRecords.filter((item) => {
      return (
        String(item.id).includes(q) ||
        (item.anomalyReason && item.anomalyReason.toLowerCase().includes(q)) ||
        (item.prediction && item.prediction.toLowerCase().includes(q)) ||
        String(item.ph).includes(q) ||
        String(item.totalDissolvedSolids).includes(q)
      );
    });
  }, [anomalyRecords, anomalySearch]);

  const statusIcons = {
    online: "text-green-400 bg-green-950/20 border-green-900/40 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
    idle: "text-cyan-400 bg-cyan-950/20 border-cyan-900/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
    standby: "text-amber-400 bg-amber-950/20 border-amber-900/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    offline: "text-red-400 bg-red-950/20 border-red-900/40 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse",
    error: "text-yellow-400 bg-yellow-950/20 border-yellow-900/40 shadow-[0_0_12px_rgba(250,204,21,0.15)] animate-pulse",
    checking: "text-slate-400 bg-slate-900/30 border-slate-800/80"
  };

  return (
    <PageWrapper className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Anomaly Intelligence & System Health Console
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
            Real-time sensor bound violation auditing, outlier detection and subsystem integrity
          </p>
        </div>
        <button
          onClick={() => {
            runHealthChecks();
            fetchHistoryData();
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? "animate-spin text-cyan-400" : ""}`} />
          Run Health Diagnostics
        </button>
      </div>

      {/* Subsystem Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Backend status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.backend]}`}>
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Spring Boot API</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Port 8080 Active</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.backend === "online" ? "Online" : "Offline"}</span>
        </div>

        {/* DB status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.db]}`}>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Supabase PostgreSQL</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Cloud Database</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.db === "online" ? "Connected" : "Disconnected"}</span>
        </div>

        {/* Python ML status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.python]}`}>
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Random Forest API</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Flask Port 5000</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">{status.python === "online" ? "Online" : "Offline"}</span>
        </div>

        {/* Hardware telemetry status card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${statusIcons[status.hardware]}`}>
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">ESP32 & Mosquitto</h4>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">MQTT TCP :1883</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase">
            {status.hardware === "online" ? "Streaming" : status.hardware === "idle" ? "Idle" : "Standby"}
          </span>
        </div>
      </div>

      {/* Anomaly Analytics Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scanned Telemetries</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">
            {totalSamples}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total physical evaluations in ledger</p>
        </div>

        <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Anomaly Events</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-3">
            {anomalyCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Sensor readings exceeding safety thresholds</p>
        </div>

        <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Anomaly Rate</span>
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-black text-slate-100 font-mono mt-3">
            {anomalyRate}<span className="text-lg text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Proportion of physical sensor outliers</p>
        </div>
      </div>

      {/* Filterable Historical Anomaly Records Table */}
      <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-4 hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Historical Anomaly Outlier Incidents
            </h3>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Verified sensor bound violations flagged by the Spring Boot backend
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search anomalies by reason or value..."
              value={anomalySearch}
              onChange={(e) => setAnomalySearch(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {filteredAnomalies.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm font-semibold">
            {totalSamples === 0
              ? "No telemetry records loaded yet"
              : anomalyCount === 0
              ? "All recorded telemetry readings are within normal physical sensor thresholds. No anomalies detected."
              : "No anomaly incidents match your search query."}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800/60 rounded-2xl bg-slate-950/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Observed Parameters</th>
                  <th className="p-3.5">Violation Reason</th>
                  <th className="p-3.5">ML Classification</th>
                  <th className="p-3.5">Logged At</th>
                  <th className="p-3.5 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium">
                {filteredAnomalies.map((item, idx) => {
                  const isExpanded = expandedId === item.id;
                  const dateStr = item.predictedAt ? new Date(item.predictedAt).toLocaleString() : "N/A";
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-3.5 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-3.5 font-mono">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={item.ph < 2 || item.ph > 12 ? "text-red-400 font-bold" : "text-slate-300"}>
                            pH {item.ph?.toFixed(2)}
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className={item.temperature < 0 || item.temperature > 60 ? "text-red-400 font-bold" : "text-slate-300"}>
                            {item.temperature?.toFixed(1)}°C
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className={item.turbidity > 500 ? "text-red-400 font-bold" : "text-slate-300"}>
                            {item.turbidity?.toFixed(1)} NTU
                          </span>
                          <span className="text-slate-600">|</span>
                          <span className={item.totalDissolvedSolids > 2500 ? "text-red-400 font-bold" : "text-slate-300"}>
                            {item.totalDissolvedSolids} ppm
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-1 rounded bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[11px] font-semibold">
                          {item.anomalyReason || "Sensor threshold limit exceeded"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold ${item.prediction?.toLowerCase() === "potable" ? "text-green-400" : "text-red-400"}`}>
                          {item.prediction} ({item.confidence}%)
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{dateStr}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Terminal Diagnostic Feed */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[360px]">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Aqualytica Live System Diagnostic Feed
            </span>
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
        <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-2 max-h-[300px]">
          {logs.length === 0 ? (
            <div className="text-slate-700 text-center py-20">
              [No diagnostic logs recorded]
            </div>
          ) : (
            logs.map((log) => {
              const isErr = log.type === "error";
              const logColor = isErr ? "text-red-400" : "text-cyan-400";
              const label = isErr ? "ERROR" : "INFO";

              return (
                <div key={log.id} className="flex gap-2 items-start leading-relaxed select-text">
                  <span className="text-slate-600 font-mono">[{log.timestamp}]</span>
                  <span className={`font-bold font-mono ${logColor}`}>[{label}]</span>
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
