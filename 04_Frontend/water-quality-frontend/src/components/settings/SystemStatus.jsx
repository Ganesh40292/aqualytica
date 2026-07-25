import { useState, useEffect, useCallback } from "react";
import { Server, Database, Brain, Cpu, RefreshCw } from "lucide-react";
import axios from "axios";

const SystemStatus = () => {
  const [status, setStatus] = useState({
    backend: "checking",
    db: "checking",
    python: "checking",
    model: "checking"
  });
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setStatus({
      backend: "checking",
      db: "checking",
      python: "checking",
      model: "checking"
    });

    const newStatus = {
      backend: "offline",
      db: "offline",
      python: "offline",
      model: "offline"
    };

    try {
      const backendRes = await axios.get("http://localhost:8080/api/health", { timeout: 3000 });
      if (backendRes.status === 200) {
        newStatus.backend = "online";
        newStatus.db = "online";
      }
    } catch {
      newStatus.backend = "offline";
      newStatus.db = "offline";
    }

    try {
      const pythonRes = await axios.get("http://localhost:5000/", { timeout: 3000 });
      if (pythonRes.status === 200) {
        newStatus.python = "online";
        newStatus.model = "online";
      }
    } catch {
      newStatus.python = "offline";
      newStatus.model = "offline";
    }

    setStatus(newStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkHealth]);

  const config = {
    online: {
      text: "Operational",
      color: "text-green-400 border-green-500/30 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.12)] hover:border-green-400/40",
      dot: "bg-green-500 shadow-[0_0_8px_#22c55e]"
    },
    offline: {
      text: "Disconnected",
      color: "text-red-400 border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.12)] hover:border-red-400/40",
      dot: "bg-red-500 shadow-[0_0_8px_#ef4444]"
    },
    checking: {
      text: "Checking...",
      color: "text-slate-400 border-slate-800/80 bg-slate-900/40 shadow-none",
      dot: "bg-slate-500 animate-pulse"
    }
  };

  const statusCards = [
    {
      id: "backend",
      name: "Java Service",
      description: "Spring Boot core REST API serving on Port 8080",
      icon: Server,
      state: status.backend
    },
    {
      id: "db",
      name: "Database Cluster",
      description: "Relational MySQL server instance mapped via JPA",
      icon: Database,
      state: status.db
    },
    {
      id: "python",
      name: "Inference Engine",
      description: "Python Flask ML web service serving on Port 5000",
      icon: Cpu,
      state: status.python
    },
    {
      id: "model",
      name: "Random Forest Model",
      description: "Serialized pkl loaded under Flask memory",
      icon: Brain,
      state: status.model
    }
  ];

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-5.5 h-5.5 text-cyan-400" />
            System Integration Status
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Monitor API node status & hardware connectivity
          </p>
        </div>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="p-3 rounded-xl border border-slate-800 hover:border-slate-700/50 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusCards.map((card) => {
          const Icon = card.icon;
          const current = config[card.state] || config.checking;

          return (
            <div
              key={card.id}
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center min-h-[200px] transition-all duration-300 relative ${current.color}`}
            >
              {/* Absolute positioned status dot */}
              <span className={`absolute top-4.5 right-4.5 w-2.5 h-2.5 rounded-full ${current.dot}`} />

              {/* Centered Icon */}
              <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 mb-4 shrink-0">
                <Icon className="w-6 h-6 shrink-0" />
              </div>

              {/* Text info */}
              <div className="space-y-1.5 flex flex-col items-center">
                <h4 className="text-base font-bold text-slate-100">{card.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[280px]">{card.description}</p>
              </div>

              {/* Operational State Label */}
              <span className="text-xs font-black uppercase tracking-widest mt-4 block">{current.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemStatus;
