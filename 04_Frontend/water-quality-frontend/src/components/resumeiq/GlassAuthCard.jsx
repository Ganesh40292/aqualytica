import { AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const GlassAuthCard = ({ activeTab = "login", setActiveTab, onAuthSuccess }) => {
  return (
    <div className="w-full max-w-[600px] mx-auto px-12 py-16 bg-white text-slate-800 text-center z-10 border border-slate-200 rounded-2xl shadow-lg min-h-[92vh] flex flex-col justify-center items-center">
      <div className="max-w-[440px] mx-auto w-full flex flex-col justify-center">
        
        {/* HEADING & SUBTITLE */}
        <div className="space-y-3 mb-10">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            {activeTab === "login" ? "Sign In to Your Account" : "Create Your Account"}
          </h2>
          <p className="text-base font-medium text-slate-500">
            {activeTab === "login"
              ? "Welcome back! please enter your detail"
              : "Welcome! please enter your details below"}
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
    </div>
  );
};

export default GlassAuthCard;
