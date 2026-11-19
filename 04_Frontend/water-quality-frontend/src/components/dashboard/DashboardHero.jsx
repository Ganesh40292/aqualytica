import { motion } from "framer-motion";

function DashboardHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl p-4 sm:p-5 bg-slate-900/30 border border-slate-800/50 shadow-xl backdrop-blur-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 tracking-wide">
            Aqualytica Telemetry Operations Center
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
            Continuous environmental telemetry ingestion, physical sensor bound audits & machine learning-based water quality classification.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default DashboardHero;