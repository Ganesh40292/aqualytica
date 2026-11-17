import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full max-w-[1560px] mx-auto space-y-6 sm:space-y-8 pb-12 sm:pb-16 px-1 sm:px-3 lg:px-4 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
