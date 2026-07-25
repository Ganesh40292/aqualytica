import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: "bg-slate-900/90 border-green-500/30 text-green-400",
      icon: <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />,
      glow: "shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)]"
    },
    error: {
      bg: "bg-slate-900/90 border-red-500/30 text-red-400",
      icon: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
      glow: "shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
    },
    warning: {
      bg: "bg-slate-900/90 border-yellow-500/30 text-yellow-400",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />,
      glow: "shadow-[0_0_15px_-3px_rgba(250,204,21,0.2)]"
    }
  };

  const current = config[type] || config.success;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md ${current.bg} ${current.glow} border-slate-800/80`}
    >
      <div className="flex items-center gap-3">
        {current.icon}
        <p className="text-sm font-medium text-slate-200">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-slate-800/80 transition-colors text-slate-400 hover:text-slate-200"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
