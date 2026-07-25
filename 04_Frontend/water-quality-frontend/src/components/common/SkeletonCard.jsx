import { motion } from "framer-motion";

const SkeletonCard = ({ className = "h-48" }) => {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.2,
        ease: "easeInOut"
      }}
      className={`w-full rounded-2xl bg-slate-900 border border-slate-800/80 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </motion.div>
  );
};

export default SkeletonCard;
