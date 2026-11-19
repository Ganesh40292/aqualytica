import { useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import SystemStatus from "../../components/settings/SystemStatus";
import HardwareCalibrationTab from "../../components/settings/HardwareCalibrationTab";
import RegulatoryThresholdsTab from "../../components/settings/RegulatoryThresholdsTab";
import TelemetryNetworkTab from "../../components/settings/TelemetryNetworkTab";
import UserExperienceTab from "../../components/settings/UserExperienceTab";

import {
  Server,
  Cpu,
  ShieldCheck,
  Network,
  Palette,
  Sliders,
  Settings as SettingsIcon
} from "lucide-react";

/**
 * Next-Level System Administration & Operational Settings Page
 * Route: /settings
 * Seamlessly integrates with the Aqualytica 3D animated background.
 * Full-width, high-contrast, equal-sized glassmorphic cards.
 */
const Settings = () => {
  const [activeTab, setActiveTab] = useState("cluster");

  const tabs = [
    {
      id: "cluster",
      label: "Microservices & Cluster",
      icon: Server,
      desc: "Live service latency & health"
    },
    {
      id: "calibration",
      label: "Sensor Calibration",
      icon: Cpu,
      desc: "Firmware equations & offsets"
    },
    {
      id: "regulatory",
      label: "BIS IS 10500 Rules",
      icon: ShieldCheck,
      desc: "Statutory limits & anomaly alerts"
    },
    {
      id: "telemetry",
      label: "MQTT & REST APIs",
      icon: Network,
      desc: "Broker sockets & REST routing"
    },
    {
      id: "appearance",
      label: "Audio & Display",
      icon: Palette,
      desc: "Sensory chimes & visual themes"
    }
  ];

  return (
    <PageWrapper className="space-y-6 sm:space-y-8 max-w-7xl">
      {/* ═══ CONSOLE HERO HEADER (GLASSMORPHIC DARK THEME) ═══ */}
      <header className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow in top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <SettingsIcon size={13} className="text-cyan-400" />
                Aqualytica OS v3.2.1
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-bold uppercase tracking-wider">
                Hardware: ESP32 DevKit V1
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                Cluster Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight pt-1">
              SYSTEM CONFIGURATION & OPERATIONAL HUB
            </h1>
            <p className="text-sm text-slate-400 font-medium max-w-3xl leading-relaxed">
              SCADA telemetry configuration, hardware calibration offsets, statutory BIS IS 10500:2012 thresholds, and microservice topology.
            </p>
          </div>

          {/* Active Standard Pill */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-lg shrink-0 self-start lg:self-auto">
            <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">
                Active Regulatory Standard
              </span>
              <span className="text-sm font-black text-slate-100 font-mono">
                BIS IS 10500:2012 (2012)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ CATEGORY TABS (BALANCED FULL-WIDTH ROW) ═══ */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-2xl p-2 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer text-center ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] border border-cyan-400/40"
                    : "bg-slate-950/30 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-slate-800/40"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ TAB CONTENT (EQUAL SIZING & FULL PAGE WIDTH) ═══ */}
      <div className="w-full">
        {activeTab === "cluster" && <SystemStatus />}
        {activeTab === "calibration" && <HardwareCalibrationTab />}
        {activeTab === "regulatory" && <RegulatoryThresholdsTab />}
        {activeTab === "telemetry" && <TelemetryNetworkTab />}
        {activeTab === "appearance" && <UserExperienceTab />}
      </div>
    </PageWrapper>
  );
};

export default Settings;