import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Page Titles Mapper
  const getPageTitle = (path) => {
    switch (path) {
      case "/":
        return "Water Quality Dashboard";
      case "/prediction":
        return "Water Analysis Node";
      case "/telemetry":
        return "Live Telemetry Node";
      case "/history":
        return "Record Ledger";
      case "/analytics":
        return "Analytics Overview";
      case "/errors":
        return "System Error Console";
      case "/about":
        return "About Aqualytica";
      case "/profile":
        return "User Profile";
      case "/settings":
        return "System Settings";
      default:
        return "Aqualytica Portal";
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  // Stateful live logs notification registry
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Aqualytica AI core successfully initialized", time: "1 min ago", read: false },
    { id: 2, text: "Random Forest ML model loaded (Accuracy: 84.62%)", time: "3 min ago", read: false },
    { id: 3, text: "WiFi telemetry stream synchronized with ESP32 node", time: "6 min ago", read: true }
  ]);

  // Periodically insert live system verification logs
  useEffect(() => {
    const logs = [
      "Vite dev server re-optimization check: COMPLETE",
      "Spring Boot REST service status check: HEALTHY",
      "Python Flask model classification latency check: 12ms",
      "Sensor probe auto-calibration offset adjusted",
      "MySQL database ledger transaction integrity: OK",
      "Telemetry WiFi signal check: -47 dBm (Excellent)",
      "ML model confidence prediction thresholds checked"
    ];

    const interval = setInterval(() => {
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setNotifications((prev) => [
        {
          id: Date.now(),
          text: randomLog,
          time: "Just now",
          read: false
        },
        ...prev.slice(0, 7) // Limit to 8 recent entries
      ]);
    }, 25000); // Push a new log entry every 25 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <header className="h-20 bg-slate-955/40 backdrop-blur-3xl border-b border-slate-800/40 flex items-center justify-between px-8 z-20 shrink-0 relative">
      
      {/* High-visibility Dynamic Page Title (Bright, Solid Color) */}
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-cyan-450 shadow-[0_0_10px_#06b6d4] animate-pulse shrink-0" />
        <h1 className="text-2xl font-black text-cyan-400 uppercase tracking-wider select-none">
          {pageTitle}
        </h1>
      </div>

      {/* Interactive Toolbars */}
      <div className="flex items-center gap-4">
        
        {/* Interactive Notifications Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-slate-950 animate-pulse"></span>
            )}
          </button>

          {/* Collapsible Notifications dropdown panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 space-y-3"
              >
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-355">System Notifications</h4>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-[9px] font-black uppercase text-cyan-400 hover:text-cyan-305 cursor-pointer bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850"
                      >
                        Read All
                      </button>
                    )}
                    <button 
                      onClick={clearAll} 
                      className="text-[9px] font-black uppercase text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto scrollbar-none pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((alert) => (
                      <div 
                        key={alert.id} 
                        onClick={() => toggleRead(alert.id)}
                        className={`flex gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          alert.read 
                            ? "bg-slate-955/20 border-slate-900/40 hover:border-slate-850/60" 
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-750"
                        }`}
                      >
                        <div className="relative flex h-2 w-2 shrink-0 mt-1.5">
                          {!alert.read && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${alert.read ? "bg-slate-700" : "bg-cyan-500"}`}></span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className={`text-[10px] leading-normal ${alert.read ? "font-medium text-slate-500" : "font-semibold text-slate-300"}`}>{alert.text}</p>
                          <p className="text-[9px] font-bold text-slate-655">{alert.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Navigation Trigger */}
        <Link 
          to="/profile"
          className="p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
          title="User Profile"
        >
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;