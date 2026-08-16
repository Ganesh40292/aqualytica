import { useState } from "react";
import { motion } from "framer-motion";
import GlassAuthCard from "./GlassAuthCard";
import AISceneLeft from "./AISceneLeft";
import { CheckCircle2, ArrowRight } from "lucide-react";

const AqualyticaAuth = ({ initialTab = "login", onComplete }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setAuthenticatedUser(userData);
    if (onComplete) {
      onComplete(userData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-[#040812]">
      
      {/* LEFT PANEL (50% Width): Split screen visual container (Untouched) */}
      <div className="w-full lg:w-1/2 h-full hidden lg:block border-r border-slate-800/80">
        <AISceneLeft activeTab={activeTab} />
      </div>

      {/* RIGHT PANEL (50% Width): Animated Dark Cyber Background */}
      <div className="relative w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto bg-[#070e1c] text-white">
        
        {/* ANIMATED BACKGROUND LIGHT ORBS & PARTICLES */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.35, 0.6, 0.35]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-10 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[110px] pointer-events-none"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 40, 0],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.45, 0.2]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none"
        />

        {/* SUBTLE BACKGROUND GRID MESH PATTERN */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* AUTH CONTENT / CARD CONTAINER */}
        <div className="relative z-10 w-full flex items-center justify-center">
          {authenticatedUser ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-[480px] p-8 rounded-3xl bg-[#0c1629]/90 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-500 text-center space-y-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h3>
                <p className="text-sm text-slate-400 font-medium">
                  Signed in as <span className="text-cyan-400 font-bold">{authenticatedUser.fullName || authenticatedUser.username || authenticatedUser.email}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070d18] border border-slate-700/60 text-left space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Session Details</span>
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Aqualytica Telemetry Engine</span>
                  <span className="text-cyan-400 font-bold">Online v2.4</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuthenticatedUser(null)}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <span>Sign Out</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ) : (
            <GlassAuthCard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default AqualyticaAuth;
