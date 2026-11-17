import { Server, Cpu, Radio, Brain, Database, LayoutDashboard, ShieldCheck } from "lucide-react";

const specs = [
  {
    tier: "IoT Edge Node",
    tech: "ESP32 DevKit V1 (Xtensa Dual-Core 240MHz, 520KB SRAM)",
    protocols: "Wi-Fi 802.11 b/g/n, OneWire, ADC1 Multi-sampling",
    role: "Submersible sensor signal conditioning, LCD display, and MQTT telemetry streaming",
    icon: Cpu,
    badge: "Hardware Layer"
  },
  {
    tier: "Telemetry Broker",
    tech: "Eclipse Mosquitto (Lightweight MQTT 3.1.1 / 5.0 Daemon)",
    protocols: "TCP/IP Port 1883, Topic Publish/Subscribe",
    role: "Decouples edge hardware from backend processing with sub-millisecond dispatch",
    icon: Radio,
    badge: "Messaging Layer"
  },
  {
    tier: "Core Gateway",
    tech: "Java 21 LTS + Spring Boot 3.5 Framework",
    protocols: "RESTful JSON APIs (Port 8080), Eclipse Paho MQTT Client",
    role: "Hardware test dispatch, request-ID correlation, rules engine, and ML orchestration",
    icon: Server,
    badge: "Backend Layer"
  },
  {
    tier: "Inference Engine",
    tech: "Python 3.14 + Flask REST Microservice + Scikit-Learn",
    protocols: "HTTP/1.1 REST (Port 5000), Joblib Serialization",
    role: "Executes 5-feature standard normal scaling and 100-tree Random Forest potability voting",
    icon: Brain,
    badge: "ML Service Layer"
  },
  {
    tier: "Data Persistence",
    tech: "PostgreSQL 15 on Supabase Cloud Infrastructure",
    protocols: "HikariCP Session Connection Pooler, SSL/TLS Encryption",
    role: "Stores immutable sensor telemetry records, analytical histories, and anomaly ledgers",
    icon: Database,
    badge: "Database Layer"
  },
  {
    tier: "Client Dashboard",
    tech: "React 19 + Vite 8 + TailwindCSS + Recharts + Framer Motion",
    protocols: "HTTPS, Supabase Realtime WebSocket (Change Data Capture)",
    role: "Dynamic interactive telemetry waveforms, anomaly console, and PDF/CSV report generator",
    icon: LayoutDashboard,
    badge: "Presentation Layer"
  }
];

const SystemSpecsTable = () => {
  return (
    <div className="bg-slate-900/30 backdrop-blur-2xl border border-slate-800/50 rounded-3xl p-6 sm:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Architecture Blueprint
          </span>
          <h4 className="text-base font-bold text-slate-100 mt-1">
            Full-Stack Technology Stack & Layer Specifications
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/40 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <ShieldCheck size={14} />
          <span>Security Hardened & Sanitized</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5">Tier</th>
              <th className="p-3.5">Technology & Platform</th>
              <th className="p-3.5">Communication Protocols</th>
              <th className="p-3.5">Architectural Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-300 font-medium">
            {specs.map((item) => {
              const Icon = item.icon;
              return (
                <tr key={item.tier} className="hover:bg-slate-850/20 transition-colors">
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                        <Icon size={14} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-200 block">{item.tier}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{item.badge}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">{item.tech}</td>
                  <td className="p-3.5 font-mono text-[11px] text-cyan-300">{item.protocols}</td>
                  <td className="p-3.5 text-slate-400">{item.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemSpecsTable;
