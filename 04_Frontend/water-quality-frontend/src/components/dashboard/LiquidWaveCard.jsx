import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

const LiquidWaveCard = ({
  title,
  value,
  unit,
  minVal, // Min full scale
  maxVal, // Max full scale
  safeMin, // EPA safe min
  safeMax, // EPA safe max
  themeColor = "cyan"
}) => {
  const canvasRef = useRef(null);
  const val = Number(value) || 0;
  
  // Verify safety boundaries
  const isSafe = val >= safeMin && val <= safeMax;

  // Normalize current level to fill height (0.15 to 0.85 to keep wave visible)
  const normalized = (val - minVal) / ((maxVal - minVal) || 1);
  const targetFill = Math.min(0.85, Math.max(0.15, normalized));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let angle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Wave color selection based on safety status
    let waveColor = "rgba(6, 182, 212, 0.15)";
    let waveColorAccent = "rgba(6, 182, 212, 0.25)";
    
    if (!isSafe) {
      waveColor = "rgba(239, 68, 68, 0.15)";
      waveColorAccent = "rgba(239, 68, 68, 0.25)";
    } else if (themeColor === "teal") {
      waveColor = "rgba(20, 184, 166, 0.15)";
      waveColorAccent = "rgba(20, 184, 166, 0.25)";
    } else if (themeColor === "green") {
      waveColor = "rgba(16, 185, 129, 0.15)";
      waveColorAccent = "rgba(16, 185, 129, 0.25)";
    } else if (themeColor === "orange") {
      waveColor = "rgba(249, 115, 22, 0.15)";
      waveColorAccent = "rgba(249, 115, 22, 0.25)";
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const fillY = height - (height * targetFill);

      // Draw Wave 1 (Accent wave behind)
      ctx.beginPath();
      ctx.fillStyle = waveColor;
      for (let x = 0; x <= width; x++) {
        // Sine wave calculations
        const y = fillY + Math.sin((x / 40) + angle) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();
      ctx.closePath();

      // Draw Wave 2 (Main wave in front)
      ctx.beginPath();
      ctx.fillStyle = waveColorAccent;
      for (let x = 0; x <= width; x++) {
        const y = fillY + Math.cos((x / 50) + angle * 1.3) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();
      ctx.closePath();

      angle += 0.025; // Wave animation speed
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [targetFill, isSafe, themeColor]);

  const handleCardClick = () => {
    // Dispatch global event to open handbook panel
    window.dispatchEvent(new CustomEvent("open-parameter-drawer", { detail: title }));
  };

  const cardBorderColor = isSafe 
    ? "border-slate-800/40 hover:border-cyan-500/30" 
    : "border-red-900/30 hover:border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]";

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`bg-slate-900/30 backdrop-blur-3xl rounded-3xl p-6 shadow-2xl border transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[165px] cursor-pointer group ${cardBorderColor}`}
    >
      {/* Wave Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Absolute positioned indicator icons in top-right */}
      <div className="absolute top-4.5 right-4.5 flex items-center gap-1.5 z-10">
        {isSafe ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
        )}
        <HelpCircle className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-450 transition-colors shrink-0" />
      </div>

      {/* Center-aligned Title Header */}
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest z-10 relative mb-3">{title}</span>

      {/* Centered Value */}
      <div className="z-10 relative flex flex-col items-center">
        <h2 className="text-3xl font-black text-slate-100 tracking-tight leading-none mt-1">
          {val.toFixed(2)} <span className="text-xs font-black text-slate-500 uppercase ml-0.5">{unit}</span>
        </h2>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2.5">
          {isSafe ? "Status: Optimal" : "Status: Out of range"}
        </p>
      </div>
    </motion.div>
  );
};

export default LiquidWaveCard;
