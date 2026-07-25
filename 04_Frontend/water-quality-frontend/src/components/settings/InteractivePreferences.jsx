import { useState } from "react";
import { Volume2, Sparkles } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const InteractivePreferences = () => {
  const toast = useToast();
  
  const [audioEnabled, setAudioEnabled] = useState(() => {
    return localStorage.getItem("wqms-audio-enabled") !== "false";
  });

  const [trailEnabled, setTrailEnabled] = useState(() => {
    return localStorage.getItem("wqms-cursor-trail") !== "false";
  });

  const toggleAudio = () => {
    const nextVal = !audioEnabled;
    setAudioEnabled(nextVal);
    localStorage.setItem("wqms-audio-enabled", String(nextVal));
    if (nextVal) {
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
      toast.showSuccess("Cursor bubble trail activated. Refresh page to apply.");
    } else {
      toast.showWarning("Cursor bubble trail deactivated. Refresh page to apply.");
    }
  };

  return (
    <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Sparkles className="w-5.5 h-5.5 text-cyan-400" />
          Interactive Portal Settings
        </h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Customize sensory feedback and portal special effects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Toggle 1: Audio */}
        <button
          onClick={toggleAudio}
          className={`flex text-left p-6 rounded-2xl border transition-all cursor-pointer relative items-center gap-5 justify-between ${
            audioEnabled
              ? "bg-slate-950/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.12)]"
              : "bg-slate-950/30 border-slate-850 hover:border-slate-700/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl border ${
              audioEnabled ? "bg-cyan-950/30 border-cyan-800/40 text-cyan-400" : "bg-slate-950/40 border-slate-850 text-slate-400"
            }`}>
              <Volume2 className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-100 block">Status Sound Chimes</span>
              <span className="text-[10px] text-slate-500 mt-1 block leading-normal">Play audio verification chimes upon predictions.</span>
            </div>
          </div>

          <div className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ${
            audioEnabled ? "bg-cyan-600" : "bg-slate-800"
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
              audioEnabled ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
        </button>

        {/* Toggle 2: Cursor Trail */}
        <button
          onClick={toggleTrail}
          className={`flex text-left p-6 rounded-2xl border transition-all cursor-pointer relative items-center gap-5 justify-between ${
            trailEnabled
              ? "bg-slate-950/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.12)]"
              : "bg-slate-950/30 border-slate-850 hover:border-slate-700/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl border ${
              trailEnabled ? "bg-cyan-950/30 border-cyan-800/40 text-cyan-400" : "bg-slate-950/40 border-slate-850 text-slate-400"
            }`}>
              <Sparkles className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-100 block">Bubble Cursor Trail</span>
              <span className="text-[10px] text-slate-500 mt-1 block leading-normal">Enable fading water droplet particles trail following mouse.</span>
            </div>
          </div>

          <div className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors cursor-pointer shrink-0 ${
            trailEnabled ? "bg-cyan-600" : "bg-slate-800"
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
              trailEnabled ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
        </button>

      </div>
    </div>
  );
};

export default InteractivePreferences;
