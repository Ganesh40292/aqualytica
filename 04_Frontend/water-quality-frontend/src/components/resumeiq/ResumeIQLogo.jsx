const ResumeIQLogo = ({ className = "w-64 h-64", showText = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Dynamic 3D-effect SVG Logo */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Main Blue to Purple Gradient */}
          <linearGradient id="logo-blue-grad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#38BDF8" /> {/* Sky Blue */}
            <stop offset="50%" stopColor="#2563EB" /> {/* Royal Blue */}
            <stop offset="100%" stopColor="#7C3AED" /> {/* Purple */}
          </linearGradient>

          {/* Tagline Gradient */}
          <linearGradient id="logo-tag-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Folded Corner Flap Gradient */}
          <linearGradient id="flap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Simple Drop Shadow Filter for SVG elements */}
          <filter id="svg-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. OUTER CIRCULAR SWOOSH */}
        <path
          d="M 120 30 
             A 85 85 0 1 0 155 200 
             A 85 85 0 0 0 152 48"
          stroke="url(#logo-blue-grad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          filter="url(#svg-shadow)"
        />

        {/* 2. THE FLOATING RESUME SHEET */}
        <g filter="url(#svg-shadow)">
          {/* White Page base */}
          <path
            d="M 85 60 
               H 130 
               L 148 78 
               V 180 
               C 148 182 146 184 144 184 
               H 86 
               C 84 184 82 182 82 180 
               V 63 
               C 82 61 84 60 85 60 Z"
            fill="#F8FAFC"
          />

          {/* Folded Top-Right Corner Flap */}
          <path
            d="M 130 60 
               V 78 
               H 148 
               Z"
            fill="url(#flap-grad)"
          />

          {/* Avatar Head */}
          <circle cx="103" cy="92" r="9" fill="#1E3A8A" />
          
          {/* Avatar Shoulders */}
          <path
            d="M 91 116 
               C 91 108 96 104 103 104 
               C 110 104 115 108 115 116 
               Z"
            fill="#1E3A8A"
          />

          {/* Resume Content Lines */}
          <rect x="91" y="126" width="38" height="3" rx="1.5" fill="#1E3A8A" opacity="0.8" />
          <rect x="91" y="136" width="38" height="3" rx="1.5" fill="#1E3A8A" opacity="0.8" />

          {/* Skill Checklist Checkmarks */}
          <path d="M 91 150 L 94 153 L 100 147" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 91 162 L 94 165 L 100 159" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 91 174 L 94 177 L 100 171" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Text lines next to Checkmarks */}
          <rect x="105" y="149" width="20" height="3" rx="1.5" fill="#1E3A8A" opacity="0.7" />
          <rect x="105" y="161" width="24" height="3" rx="1.5" fill="#1E3A8A" opacity="0.7" />
          <rect x="105" y="173" width="20" height="3" rx="1.5" fill="#1E3A8A" opacity="0.7" />
        </g>

        {/* 3. THE "IQ" SYMBOL */}
        <g filter="url(#svg-shadow)">
          {/* Letter I */}
          <rect x="156" y="120" width="8" height="42" rx="2" fill="url(#logo-blue-grad)" />

          {/* Letter Q */}
          <path
            d="M 188 120 
               C 200 120 208 129 208 141 
               C 208 153 200 162 188 162 
               C 176 162 168 153 168 141 
               C 168 129 176 120 188 120 Z 
               M 188 128 
               C 181 128 176 133 176 141 
               C 176 149 181 154 188 154 
               C 195 154 200 149 200 141 
               C 200 133 195 128 188 128 Z"
            fill="url(#logo-blue-grad)"
            fillRule="evenodd"
          />
          {/* Diagonal tail of Q */}
          <rect x="195" y="150" width="8" height="18" rx="2" transform="rotate(-40 195 150)" fill="url(#logo-blue-grad)" />
        </g>

        {/* 4. FLOATING DIGITAL PIXELS (Symbolizing AI/Data) */}
        <rect x="180" y="52" width="6" height="6" rx="1" fill="#38BDF8" filter="url(#svg-shadow)" />
        <rect x="190" y="66" width="7" height="7" rx="1.5" fill="#2563EB" filter="url(#svg-shadow)" />
        <rect x="175" y="74" width="5" height="5" rx="1" fill="#7C3AED" filter="url(#svg-shadow)" />
        <rect x="188" y="85" width="8" height="8" rx="2" fill="#2563EB" filter="url(#svg-shadow)" />
        <rect x="175" y="96" width="6" height="6" rx="1" fill="#38BDF8" filter="url(#svg-shadow)" />
      </svg>

      {/* 5. TYPOGRAPHY TEXT AND TAGLINE */}
      {showText && (
        <div className="text-center mt-6 space-y-2">
          {/* Logo Brand Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
            <span>Resume</span>
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              IQ
            </span>
          </h1>

          {/* Logo Tagline */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="h-[1px] w-8 bg-blue-500/50" />
            <span className="text-xs font-medium text-slate-300 tracking-wider">
              Smart Resume. Smarter Career.
            </span>
            <div className="h-[1px] w-8 bg-purple-500/50" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeIQLogo;
