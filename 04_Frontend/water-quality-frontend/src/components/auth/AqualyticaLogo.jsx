const AqualyticaLogo = ({ className = "w-64 h-64", showText = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Dynamic 3D Water Droplet & Cyber Sensing Network SVG Logo */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_20px_40px_rgba(6,182,212,0.35)]"
      >
        <defs>
          {/* Main Cyan to Blue to Emerald Gradient */}
          <linearGradient id="aqua-grad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#38BDF8" /> {/* Sky Blue */}
            <stop offset="50%" stopColor="#06B6D4" /> {/* Cyan */}
            <stop offset="100%" stopColor="#10B981" /> {/* Emerald Green */}
          </linearGradient>

          {/* Inner Droplet Gradient */}
          <linearGradient id="droplet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="60%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Glow filter for sensor nodes */}
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="svg-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* 1. OUTER TELEMETRY SENSOR RING */}
        <circle
          cx="120"
          cy="120"
          r="88"
          stroke="url(#aqua-grad)"
          strokeWidth="4"
          strokeDasharray="12 6 4 6"
          fill="none"
          opacity="0.85"
          filter="url(#svg-shadow)"
        />

        {/* 2. INNER PULSING ORBIT */}
        <circle
          cx="120"
          cy="120"
          r="72"
          stroke="#06B6D4"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />

        {/* 3. CENTER WATER DROPLET WITH SENSOR WAVE INTERSECTION */}
        <g filter="url(#svg-shadow)">
          <path
            d="M 120 45 
               C 120 45 165 105 165 135 
               A 45 45 0 0 1 75 135 
               C 75 105 120 45 120 45 Z"
            fill="url(#droplet-grad)"
          />

          {/* Droplet Highlight Curved Wave */}
          <path
            d="M 95 135 Q 120 120 145 135"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M 100 145 Q 120 135 140 145"
            stroke="#67E8F9"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Droplet Specular Reflection */}
          <path
            d="M 105 85 C 100 95 95 110 95 120"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />
        </g>

        {/* 4. HARDWARE TELEMETRY SENSOR NODES (pH, TDS, Turbidity, Temp) */}
        <circle cx="120" cy="32" r="5" fill="#38BDF8" filter="url(#cyan-glow)" />
        <circle cx="208" cy="120" r="5" fill="#06B6D4" filter="url(#cyan-glow)" />
        <circle cx="120" cy="208" r="5" fill="#10B981" filter="url(#cyan-glow)" />
        <circle cx="32" cy="120" r="5" fill="#38BDF8" filter="url(#cyan-glow)" />

        {/* Digital Pulse Nodes */}
        <rect x="178" y="60" width="6" height="6" rx="1.5" fill="#38BDF8" />
        <rect x="56" y="174" width="6" height="6" rx="1.5" fill="#10B981" />
        <rect x="176" y="174" width="7" height="7" rx="2" fill="#06B6D4" />
        <rect x="58" y="60" width="5" height="5" rx="1" fill="#38BDF8" />
      </svg>

      {/* 5. TYPOGRAPHY TEXT AND TAGLINE */}
      {showText && (
        <div className="text-center mt-6 space-y-2">
          {/* Logo Brand Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
            <span className="text-white">Aqualy</span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              tica
            </span>
          </h1>

          {/* Logo Tagline */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1px] w-8 bg-cyan-500/50" />
            <span className="text-xs font-semibold text-cyan-300 tracking-wider">
              AI Water Quality Intelligence Platform
            </span>
            <div className="h-[1px] w-8 bg-emerald-500/50" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AqualyticaLogo;
