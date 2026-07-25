import { useState } from "react";
import { motion } from "framer-motion";
import GlassAuthCard from "./GlassAuthCard";
import AISceneLeft from "./AISceneLeft";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ResumeIQAuth = ({ initialTab = "login", onComplete }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setAuthenticatedUser(userData);
    if (onComplete) {
      onComplete(userData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-white">
      
      {/* LEFT PANEL (50% Width): Split screen visual container (Hidden on mobile) */}
      <div className="w-full lg:w-1/2 h-full hidden lg:block border-r border-slate-200">
        <AISceneLeft activeTab={activeTab} />
      </div>

      {/* RIGHT PANEL (50% Width): White login/register center column */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto bg-white">
        
        {authenticatedUser ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[480px] p-8 rounded-2xl bg-[#f8fafc] border border-slate-200 text-center space-y-6 shadow-md"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-slate-800">Welcome Back</h3>
              <p className="text-sm text-slate-500 font-medium">
                Signed in as <span className="text-indigo-600 font-bold">{authenticatedUser.fullName || authenticatedUser.email}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-left space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Session Details</span>
              <div className="flex justify-between text-xs text-slate-650 font-semibold">
                <span>ResumeIQ Engine</span>
                <span className="text-indigo-600 font-bold">Online v4.2</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAuthenticatedUser(null)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              <span>Sign Out</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <GlassAuthCard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAuthSuccess={handleAuthSuccess}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeIQAuth;
