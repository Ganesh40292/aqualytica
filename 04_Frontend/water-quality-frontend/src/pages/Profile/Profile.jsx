import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import PageWrapper from "../../components/common/PageWrapper";
import { User, ShieldCheck, Mail, KeyRound, Eye, EyeOff, UserCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Profile = () => {
  const toast = useToast();
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  
  // Dynamic Username State loaded from localStorage
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("wqms-username") || "Dr. A. Sharma";
  });
  
  const [editUsername, setEditUsername] = useState(username);

  const analyst = {
    role: "Lead Chemist",
    id: "ANALYST_04",
    email: "a.sharma@aqualytica.org",
    joined: "March 15, 2024"
  };

  // Change Password Form State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 3D Parallax Tilt Card setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMoveCard = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeaveCard = () => {
    x.set(0);
    y.set(0);
  };

  // Dynamic Floating Water Bubbles Background Canvas Animation (Inside Profile Card)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Bubble Class Definition
    class Bubble {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.radius = Math.random() * 5 + 2;
        this.speed = Math.random() * 1.0 + 0.3;
        this.opacity = Math.random() * 0.25 + 0.08;
        this.wiggleSpeed = Math.random() * 0.02 + 0.01;
        this.time = Math.random() * 100;
      }

      update() {
        this.time += this.wiggleSpeed;
        this.y -= this.speed;
        this.x += Math.sin(this.time) * 0.25;

        // Reset if bubble floats past top
        if (this.y < -10) {
          this.reset();
        }
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
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity + 0.2})`);
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, 0.005)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const bubbleCount = 25; // Adjusted count for the card boundary
    const bubbles = Array.from({ length: bubbleCount }, () => new Bubble());

    // Local Mouse Interaction inside Card
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMoveCanvas = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeaveCanvas = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const container = canvas.parentElement;
    container.addEventListener("mousemove", handleMouseMoveCanvas);
    container.addEventListener("mouseleave", handleMouseLeaveCanvas);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        const dx = bubble.x - mouse.x;
        const dy = bubble.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 70) {
          const force = (70 - distance) / 70;
          const directionX = dx / (distance || 1);
          bubble.x += directionX * force * 2.0;
        }

        bubble.update();
        bubble.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMoveCanvas);
      container.removeEventListener("mouseleave", handleMouseLeaveCanvas);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.showWarning("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.showError("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 6) {
      toast.showWarning("New password must be at least 6 characters long.");
      return;
    }

    toast.showSuccess("Credentials updated. Security key saved.");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      toast.showWarning("Username cannot be empty.");
      return;
    }
    
    localStorage.setItem("wqms-username", editUsername.trim());
    setUsername(editUsername.trim());
    toast.showSuccess("Username updated successfully.");
    
    // Broadcast event to update sidebar instantly
    window.dispatchEvent(new Event("storage"));
  };

  const toggleShowPass = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <PageWrapper className="flex flex-col items-center gap-8 py-6 relative overflow-hidden">
      
      {/* Centered 3D Parallax Profile Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMoveCard}
        onMouseLeave={handleMouseLeaveCard}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full max-w-md aspect-square bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center z-10 perspective-[1000px] select-none"
      >
        {/* Background Interactive Floating Water Droplets Canvas (Inside Card) */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none z-0" 
        />

        <div 
          style={{ transform: "translateZ(20px)" }}
          className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" 
        />
        
        {/* Avatar ring */}
        <div 
          style={{ transform: "translateZ(70px)" }}
          className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-cyan-500 to-teal-400 shrink-0 shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-6 z-10"
        >
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border border-slate-950">
            <User className="w-14 h-14 text-slate-400" />
          </div>
          <span className="absolute bottom-1.5 right-1.5 w-6.5 h-6.5 rounded-full bg-green-500 border-4 border-slate-900" />
        </div>

        <h3 
          style={{ transform: "translateZ(40px)" }}
          className="text-3xl font-black text-slate-100 flex items-center gap-2 justify-center z-10"
        >
          {username}
          <ShieldCheck className="w-7 h-7 text-cyan-400 shrink-0" />
        </h3>
      </motion.div>

      {/* Personal Details Section */}
      <div className="w-full max-w-md bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-6 z-10">
        <h4 className="text-xl font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 text-center">
          Personal Details
        </h4>

        <div className="grid grid-cols-1 gap-6 text-base font-semibold">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-955/20 border border-slate-850">
            <Mail className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Email Address</p>
              <p className="text-slate-200 mt-1 text-base font-bold">{localStorage.getItem("wqms-email") || analyst.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Username Block */}
      <div className="w-full max-w-md bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-6 z-10">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <UserCheck className="w-6 h-6 text-cyan-400 shrink-0" />
          <h4 className="text-xl font-bold text-slate-100 uppercase tracking-wider">
            Change Account Username
          </h4>
        </div>

        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">New Username</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-slate-955/60 border border-slate-855 rounded-xl px-4 py-3.5 text-base text-slate-200 placeholder-slate-800 focus:outline-none focus:border-cyan-500/45 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-100 font-black text-sm uppercase tracking-widest rounded-xl py-4 transition-colors cursor-pointer shadow-md hover:shadow-cyan-500/10"
          >
            Save Username
          </button>
        </form>
      </div>

      {/* Change Password Block */}
      <div className="w-full max-w-md bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-6 z-10">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <KeyRound className="w-6 h-6 text-cyan-400 shrink-0" />
          <h4 className="text-xl font-bold text-slate-100 uppercase tracking-wider">
            Update Security Credentials
          </h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div className="flex flex-col gap-5">
            
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPass.current ? "text" : "password"}
                  name="current"
                  value={passwords.current}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-955/60 border border-slate-855 rounded-xl px-4 py-3.5 text-base text-slate-200 placeholder-slate-800 focus:outline-none focus:border-cyan-500/45 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPass("current")}
                  className="absolute right-3 text-slate-600 hover:text-slate-400 cursor-pointer border-none bg-transparent"
                >
                  {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPass.new ? "text" : "password"}
                  name="new"
                  value={passwords.new}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="w-full bg-slate-955/60 border border-slate-855 rounded-xl px-4 py-3.5 text-base text-slate-200 placeholder-slate-800 focus:outline-none focus:border-cyan-500/45 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPass("new")}
                  className="absolute right-3 text-slate-600 hover:text-slate-400 cursor-pointer border-none bg-transparent"
                >
                  {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Confirm New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPass.confirm ? "text" : "password"}
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-955/60 border border-slate-855 rounded-xl px-4 py-3.5 text-base text-slate-200 placeholder-slate-800 focus:outline-none focus:border-cyan-500/45 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPass("confirm")}
                  className="absolute right-3 text-slate-600 hover:text-slate-400 cursor-pointer border-none bg-transparent"
                >
                  {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-100 font-black text-sm uppercase tracking-widest rounded-xl py-4 transition-colors cursor-pointer shadow-md hover:shadow-cyan-500/10"
          >
            Update Password Key
          </button>
        </form>
      </div>

    </PageWrapper>
  );
};

export default Profile;
