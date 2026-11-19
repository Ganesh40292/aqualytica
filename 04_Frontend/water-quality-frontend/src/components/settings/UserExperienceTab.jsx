import { useState } from "react";
import { Palette, Volume2, Sparkles, Check, Play, Clock } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { playSplashChime, playWarningChime } from "../../utils/audioHelper";

/**
 * User Experience, Sensory Audio & Theme Preferences Tab
 * Real-time audio synthesizer tests, color themes, and interface animations.
 * Dark glassmorphic full-width presentation.
 */
const UserExperienceTab = () => {
  const toast = useToast();

  const [chartTheme, setChartTheme] = useState(() => localStorage.getItem("wqms-chart-theme") || "ocean");
  const [audioEnabled, setAudioEnabled] = useState(() => localStorage.getItem("wqms-audio-enabled") !== "false");
  const [trailEnabled, setTrailEnabled] = useState(() => localStorage.getItem("wqms-cursor-trail") !== "false");
  const [pollingRate, setPollingRate] = useState(() => localStorage.getItem("wqms-polling-rate") || "5");

  const selectChartTheme = (mode) => {
    setChartTheme(mode);
    localStorage.setItem("wqms-chart-theme", mode);
    playSplashChime();
    toast.showSuccess(`Analytics theme updated to: ${mode}`);
  };

  const toggleAudio = () => {
    const nextVal = !audioEnabled;
    setAudioEnabled(nextVal);
    localStorage.setItem("wqms-audio-enabled", String(nextVal));
    if (nextVal) {
      playSplashChime();
      toast.showSuccess("Audio verification chimes activated");
    } else {
      toast.showWarning("Audio chimes deactivated");
    }
  };

  const toggleTrail = () => {
    const nextVal = !trailEnabled;
    setTrailEnabled(nextVal);
    localStorage.setItem("wqms-cursor-trail", String(nextVal));
    if (nextVal) {
      toast.showSuccess("Interactive cursor trail enabled");
    } else {
      toast.showWarning("Interactive cursor trail disabled");
    }
  };

  const handlePollingChange = (rate) => {
    setPollingRate(rate);
    localStorage.setItem("wqms-polling-rate", rate);
    toast.showInfo(`Dashboard auto-refresh rate set to ${rate}s`);
  };

  const chartThemes = [
    {
      id: "ocean",
      name: "Ocean Breeze",
      accent: "from-cyan-400 to-teal-500",
      description: "Cyan to Teal marine gradient for clean environmental monitoring."
    },
    {
      id: "emerald",
      name: "Deep Emerald",
      accent: "from-emerald-400 to-teal-600",
      description: "Natural organic emerald tones reflecting ecological safety benchmarks."
    },
    {
      id: "cyber",
      name: "Neon Cyber",
      accent: "from-purple-500 to-fuchsia-500",
      description: "High-contrast violet gradients for futuristic telemetry analysis."
    }
  ];

  return (
    <div className="space-y-6">
      {/* ═══ THEME SELECTION ═══ */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
            <Palette className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">Analytics Visualizer Color Templates</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Select primary gradient presets applied to telemetry charts and area graphs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
          {chartThemes.map((t) => {
            const isActive = chartTheme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectChartTheme(t.id)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3.5 transition-all duration-300 cursor-pointer relative min-h-[140px] ${
                  isActive
                    ? "bg-slate-950/80 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/30"
                    : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${t.accent} shadow-md`} />
                    <span className="text-sm font-black text-white">{t.name}</span>
                  </div>
                  {isActive && (
                    <span className="p-1 rounded-full bg-cyan-500 text-slate-950 shadow-[0_0_10px_#22d3ee]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ SENSORY AUDIO & INTERACTIVITY (2 Equal Cards) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio Synthesizer */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base sm:text-lg font-black text-white">Audio Verification Chimes</h4>
              </div>
              <button
                type="button"
                onClick={toggleAudio}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ${
                  audioEnabled ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  audioEnabled ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Synthesizes real-time acoustic feedback upon model classification and sensor threshold breaches using the Web Audio API.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <button
              type="button"
              onClick={playSplashChime}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold transition-all cursor-pointer hover:border-emerald-500/40 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Splash Tone</span>
            </button>
            <button
              type="button"
              onClick={playWarningChime}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-750 text-slate-200 text-xs font-bold transition-all cursor-pointer hover:border-amber-500/40 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Warning Tone</span>
            </button>
          </div>
        </div>

        {/* Cursor Trail & Polling */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base sm:text-lg font-black text-white">Interactive Cursor Trails</h4>
              </div>
              <button
                type="button"
                onClick={toggleTrail}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ${
                  trailEnabled ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  trailEnabled ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Generates floating hydro-particle trails following pointer coordinates across the portal.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                Dashboard Polling Frequency
              </span>
              <span className="font-mono font-black text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/60">
                {pollingRate}s Interval
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2.5 pt-1">
              {["3", "5", "10", "30"].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handlePollingChange(sec)}
                  className={`py-2 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                    pollingRate === sec
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserExperienceTab;