import { useEffect, useRef } from "react";

const TelemetryDataStreamParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 100; // Fixed horizontal height bridge
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.reset();
        // Distribute starting X across the width
        this.x = Math.random() * canvas.width;
      }

      reset() {
        this.x = 0;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1.5;
        this.speed = Math.random() * 2.5 + 1.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        
        // Randomly choose teal or cyan
        this.color = Math.random() > 0.5 ? "6, 182, 212" : "20, 184, 166"; // Cyan / Teal
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.width) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.min(60, Math.floor(canvas.width / 15));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid helper lines representing stream lanes
      ctx.strokeStyle = "rgba(30, 41, 59, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 20; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
        ctx.closePath();
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-[100px] bg-slate-950/20 border border-slate-900/40 rounded-2xl overflow-hidden shadow-inner flex items-center justify-between px-6 select-none my-6">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/5 via-transparent to-teal-950/5 pointer-events-none" />
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Dynamic textual metadata overlay */}
      <div className="z-10 flex flex-col justify-center">
        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest leading-none">IoT Packet Stream</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Simulating hardware packet stream</span>
      </div>

      <div className="z-10 flex flex-col items-end justify-center text-right">
        <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest leading-none">Transmission: 9.6 kbps</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Safe signals active</span>
      </div>
    </div>
  );
};

export default TelemetryDataStreamParticles;
