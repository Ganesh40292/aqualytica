import { useState } from "react";
import { ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle, Bell, Sliders } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { playSplashChime } from "../../utils/audioHelper";

/**
 * Regulatory & Analytical Thresholds Configuration Tab
 * Manages BIS IS 10500:2012 compliance enforcement, relaxation rules, and alert dispatchers.
 * Dark glassmorphic full-width presentation.
 */
const RegulatoryThresholdsTab = () => {
  const toast = useToast();

  const [strictMode, setStrictMode] = useState(() => localStorage.getItem("wqms-threshold-strict") === "true");
  const [anomalySensitivity, setAnomalySensitivity] = useState(() => localStorage.getItem("wqms-anomaly-sensitivity") || "5");
  const [alertAudio, setAlertAudio] = useState(() => localStorage.getItem("wqms-alert-audio") !== "false");
  const [alertBanner, setAlertBanner] = useState(() => localStorage.getItem("wqms-alert-banner") !== "false");

  const handleSave = () => {
    localStorage.setItem("wqms-threshold-strict", String(strictMode));
    localStorage.setItem("wqms-anomaly-sensitivity", anomalySensitivity);
    localStorage.setItem("wqms-alert-audio", String(alertAudio));
    localStorage.setItem("wqms-alert-banner", String(alertBanner));

    playSplashChime();
    toast.showSuccess("Regulatory compliance and alert parameters saved");
  };

  const handleReset = () => {
    setStrictMode(false);
    setAnomalySensitivity("5");
    setAlertAudio(true);
    setAlertBanner(true);

    localStorage.removeItem("wqms-threshold-strict");
    localStorage.removeItem("wqms-anomaly-sensitivity");
    localStorage.removeItem("wqms-alert-audio");
    localStorage.removeItem("wqms-alert-banner");

    toast.showInfo("Restored statutory BIS default enforcement profile");
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-800/50">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Regulatory Standards
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            BIS IS 10500:2012 Compliance Rules & Anomaly Alerts
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Configure threshold relaxation rules, Isolation Forest anomaly sensitivity, and incident notification alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Standard Profile</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Rules</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Statutory Enforcement Mode */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Statutory Limit Enforcement Mode
            </h4>
            <span className="text-xs font-mono font-bold uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 px-2.5 py-0.5 rounded-md">
              IS 10500:2012
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Choose whether the system strictly flags values above the Recommended Target (e.g., Turbidity &gt; 1.0 NTU) or permits relaxation up to the Permissible Limit (e.g., 5.0 NTU) when no alternative source is available.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="radio"
                name="enforcementMode"
                checked={!strictMode}
                onChange={() => setStrictMode(false)}
                className="mt-0.5 accent-cyan-500"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-white block">Dual-Tier Evaluation (Recommended Standard)</span>
                <span className="text-xs text-slate-400 mt-1 block leading-relaxed">
                  Identifies values in the permissible band (Turbidity 1.0–5.0 NTU, TDS 500–2000 mg/L) as conditionally acceptable in absence of alternative source.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <input
                type="radio"
                name="enforcementMode"
                checked={strictMode}
                onChange={() => setStrictMode(true)}
                className="mt-0.5 accent-cyan-500"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-white block">Strict Acceptable Target Only</span>
                <span className="text-xs text-slate-400 mt-1 block leading-relaxed">
                  Treats any value exceeding the recommended target (Turbidity &gt; 1.0 NTU or TDS &gt; 500 mg/L) as a primary breach with zero relaxation.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 2: Isolation Forest Anomaly Sensitivity */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Isolation Forest Contamination Rate
            </h4>
            <span className="text-xs font-mono font-bold uppercase bg-purple-950/60 text-purple-400 border border-purple-800/60 px-2.5 py-0.5 rounded-md">
              Unsupervised ML
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Defines the expected proportion of outliers in the feature space dataset. Governs the decision threshold for flagging multidimensional sensor drift.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold text-slate-300">Contamination Factor:</span>
              <span className="font-mono font-black text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-800/60">
                {anomalySensitivity}% Outlier Bound
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={anomalySensitivity}
              onChange={(e) => setAnomalySensitivity(e.target.value)}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>1% (Conservative)</span>
              <span>5% (Default)</span>
              <span>15% (Aggressive)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Alert Channels & Notifications */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Regulatory Breach Notification Dispatchers
            </h4>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Real-Time Event Bus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Toggle 1: Warning Chime */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700/60 transition-colors">
              <div>
                <span className="text-sm font-bold text-white block">Acoustic Audio Alarm on Breach</span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Emits dual-tone synthesizer pulse when a parameter breaches BIS bounds
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAlertAudio(!alertAudio)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ml-4 ${
                  alertAudio ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  alertAudio ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>

            {/* Toggle 2: Visual Banner Alert */}
            <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700/60 transition-colors">
              <div>
                <span className="text-sm font-bold text-white block">High-Priority Banner Alerts</span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Displays persistent red notification toast across all portal routes upon violations
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAlertBanner(!alertBanner)}
                className={`w-12 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ml-4 ${
                  alertBanner ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-slate-800"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  alertBanner ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryThresholdsTab;