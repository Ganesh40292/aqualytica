import { motion } from "framer-motion";
import CountUpRaw from "react-countup";

const CountUp = typeof CountUpRaw === "function" ? CountUpRaw : (CountUpRaw.default || CountUpRaw);

function DashboardCard({
  title,
  value,
  color,
  suffix = "",
  icon,
}) {
  const glowMap = {
    "text-cyan-400": "hover:shadow-[0_0_35px_rgba(6,182,212,0.15)] hover:border-cyan-500/45",
    "text-green-400": "hover:shadow-[0_0_35px_rgba(34,197,94,0.15)] hover:border-green-500/45",
    "text-red-400": "hover:shadow-[0_0_35px_rgba(239,68,68,0.15)] hover:border-red-500/45",
    "text-yellow-400": "hover:shadow-[0_0_35px_rgba(250,204,21,0.15)] hover:border-yellow-500/45"
  };

  const currentGlow = glowMap[color] || "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]";

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`bg-slate-900/40 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-slate-800/40 transition-all duration-300 relative overflow-hidden group min-h-[220px] flex flex-col items-center justify-center text-center ${currentGlow}`}
    >
      {/* Background radial accent glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-transparent via-slate-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

      {/* Centered Column Layout */}
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10 w-full">
        {/* Icon (Centered top) */}
        <div className={`text-2xl p-4 rounded-2xl bg-slate-950/60 border border-slate-800/50 group-hover:scale-110 transition-transform duration-300 shadow-md shrink-0 ${color}`}>
          {icon}
        </div>

        {/* Text Details (Centered bottom) */}
        <div className="space-y-1.5 w-full">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">
            {title}
          </p>

          <h2 className={`text-4xl font-black tracking-tight leading-none mt-1 ${color}`}>
            <CountUp end={Number(value) || 0} duration={1.5} separator="," decimals={suffix === "%" ? 1 : 0} />
            {suffix}
          </h2>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardCard;