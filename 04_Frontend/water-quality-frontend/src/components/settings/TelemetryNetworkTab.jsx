import { useState } from "react";
import { Network, Server, Cpu, CheckCircle2, RotateCcw, Activity } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { playSplashChime } from "../../utils/audioHelper";
import axios from "axios";

/**
 * Network Telemetry & Microservices Routing Configuration Tab
 * Manages MQTT broker addresses, topics, Spring Boot REST endpoints, and Flask ML host.
 * Dark glassmorphic full-width presentation.
 */
const TelemetryNetworkTab = () => {
  const toast = useToast();

  const [backendUrl, setBackendUrl] = useState(() => localStorage.getItem("wqms-api-backend-url") || "http://localhost:8080");
  const [mlUrl, setMlUrl] = useState(() => localStorage.getItem("wqms-api-ml-url") || "http://localhost:5000");
  const [mqttBroker, setMqttBroker] = useState(() => localStorage.getItem("wqms-mqtt-broker") || "0.0.0.0:1883");
  const [telemetryTopic, setTelemetryTopic] = useState(() => localStorage.getItem("wqms-mqtt-topic-telemetry") || "aqualytica/esp32/telemetry");
  const [heartbeatTopic, setHeartbeatTopic] = useState(() => localStorage.getItem("wqms-mqtt-topic-heartbeat") || "aqualytica/esp32/heartbeat");

  const [testingEndpoint, setTestingEndpoint] = useState(null);
  const [endpointResults, setEndpointResults] = useState({});

  const handleSave = () => {
    localStorage.setItem("wqms-api-backend-url", backendUrl);
    localStorage.setItem("wqms-api-ml-url", mlUrl);
    localStorage.setItem("wqms-mqtt-broker", mqttBroker);
    localStorage.setItem("wqms-mqtt-topic-telemetry", telemetryTopic);
    localStorage.setItem("wqms-mqtt-topic-heartbeat", heartbeatTopic);

    playSplashChime();
    toast.showSuccess("Network endpoints and MQTT topic mappings saved");
  };

  const handleReset = () => {
    setBackendUrl("http://localhost:8080");
    setMlUrl("http://localhost:5000");
    setMqttBroker("0.0.0.0:1883");
    setTelemetryTopic("aqualytica/esp32/telemetry");
    setHeartbeatTopic("aqualytica/esp32/heartbeat");

    localStorage.removeItem("wqms-api-backend-url");
    localStorage.removeItem("wqms-api-ml-url");
    localStorage.removeItem("wqms-mqtt-broker");
    localStorage.removeItem("wqms-mqtt-topic-telemetry");
    localStorage.removeItem("wqms-mqtt-topic-heartbeat");

    toast.showInfo("Restored default local microservice routes");
  };

  const testEndpoint = async (type, url) => {
    setTestingEndpoint(type);
    const testUrl = type === "backend" ? `${url}/api/health` : url;

    try {
      const t0 = performance.now();
      const res = await axios.get(testUrl, { timeout: 3500 });
      const t1 = performance.now();
      const rtt = Math.round(t1 - t0);

      if (res.status === 200) {
        setEndpointResults((prev) => ({
          ...prev,
          [type]: { success: true, message: `Connected (${rtt} ms RTT)` }
        }));
        toast.showSuccess(`${type === "backend" ? "Spring Boot" : "Python ML"} endpoint verified (${rtt} ms)`);
      }
    } catch {
      setEndpointResults((prev) => ({
        ...prev,
        [type]: { success: false, message: "Connection refused / Timeout" }
      }));
      toast.showError(`Failed to reach ${type} at ${url}`);
    } finally {
      setTestingEndpoint(null);
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
              <Network className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Microservice Topology
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Network Routing, REST Endpoints & MQTT Broker
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Configure target microservice URLs, Mosquitto MQTT broker sockets, and telemetry topic subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Local</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Network Config</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: REST API Gateway */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Spring Boot API Base URL
            </h4>
            <span className="text-xs font-mono font-bold uppercase bg-slate-900 text-cyan-400 px-2.5 py-0.5 rounded-md border border-slate-800">
              Port 8080
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                REST API Gateway Endpoint
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => testEndpoint("backend", backendUrl)}
                  disabled={testingEndpoint === "backend"}
                  className="px-4 py-2.5 bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {testingEndpoint === "backend" ? "Testing..." : "Test Ping"}
                </button>
              </div>
              {endpointResults.backend && (
                <span className={`text-xs font-medium mt-2 block ${
                  endpointResults.backend.success ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {endpointResults.backend.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Python ML Inference API */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Python ML Flask Microservice
            </h4>
            <span className="text-xs font-mono font-bold uppercase bg-slate-900 text-purple-400 px-2.5 py-0.5 rounded-md border border-slate-800">
              Port 5000
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Flask ML Server URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mlUrl}
                  onChange={(e) => setMlUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-purple-300 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => testEndpoint("ml", mlUrl)}
                  disabled={testingEndpoint === "ml"}
                  className="px-4 py-2.5 bg-purple-950/40 hover:bg-purple-950/60 border border-purple-800/60 text-purple-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {testingEndpoint === "ml" ? "Testing..." : "Test Ping"}
                </button>
              </div>
              {endpointResults.ml && (
                <span className={`text-xs font-medium mt-2 block ${
                  endpointResults.ml.success ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {endpointResults.ml.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: MQTT Broker & Telemetry Pub/Sub Channels */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Mosquitto MQTT Broker & Pub/Sub Topics
            </h4>
            <span className="text-xs font-mono font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
              TCP 1883
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Broker Host & Socket
              </label>
              <input
                type="text"
                value={mqttBroker}
                onChange={(e) => setMqttBroker(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Bound to: 0.0.0.0:1883</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Telemetry Ingestion Topic
              </label>
              <input
                type="text"
                value={telemetryTopic}
                onChange={(e) => setTelemetryTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">ESP32 sensor payload stream</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Device Heartbeat Topic
              </label>
              <input
                type="text"
                value={heartbeatTopic}
                onChange={(e) => setHeartbeatTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">ESP32 keepalive pings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryNetworkTab;