import { useState, useEffect, useRef, useCallback } from "react";
import { Cpu, Play, Square } from "lucide-react";
import { predictWaterQuality } from "../../services/predictionService";
import { useToast } from "../../context/ToastContext";

const SensorSimulator = () => {
  const toast = useToast();
  const [isActive, setIsActive] = useState(false);
  const [simLogs, setSimLogs] = useState([]);
  const [packetCount, setPacketCount] = useState(0);
  const logEndRef = useRef(null);

  // Random parameter generators within realistic margins
  const generateRandomReading = () => {
    // Randomize slightly around normal potable water averages
    const isPotableBase = Math.random() > 0.35;
    
    return {
      ph: parseFloat((isPotableBase ? (Math.random() * 1.5 + 6.8) : (Math.random() * 5.0 + 3.0)).toFixed(2)),
      temperature: parseFloat((Math.random() * 8.0 + 20.0).toFixed(1)),
      turbidity: parseFloat((isPotableBase ? (Math.random() * 1.5 + 1.0) : (Math.random() * 8.0 + 4.5)).toFixed(2)),
      totalDissolvedSolids: Math.floor(isPotableBase ? (Math.random() * 300 + 150) : (Math.random() * 1200 + 800)),
      conductivity: Math.floor(isPotableBase ? (Math.random() * 200 + 350) : (Math.random() * 800 + 600)),
      nitrate: parseFloat((isPotableBase ? (Math.random() * 3.0 + 1.0) : (Math.random() * 20.0 + 12.0)).toFixed(2)),
      chloride: parseFloat((isPotableBase ? (Math.random() * 50.0 + 100.0) : (Math.random() * 250.0 + 200.0)).toFixed(2))
    };
  };

  const sendSimulatedPacket = useCallback(async () => {
    const payload = generateRandomReading();
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      const response = await predictWaterQuality(payload);
      setPacketCount((c) => {
        const nextCount = c + 1;
        const logMessage = `[${timestamp}] PACKET #${nextCount} SENT - pH: ${payload.ph}, TDS: ${payload.totalDissolvedSolids}mg/L, Result: ${response.prediction} (${response.confidence}%)`;
        setSimLogs((prev) => [...prev, logMessage]);
        return nextCount;
      });
    } catch (err) {
      console.error(err);
      setSimLogs((prev) => [...prev, `[${timestamp}] FAILED TO POST HARDWARE NODE TELEMETRY PACKET`]);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isActive) {
      const initTimer = setTimeout(() => {
        sendSimulatedPacket();
      }, 0);
      timer = setInterval(sendSimulatedPacket, 6000);
      return () => {
        clearTimeout(initTimer);
        clearInterval(timer);
      };
    }
  }, [isActive, sendSimulatedPacket]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simLogs]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            ESP32 Node Stream Simulator
          </h3>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Simulate physical IoT node transmissions to database
          </p>
        </div>

        {/* Start / Stop Toggle */}
        <button
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) {
              toast.showSuccess("ESP32 simulation stream started");
            } else {
              toast.showWarning("ESP32 simulation stream stopped");
            }
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            isActive
              ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          }`}
        >
          {isActive ? (
            <>
              <Square className="w-4.5 h-4.5 fill-current" /> Stop Stream
            </>
          ) : (
            <>
              <Play className="w-4.5 h-4.5 fill-current" /> Start Stream
            </>
          )}
        </button>
      </div>

      {/* Simulator Logging console monitor */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
          <span>Active transmissions console</span>
          <span>Packets sent: {packetCount}</span>
        </div>
        
        <div className="h-44 bg-slate-950/70 border border-slate-900 rounded-xl p-4 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-2 leading-relaxed shadow-inner">
          {simLogs.length === 0 ? (
            <p className="text-slate-600 font-semibold italic text-center pt-16">Simulator offline. Toggle trigger to stream packet telemetry.</p>
          ) : (
            simLogs.map((log, index) => {
              const isFail = log.includes("FAILED");
              const isNotPotable = log.includes("Not Potable");
              const colorClass = isFail 
                ? "text-red-500 font-bold" 
                : isNotPotable 
                  ? "text-yellow-500/80" 
                  : "text-green-400";
                  
              return (
                <div key={index} className={`font-mono ${colorClass}`}>
                  {log}
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default SensorSimulator;
