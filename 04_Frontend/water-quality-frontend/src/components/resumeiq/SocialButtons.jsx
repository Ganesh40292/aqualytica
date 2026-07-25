import { motion } from "framer-motion";

const SocialButtons = ({ onGoogleClick }) => {
  return (
    <div className="w-full space-y-2.5">
      {/* Primary OAuth: Continue with Google */}
      <motion.button
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={onGoogleClick}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 text-slate-700 text-base font-semibold shadow-sm transition-all duration-200 cursor-pointer group"
        style={{ padding: "16px 20px", fontSize: "16px" }}
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.7c-.3-.8-.4-1.7-.4-2.7s.1-1.9.4-2.7L1.6 6.4C.6 8.4 0 10.1 0 12s.6 3.6 1.6 5.6l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
          />
        </svg>
        <span className="group-hover:text-slate-900 font-bold transition-colors">
          Continue with Google
        </span>
      </motion.button>
    </div>
  );
};

export default SocialButtons;
