import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Radio, Server, Brain, Database, LayoutDashboard, 
  Zap, RefreshCw 
} from "lucide-react";

const ArchitectureFlowchart = () => {
  const [activeTab, setActiveTab] = useState("telemetry"); // 'telemetry', 'hardware_test', 'manual'

  return (
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header and Flow Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Interactive Architecture Diagram
          </span>
          <h4 className="text-lg font-bold text-slate-100 mt-1">
            System Data Pipelines & Integration Topology
          </h4>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
          {[
            { id: "telemetry", label: "1. Real-Time Telemetry Flow", icon: Radio },
            { id: "hardware_test", label: "2. On-Demand Hardware Test Flow", icon: Zap },
            { id: "manual", label: "3. Manual Lab Analysis", icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={13} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.id === "telemetry" ? "Telemetry" : tab.id === "hardware_test" ? "Hardware Test" : "Manual"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Interactive Flowchart Visualizer */}
      <AnimatePresence mode="wait">
        {activeTab === "telemetry" && (
          <motion.div
            key="telemetry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-950/40 p-3.5 rounded-xl border border-slate-805">
              <strong className="text-cyan-400">Continuous Ingestion Pathway:</strong> The physical ESP32 node samples the 4 analog/digital probes, computes the estimated conductivity, applies thermal compensation, and broadcasts telemetry to the Mosquitto broker on topic <code className="text-cyan-300">aqualytica/sensors</code>. Spring Boot ingests the packet, validates physical sensor bounds, executes Random Forest inference, stores the record into Supabase PostgreSQL, and pushes real-time updates to the React client via Supabase Realtime WebSocket CDC.
            </div>

            {/* Horizontal Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative items-stretch">
              {[
                {
                  step: "Step 1",
                  title: "IoT Node Acquisition",
                  sub: "ESP32 DevKit V1",
                  icon: Cpu,
                  color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/20",
                  desc: "Acquires pH, Temp, Turbidity, TDS & derives EC."
                },
                {
                  step: "Step 2",
                  title: "MQTT Broadcast",
                  sub: "Mosquitto Broker",
                  icon: Radio,
                  color: "border-teal-500/30 text-teal-400 bg-teal-950/20",
                  desc: "Topic: aqualytica/sensors on Port 1883."
                },
                {
                  step: "Step 3",
                  title: "Ingestion Gateway",
                  sub: "Spring Boot 3.5",
                  icon: Server,
                  color: "border-purple-500/30 text-purple-400 bg-purple-950/20",
                  desc: "Validates bounds, checks sensor faults & anomalies."
                },
                {
                  step: "Step 4",
                  title: "AI Potability Inference",
                  sub: "Python Flask Microservice",
                  icon: Brain,
                  color: "border-green-500/30 text-green-400 bg-green-950/20",
                  desc: "5-feature scaler & Random Forest consensus."
                },
                {
                  step: "Step 5",
                  title: "Cloud Ledger",
                  sub: "Supabase PostgreSQL",
                  icon: Database,
                  color: "border-blue-500/30 text-blue-400 bg-blue-950/20",
                  desc: "Stores sensor_data & prediction_history tables."
                },
                {
                  step: "Step 6",
                  title: "Real-Time Dashboard",
                  sub: "React 19 + Recharts",
                  icon: LayoutDashboard,
                  color: "border-amber-500/30 text-amber-400 bg-amber-950/20",
                  desc: "WebSocket CDC stream & analytical trend charts."
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850 flex flex-col justify-between hover:border-slate-700 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 font-mono uppercase">{item.step}</span>
                        <div className={`p-2 rounded-xl border ${item.color}`}>
                          <Icon size={14} />
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                      <div className="text-[10px] text-cyan-400 font-semibold">{item.sub}</div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "hardware_test" && (
          <motion.div
            key="hardware_test"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-950/40 p-3.5 rounded-xl border border-slate-805">
              <strong className="text-amber-400">On-Demand Bidirectional Request-Response Flow:</strong> When the operator triggers <code className="text-amber-300">START HARDWARE TEST</code>, Spring Boot publishes an execution command with a correlated UUID to <code className="text-cyan-300">aqualytica/device/command</code>. The ESP32 receives the command, runs its 3-page LCD routine and multi-sample sensor calibration, and publishes the measured readings with the exact <code className="text-cyan-300">requestId</code>. Spring Boot resolves the waiting <code className="text-cyan-300">CompletableFuture</code> within a 10s timeout, classifies potability, saves to database, and delivers immediate feedback to the UI.
            </div>

            {/* Sequence Flow visualization */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
              {[
                {
                  step: "1. Trigger",
                  title: "Operator Click",
                  actor: "React Dashboard",
                  detail: "User clicks Start Hardware Test. Client posts to /api/telemetry/trigger-test."
                },
                {
                  step: "2. Dispatch",
                  title: "MQTT Command",
                  actor: "Spring Boot Paho",
                  detail: "Generates requestId (UUID), opens CompletableFuture, publishes to aqualytica/device/command."
                },
                {
                  step: "3. Execution",
                  title: "Hardware Acquisition",
                  actor: "ESP32 Firmware",
                  detail: "Executes sampling routine, displays LCD diagnostics, verifies sensor limits."
                },
                {
                  step: "4. Correlation",
                  title: "Response Matching",
                  actor: "Spring Boot Service",
                  detail: "Ingests response packet from aqualytica/sensors, matches requestId, and resolves future."
                },
                {
                  step: "5. Feedback",
                  title: "Verdict & UI Card",
                  actor: "React Presentation",
                  detail: "Renders 5 calibrated parameters, anomaly alert, ML verdict & confidence badge."
                }
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{s.step}</span>
                    <h5 className="text-xs font-bold text-slate-200 mt-1">{s.title}</h5>
                    <span className="text-[10px] text-cyan-400 font-semibold block mb-2">{s.actor}</span>
                    <p className="text-[11px] text-slate-400 leading-snug">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-950/40 p-3.5 rounded-xl border border-slate-805">
              <strong className="text-green-400">Manual Water Potability Analysis Pathway:</strong> For laboratory samples or field measurements entered manually, the analyst uses the <code className="text-green-300">ANALYZE SAMPLE POTABILITY</code> form. Spring Boot receives the 5 parameters (pH, Temperature, Turbidity, TDS, EC), forwards them to the Python Flask microservice, applies the standard Z-score scaler, computes Random Forest tree voting, returns the potability safety verdict, and writes the evaluation to the permanent historical ledger.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch">
              {[
                {
                  step: "Step A",
                  title: "Manual Parameter Input",
                  actor: "React Lab Form",
                  desc: "Analyst enters 5 physical values (or picks WHO Safe / Contaminated presets)."
                },
                {
                  step: "Step B",
                  title: "Gateway Validation",
                  actor: "Spring Boot REST",
                  desc: "Validates inputs, formats standardized payload, posts to Flask microservice."
                },
                {
                  step: "Step C",
                  title: "ML Feature Scaling & RF",
                  actor: "Python Scikit-Learn",
                  desc: "Applies Feature_Scaler.pkl, executes 100 decision trees in 0.03ms."
                },
                {
                  step: "Step D",
                  title: "Database Persistence",
                  actor: "Supabase & UI Result",
                  desc: "Persists records to Supabase PostgreSQL and displays safety verdict."
                }
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">{s.step}</span>
                    <h5 className="text-xs font-bold text-slate-200 mt-1">{s.title}</h5>
                    <span className="text-[10px] text-cyan-400 font-semibold block mb-2">{s.actor}</span>
                    <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectureFlowchart;
