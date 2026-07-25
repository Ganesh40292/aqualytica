import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "w-6 h-6", border = "border-2" }) => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear"
        }}
        className={`${size} ${border} border-t-cyan-500 border-slate-700 rounded-full`}
      />
    </div>
  );
};

export default LoadingSpinner;
