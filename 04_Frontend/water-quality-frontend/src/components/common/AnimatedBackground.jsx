import { motion } from "framer-motion";

// Bubbles simulating rising oxygen/bubbles in water - declared outside to guarantee render purity
const bubbles = Array.from({ length: 12 }).map((_, i) => {
  const x = Math.random() * 100;
  return {
    id: i,
    size: Math.random() * 6 + 4,
    x: x,
    xOffset: x + (Math.random() * 4 - 2),
    delay: Math.random() * 8,
    duration: Math.random() * 14 + 12,
    opacity: Math.random() * 0.12 + 0.04
  };
});

const AnimatedBackground = () => {

  // Glowing spatial monitoring nodes
  const nodes = [
    { id: 1, x: "15%", y: "25%", color: "shadow-[0_0_12px_rgba(6,182,212,0.4)] bg-cyan-400/30", delay: 0 },
    { id: 2, x: "85%", y: "15%", color: "shadow-[0_0_12px_rgba(20,184,166,0.4)] bg-teal-400/30", delay: 1.2 },
    { id: 3, x: "30%", y: "75%", color: "shadow-[0_0_12px_rgba(59,130,246,0.4)] bg-blue-400/30", delay: 0.6 },
    { id: 4, x: "75%", y: "65%", color: "shadow-[0_0_12px_rgba(16,185,129,0.4)] bg-emerald-400/30", delay: 1.8 }
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617] select-none">
      
      {/* Liquid Gooey Morphic SVG Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
            {/* Heightening the alpha contrast forces overlapping blurred circles to merge like fluid drops */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 20 -8" 
              result="goo" 
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* 1. Gooey/Liquid Morphing Blob Orbs (Apply the SVG goo filter here) */}
      <div className="absolute inset-0 opacity-30" style={{ filter: "url(#goo)" }}>
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -70, 40, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-cyan-700 blur-[2px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 60, 0],
            y: [0, 40, -60, 0],
            scale: [1, 0.85, 1.15, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-teal-800 blur-[2px]"
        />
        <motion.div
          animate={{
            x: [0, 40, -50, 0],
            y: [0, 50, 30, 0],
            scale: [1, 1.1, 0.8, 1]
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-blue-800 blur-[2px]"
        />
      </div>

      {/* Deep Ocean Liquid Background Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-gradient-to-bl from-cyan-950/10 via-teal-950/5 to-transparent blur-3xl opacity-80" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gradient-to-tr from-blue-950/10 via-emerald-950/5 to-transparent blur-3xl opacity-70" />

      {/* 2. Premium Noise/Grain Texture Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.012]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* 3. Scientific Sensor Grid Backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.025]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 4. Glowing Spatial Sensor Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{ left: node.x, top: node.y }}
        >
          <span className={`flex h-2 w-2 rounded-full ${node.color}`} />
          <motion.span
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeOut"
            }}
            className="absolute -top-1 -left-1 h-4 w-4 rounded-full border border-cyan-500/30"
          />
        </div>
      ))}

      {/* 5. Glowing Water Current Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        <defs>
          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0} />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity={1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0} />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity={1} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M-100 220 C 300 120, 600 320, 1000 170 C 1400 80, 1800 270, 2200 180"
          fill="none"
          stroke="url(#streamGrad1)"
          strokeWidth="1.2"
          strokeDasharray="16 20"
          animate={{
            strokeDashoffset: [-1000, 0]
          }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity
          }}
        />

        <motion.path
          d="M-120 480 C 250 580, 650 380, 1050 480 C 1450 580, 1850 380, 2250 480"
          fill="none"
          stroke="url(#streamGrad2)"
          strokeWidth="1.2"
          strokeDasharray="24 16"
          animate={{
            strokeDashoffset: [1000, 0]
          }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity
          }}
        />
      </svg>

      {/* 6. Rising Bubble Microparticles */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: "110vh", x: `${b.x}vw`, opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, b.opacity, b.opacity, 0],
            x: [
              `${b.x}vw`, 
              `${b.xOffset}vw`, 
              `${b.x}vw`
            ]
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-cyan-400/20 border border-white/5"
          style={{
            width: b.size,
            height: b.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 6px rgba(6, 182, 212, 0.15)"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
