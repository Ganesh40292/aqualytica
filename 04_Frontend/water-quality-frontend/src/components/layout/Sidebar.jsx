import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, User, ShieldCheck, LogOut, Cpu, Database, Server, Brain } from "lucide-react";
import navLinks from "../../constants/navLinks";
import useLiveClock from "../../hooks/useLiveClock";
import axios from "axios";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { time, date } = useLiveClock();
  const [hoveredPath, setHoveredPath] = useState(null);

  // Live System Health checks
  const [status, setStatus] = useState({
    backend: "checking",
    db: "checking",
    python: "checking",
    model: "checking"
  });

  const checkHealth = useCallback(async () => {
    const newStatus = {
      backend: "offline",
      db: "offline",
      python: "offline",
      model: "offline"
    };

    try {
      const backendRes = await axios.get("http://localhost:8080/api/health", { timeout: 2000 });
      if (backendRes.status === 200) {
        newStatus.backend = "online";
        newStatus.db = "online";
      }
    } catch {
      newStatus.backend = "offline";
      newStatus.db = "offline";
    }

    try {
      const pythonRes = await axios.get("http://localhost:5000/", { timeout: 2000 });
      if (pythonRes.status === 200) {
        newStatus.python = "online";
        newStatus.model = "online";
      }
    } catch {
      newStatus.python = "offline";
      newStatus.model = "offline";
    }

    setStatus(newStatus);
  }, []);

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("wqms-username") || "Dr. A. Sharma";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
    }, 0);
    const interval = setInterval(checkHealth, 5000);
    
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("wqms-username") || "Dr. A. Sharma");
    };
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkHealth]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("wqms-logged-in");
    localStorage.removeItem("wqms-username");
    localStorage.removeItem("wqms-email");
    window.location.reload();
  };

  const getStatusDot = (state) => {
    if (state === "online") return "bg-green-500 shadow-[0_0_8px_#22c55e]";
    if (state === "offline") return "bg-red-500 shadow-[0_0_8px_#ef4444]";
    return "bg-slate-500 animate-pulse";
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 96 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
      className="bg-slate-950/40 backdrop-blur-3xl border-r border-slate-800/40 h-full flex flex-col relative z-30 shrink-0 select-none shadow-[10px_0_40px_rgba(0,0,0,0.4)] overflow-hidden"
    >
      {/* 🌌 Animated High-Visibility Neon Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Glowing Vibrant Cyan Blob (Top Left) */}
        <motion.div
          animate={{
            x: [-20, 60, -40, -20],
            y: [-20, -50, 40, -20],
            scale: [1, 1.25, 0.85, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-cyan-500/25 blur-2xl"
        />

        {/* Glowing Vibrant Purple Blob (Bottom Right) */}
        <motion.div
          animate={{
            x: [20, -50, 40, 20],
            y: [20, 40, -40, 20],
            scale: [1, 0.85, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-28 -right-12 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl"
        />
      </div>

      {/* Floating Border Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-4 top-24 z-50 p-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-855 text-slate-400 hover:text-cyan-400 transition-all shadow-md cursor-pointer"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header Logo - Enlarged font */}
      <div className="p-6 flex items-center gap-4.5 border-b border-slate-855 min-h-[96px] justify-start relative z-10">
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]">
          <img src="/logo.png" alt="Aqualytica Logo" className="w-full h-full object-cover" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <span className="font-black text-2xl tracking-tight text-slate-100 flex items-center gap-2 leading-none">
                Aqualytica
              </span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-2 leading-normal">
                AI-Powered Water Quality Intelligence Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Middle Part: Live clock time and date - Enlarged font */}
      {!collapsed && (
        <div className="mx-5 mt-6 p-5 rounded-2xl bg-slate-950/40 border border-slate-850 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          <span className="text-xl font-black text-slate-100 tracking-tight leading-none">
            {time || "00:00:00 AM"}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">
            {date || "Loading Date..."}
          </span>
        </div>
      )}

      {/* Navigation List - Enlarged text sizes */}
      <nav 
        className="flex-1 px-4 py-8 overflow-y-auto scrollbar-none relative z-10"
        onMouseLeave={() => setHoveredPath(null)}
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          let badge = null;
          if (link.path === "/prediction") badge = "TEST";
          if (link.path === "/telemetry") badge = "LIVE";

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onMouseEnter={() => setHoveredPath(link.path)}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 relative group font-black text-base mb-4 border cursor-pointer ${
                  isActive
                    ? "text-cyan-400 bg-slate-955/80 border-cyan-800/30 shadow-[inset_0_0_12px_rgba(6,182,212,0.05)] shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent bg-slate-950/10"
                }`
              }
            >
              {/* Floating Hover highlight background pill */}
              <AnimatePresence>
                {hoveredPath === link.path && !isActive && (
                  <motion.div
                    layoutId="hoverHighlight"
                    className="absolute inset-0 bg-slate-855/40 border border-slate-800/30 rounded-2xl z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>

              {/* Content items - Larger icons */}
              <div className="flex items-center gap-4 min-w-0 z-10 relative">
                <Icon className={`w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.3)]" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate tracking-wide"
                  >
                    {link.label}
                  </motion.span>
                )}
              </div>

              {/* Link Badges */}
              {!collapsed && badge && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider z-10 relative ${
                  badge === "LIVE" 
                    ? "bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 animate-pulse" 
                    : "bg-cyan-950/50 border border-cyan-800/40 text-cyan-400"
                }`}>
                  {badge}
                </span>
              )}

              {/* Active side indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-[4px] h-7 bg-cyan-500 rounded-r-full shadow-[0_0_8px_#06b6d4] z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Collapsed Tooltip */}
              {collapsed && (
                <div className="absolute left-26 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold rounded-xl px-3.5 py-2.5 shadow-2xl pointer-events-none whitespace-nowrap z-50">
                  {link.label}
                  {badge && <span className="ml-2.5 text-[9px] bg-cyan-955 px-1.5 py-0.5 border border-cyan-800/40 text-cyan-400 rounded">{badge}</span>}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Part: Real-time System Integration statuses panel - Larger text */}
      {!collapsed && (
        <div className="mx-5 mb-5 p-4.5 rounded-2xl bg-slate-955/20 border border-slate-850 space-y-3.5 relative overflow-hidden z-10">
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2.5">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Integration</span>
          </div>

          <div className="space-y-3 text-xs font-semibold text-slate-355">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Server size={13} className="text-slate-500" /> REST API Port: 8080</span>
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(status.backend)}`} />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Cpu size={13} className="text-slate-500" /> ML Service Port: 5000</span>
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(status.python)}`} />
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Database size={13} className="text-slate-500" /> Database MySQL</span>
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(status.db)}`} />
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Brain size={13} className="text-slate-500" /> Classifier Model</span>
              <span className={`w-2.5 h-2.5 rounded-full ${getStatusDot(status.model)}`} />
            </div>
          </div>
        </div>
      )}

      {/* User profile section - Larger text */}
      <div className="p-5 border-t border-slate-850 bg-slate-950/20 relative z-10">
        <div className={`flex items-center gap-3.5 p-3 rounded-2xl border border-transparent ${collapsed ? "justify-center" : "bg-slate-950/30 border-slate-850"}`}>
          {/* Avatar core */}
          <Link to="/profile" className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 to-teal-400 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.15)] block">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border border-slate-955">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
          </Link>

          {/* User information details */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <Link to="/profile" className="text-sm font-bold text-slate-200 hover:text-cyan-400 truncate flex items-center gap-1">
                {username}
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </Link>
            </motion.div>
          )}

          {/* Logout Action Button */}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-900 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Log Out Access"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;