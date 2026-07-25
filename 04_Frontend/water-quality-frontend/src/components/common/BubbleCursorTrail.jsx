import { useEffect, useRef } from "react";

const BubbleCursorTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check user preference (can disable trail in settings if they want)
    if (localStorage.getItem("wqms-cursor-trail") === "false") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    class TrailBubble {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 4 + 1.5; // Bubble size
        this.vx = Math.random() * 1.0 - 0.5; // horizontal drift
        this.vy = -(Math.random() * 1.2 + 0.6); // float upwards
        this.life = 1.0; // alpha life span
        this.decay = Math.random() * 0.02 + 0.015; // fade rate
        this.wiggle = Math.random() * 100;
        this.wiggleSpeed = Math.random() * 0.05 + 0.02;
      }

      update() {
        this.x += this.vx + Math.sin(this.wiggle) * 0.2;
        this.y += this.vy;
        this.wiggle += this.wiggleSpeed;
        this.life -= this.decay;
      }

      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x - this.radius * 0.2,
          this.y - this.radius * 0.2,
          this.radius * 0.1,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.life * 0.4})`);
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${this.life * 0.2})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    let particles = [];
    const maxParticles = 40;

    const handleMouseMove = (e) => {
      // Limit bubble spawning to prevent clogging the loop
      if (Math.random() < 0.35 && particles.length < maxParticles) {
        particles.push(new TrailBubble(e.clientX, e.clientY));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return p.life > 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default BubbleCursorTrail;
