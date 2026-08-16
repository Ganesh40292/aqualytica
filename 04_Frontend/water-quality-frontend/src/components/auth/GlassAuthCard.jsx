import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const GlassAuthCard = ({ activeTab = "login", setActiveTab, onAuthSuccess }) => {
  const isRegister = activeTab === "register";

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-full ${
        isRegister ? "max-w-[640px] min-h-[88vh] py-10 sm:py-14" : "max-w-[580px] min-h-0 py-10 sm:py-12"
      } mx-auto px-6 sm:px-12 bg-[#0b1424]/90 backdrop-blur-2xl text-white text-center z-10 border-2 border-cyan-500/30 hover:border-cyan-400/90 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.4)] rounded-3xl transition-all duration-500 my-auto flex flex-col items-center justify-center group relative overflow-hidden`}
    >
      {/* GLOWING BORDER HIGHLIGHT ON CARD HOVER */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />

      <div
        className={`w-full ${
          isRegister
            ? "max-w-[500px] flex flex-col justify-between h-full grow"
            : "max-w-[480px] flex flex-col items-center justify-center"
        } mx-auto relative z-10 my-auto`}
      >
        {/* HEADING & SUBTITLE */}
        <div className="space-y-2 mb-6 sm:mb-8 pt-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isRegister ? "Create Your Account" : "Sign In to Your Account"}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-300 leading-relaxed">
            {isRegister
              ? "Welcome! Please enter your details below"
              : "Welcome back! Please enter your credentials below"}
          </p>
        </div>

        {/* FORM CONTENT WITH SMOOTH ANIMATED TAB TRANSITION */}
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <LoginForm
              key="login-form"
              onSwitchToRegister={() => setActiveTab("register")}
              onLoginSuccess={onAuthSuccess}
            />
          ) : (
            <RegisterForm
              key="register-form"
              onSwitchToLogin={() => setActiveTab("login")}
              onRegisterSuccess={onAuthSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GlassAuthCard;
