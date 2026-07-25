import { Droplet, AlertTriangle } from "lucide-react";

const StatusBadge = ({ prediction }) => {
  const isPotable = prediction?.toLowerCase() === "potable";

  if (isPotable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_12px_-3px_rgba(34,197,94,0.3)]">
        <Droplet className="w-3.5 h-3.5 fill-current" />
        Potable
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_12px_-3px_rgba(239,68,68,0.3)]">
      <AlertTriangle className="w-3.5 h-3.5" />
      Not Potable
    </span>
  );
};

export default StatusBadge;
