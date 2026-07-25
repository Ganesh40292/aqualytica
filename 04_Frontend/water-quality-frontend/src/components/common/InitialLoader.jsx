import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Configuration for floating binary background codes
const BINARY_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100 + 10,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 5 + 4,
  delay: Math.random() * -6,
  opacity: Math.random() * 0.4 + 0.1,
  text: Math.random() > 0.5 ? "1" : "0"
}));

// Configuration for floating water molecules
const WATER_MOLECULES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * -10,
  opacity: Math.random() * 0.25 + 0.05
}));

const InitialLoader = ({ onComplete }) => {
  const [phase, setPhase] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLineIdx, setTerminalLineIdx] = useState(0);

  const terminalLines = [
    { text: "Initializing AI Core...", status: "✓ Complete" },
    { text: "Loading Water Intelligence Engine...", status: "✓ Complete" },
    { text: "Connecting Spring Boot REST API...", status: "✓ Connected" },
    { text: "Connecting Python ML API...", status: "✓ Connected" },
    { text: "Connecting MySQL Database...", status: "✓ Connected" },
    { text: "Loading Random Forest Model...", status: "✓ Loaded" },
    { text: "Preparing Smart Dashboard...", status: "✓ Ready" }
  ];

  useEffect(() => {
    // Phase 1: Brand Reveal (0s - 1s)
    // Phase 2: AI System Initialization (1s - 2.5s)
    const toPhase2 = setTimeout(() => setPhase(2), 1000);

    // Phase 3: Water Intelligence Scan (2.5s - 3.5s)
    const toPhase3 = setTimeout(() => setPhase(3), 2500);

    // Phase 4: System Ready (3.5s - 4.0s)
    const toPhase4 = setTimeout(() => setPhase(4), 3500);

    // Trigger onComplete to transition to Dashboard
    const toEnd = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000);

    return () => {
      clearTimeout(toPhase2);
      clearTimeout(toPhase3);
      clearTimeout(toPhase4);
      clearTimeout(toEnd);
    };
  }, [onComplete]);

  // Phase 2 Terminal Line sequence increments
  useEffect(() => {
    if (phase === 2) {
      const interval = setInterval(() => {
        setTerminalLineIdx((prev) => Math.min(prev + 1, terminalLines.length));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [phase, terminalLines.length]);

  // Phase 3 Scan Progress incremental sequence
  useEffect(() => {
    if (phase === 3) {
      const steps = [0, 15, 34, 58, 76, 92, 100];
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          setScanProgress(steps[stepIdx]);
          stepIdx++;
        } else {
          clearInterval(interval);
        }
      }, 130);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: "blur(12px)" 
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] font-sans overflow-hidden select-none"
    >
      {/* Inline styles for circuit flow keyframe animations */}
      <style>{`
        @keyframes circuitFlow {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ripplePulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes scanSweep {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      {/* Futuristic Grid & Radial Glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Floating Microscopic Water Molecules */}
      {WATER_MOLECULES.map((m) => (
        <motion.div
          key={`mol-${m.id}`}
          className="absolute rounded-full border border-cyan-500/20 bg-cyan-950/10 pointer-events-none"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            filter: "blur(1px)"
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            opacity: [m.opacity, m.opacity * 2, m.opacity]
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Binary Code Particles */}
      {phase >= 3 && BINARY_PARTICLES.map((p) => (
        <motion.div
          key={`bin-${p.id}`}
          className="absolute font-mono text-cyan-500/20 pointer-events-none select-none font-bold text-[9px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, p.opacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        >
          {p.text}
        </motion.div>
      ))}

      {/* Cinematic Ripples Behind Logo (Phase 1 & 2) */}
      {phase <= 2 && (
        <div className="absolute w-[400px] h-[400px] pointer-events-none flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border border-cyan-500/20" style={{ animation: "ripplePulse 3s linear infinite" }} />
          <div className="absolute w-[80%] h-[80%] rounded-full border border-teal-500/10" style={{ animation: "ripplePulse 3s linear infinite 1.5s" }} />
        </div>
      )}

      {/* Animated Circuit Board Background Lines (Phase 2 & 3) */}
      {phase >= 2 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]" viewBox="0 0 800 600">
          <path 
            d="M100,100 L300,100 L400,200 L400,400 L500,500 L700,500" 
            stroke="#06b6d4" 
            strokeWidth="1.5" 
            fill="none" 
            strokeDasharray="1000" 
            strokeDashoffset="1000" 
            style={{ animation: "circuitFlow 8s linear infinite" }}
          />
          <path 
            d="M700,150 L500,150 L400,250 L400,350 L300,450 L100,450" 
            stroke="#14b8a6" 
            strokeWidth="1.5" 
            fill="none" 
            strokeDasharray="1000" 
            strokeDashoffset="1000" 
            style={{ animation: "circuitFlow 8s linear infinite reverse" }}
          />
        </svg>
      )}

      {/* CENTRAL ANIMATION BODY wrapper - Scaled Up width & spacing */}
      <div className="flex flex-col items-center max-w-[480px] w-full px-6 text-center z-10 space-y-10">
        
        <AnimatePresence mode="wait">
          {/* PHASE 1 & 2: Brand Reveal Logo Image - Enlarged to w-52 h-52 */}
          {phase <= 2 && (
            <motion.div
              key="logo-reveal-stage"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [-8, 8, -8],
                rotateY: [0, 8, -8, 0]
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                scale: { duration: 0.8, ease: "easeOut" },
                opacity: { duration: 0.8 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative w-52 h-52 flex items-center justify-center rounded-[40px] bg-slate-950/80 border border-slate-850 shadow-[0_0_50px_rgba(6,182,212,0.18)] p-6.5"
            >
              <img src="/logo_loader.png" alt="Aqualytica Logo" className="w-full h-full object-contain" />
              {/* Backlight glow halo */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-cyan-500/5 to-transparent blur-lg -z-10" />
            </motion.div>
          )}

          {/* PHASE 3 & 4: Logo Morph Into Glowing Droplet - Scaled Up sizing */}
          {phase >= 3 && (
            <motion.div
              key="droplet-morph-stage"
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1.05, opacity: 1, rotateY: 0 }}
              exit={{ scale: 1.3, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-56 h-64 flex items-center justify-center"
            >
              {/* Floating Holographic concentric orbits - Extended offset */}
              <div className="absolute inset-0 -m-10 pointer-events-none">
                <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_8s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
                <div className="absolute inset-5 border border-teal-500/10 rounded-full animate-[spin_5s_linear_infinite_reverse]" style={{ borderStyle: 'double' }} />
              </div>

              {/* Glowing vector water droplet - Enlarged from 36x44 to 48x56 */}
              <div className="relative w-48 h-56">
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.35)]">
                  <defs>
                    <clipPath id="drop-mask">
                      <path d="M50,10 C50,10 90,55 90,80 A40,40 0 0,1 10,80 C10,55 50,10 50,10 Z" />
                    </clipPath>
                    <linearGradient id="drop-liquid-grad" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Droplet base structure */}
                  <path 
                    d="M50,10 C50,10 90,55 90,80 A40,40 0 0,1 10,80 C10,55 50,10 50,10 Z" 
                    fill="rgba(15, 23, 42, 0.75)" 
                    stroke="#06b6d4" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Clipped filling wave */}
                  <g clipPath="url(#drop-mask)">
                    <motion.rect
                      x="0"
                      y={120 - (scanProgress * 1.1)}
                      width="100"
                      height="120"
                      fill="url(#drop-liquid-grad)"
                      transition={{ type: "tween", ease: "easeInOut" }}
                    />
                    
                    {/* Glowing circuit logic lines inside droplet */}
                    <path 
                      d="M50,25 L50,65 M50,65 L32,83 M50,65 L68,83 M32,83 L20,83 M68,83 L80,83" 
                      stroke="rgba(255, 255, 255, 0.35)" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                    
                    {/* Glowing logic nodes */}
                    <circle cx="50" cy="45" r="3" fill="#ffffff" className="animate-pulse" />
                    <circle cx="32" cy="83" r="3" fill="#10b981" />
                    <circle cx="68" cy="83" r="3" fill="#06b6d4" />
                    <circle cx="20" cy="83" r="2" fill="#ffffff" />
                    <circle cx="80" cy="83" r="2" fill="#ffffff" />
                  </g>
                </svg>

                {/* Vertical Scanner sweep line */}
                <div 
                  className="absolute left-2 right-2 h-[2.5px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none"
                  style={{ 
                    animation: "scanSweep 2.5s ease-in-out infinite",
                    clipPath: "url(#drop-mask)"
                  }} 
                />
              </div>

              {/* Droplet progress circular overlay - Enlarged indicator scale */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Circular ring indicator */}
                <svg className="w-60 h-60 -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="105"
                    stroke="rgba(6,182,212,0.08)"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="120"
                    cy="120"
                    r="105"
                    stroke="#06b6d4"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 105}
                    strokeDashoffset={2 * Math.PI * 105 * (1 - scanProgress / 100)}
                    strokeLinecap="round"
                    className="shadow-[0_0_12px_rgba(6,182,212,0.55)]"
                    transition={{ type: "tween", ease: "easeInOut" }}
                  />
                </svg>
                
                {/* Centered counter overlay display */}
                <span className="absolute bottom-[-22px] text-xs font-mono font-black text-cyan-400 tracking-widest bg-slate-955 border border-cyan-900/60 px-3.5 py-1 rounded-md shadow-lg">
                  {scanProgress}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM DICTIONARY TERMINAL & STRAP LINES */}
        <div className="w-full flex flex-col items-center">
          
          {/* Phase 1 Brand text - Enlarged Sizing */}
          {phase === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-slate-100 leading-none">
                AQUALYTICA
              </h2>
              <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest leading-normal">
                AI-Powered Water Quality Intelligence Platform
              </p>
            </motion.div>
          )}

          {/* Phase 2: AI System Initialization Terminal Box - Enlarged box and texts */}
          {phase === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-slate-950/90 border border-slate-900 rounded-3xl p-6 text-left font-mono shadow-[0_0_25px_rgba(0,0,0,0.6)] relative overflow-hidden max-h-[220px] min-h-[220px] flex flex-col justify-start"
            >
              {/* Terminal glass glossy shine */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="space-y-2.5 overflow-y-auto scrollbar-none pr-1">
                {terminalLines.slice(0, terminalLineIdx).map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] leading-snug">
                    <span className="text-slate-400 font-bold tracking-wide">
                      &gt; {line.text}
                    </span>
                    <span className="text-emerald-400 font-black tracking-widest shrink-0 pl-2">
                      {line.status}
                    </span>
                  </div>
                ))}
                {terminalLineIdx < terminalLines.length && (
                  <div className="text-[11.5px] text-cyan-400/80 animate-pulse">
                    &gt; Working...
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Phase 3: Water Intelligence Scan Subtexts - Enlarged scale */}
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1.5 pt-6"
            >
              <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] leading-none block">
                Scanning Droplet Metrics
              </span>
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider block">
                Performing Random Forest Estimations
              </span>
            </motion.div>
          )}

          {/* Phase 4: System Ready Sequence - Enlarged scale */}
          {phase === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-6"
            >
              <div className="flex items-center gap-2.5 justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[12px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                  ✓ System Ready
                </span>
              </div>
              <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest block animate-pulse">
                Launching Dashboard...
              </span>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default InitialLoader;
