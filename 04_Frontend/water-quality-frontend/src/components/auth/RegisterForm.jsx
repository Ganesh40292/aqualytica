import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import SocialButtons from "./SocialButtons";

const registerSchema = z
  .object({
    fullName: z.string().nonempty("Full Name is required").min(2, "At least 2 characters"),
    email: z.string().nonempty("Email is required").email("Please enter a valid email"),
    password: z.string().nonempty("Password is required").min(8, "At least 8 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, "You must accept the Terms")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingState, setIsSubmittingState] = useState(false);
  const [modalType, setModalType] = useState(null); // 'terms' or 'privacy'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isTermsAccepted = watch("terms");

  const onSubmit = async (data) => {
    setIsSubmittingState(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmittingState(false);
    if (onRegisterSuccess) onRegisterSuccess(data);
  };

  const inputStyle = {
    height: "52px",
    paddingLeft: "56px",
    paddingRight: "20px",
    fontSize: "15px"
  };

  const inputClass = (hasError) =>
    `w-full bg-[#060b16] border-2 ${hasError ? "border-red-500" : "border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400"} rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium relative z-0`;

  const termsContent = (
    <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
      <p className="font-bold text-white text-base">Welcome to Aqualytica Platform</p>
      <p>By registering an account with Aqualytica ("Platform"), you agree to abide by the following Terms of Service:</p>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">1. Telemetry & Machine Learning Analytics</h4>
        <p>Aqualytica utilizes sensor telemetry data and machine learning classification algorithms (Random Forest) to evaluate water potability metrics. Parameter assessments are intended for water quality monitoring and safety diagnostics.</p>
      </div>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">2. Data Security & Storage</h4>
        <p>Telemetry measurements, user accounts, and test ledgers are protected using encrypted database systems. You retain administrative control over your logged sample history.</p>
      </div>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">3. Permitted Usage</h4>
        <p>This platform is designed for water quality analysis, IoT node telemetry monitoring, and lab certification logging. Unauthorized scraping, automated API spamming, or tampering with sensor stream protocols is strictly prohibited.</p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
      <p className="font-bold text-white text-base">Privacy Policy & Data Protection</p>
      <p>Your privacy and security are paramount. This Privacy Policy details how Aqualytica collects, processes, and safeguards user and environmental telemetry data:</p>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">1. Information Collected</h4>
        <p>We store user registration details (name, email) and water quality metrics streamed via ESP32 nodes or manually entered for prediction analysis.</p>
      </div>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">2. Usage of Data</h4>
        <p>All collected metrics are exclusively processed to compute Water Quality Index (WQI) scores, machine learning confidence levels, and historical safety trends. We never sell user data to third parties.</p>
      </div>
      <div className="space-y-1.5">
        <h4 className="font-bold text-cyan-400">3. Data Control</h4>
        <p>Users maintain the ability to export CSV telemetry logs, clear personal prediction ledgers, and manage account preferences through the settings console.</p>
      </div>
    </div>
  );

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        onSubmit={handleSubmit(onSubmit)}
        className="text-left w-full flex flex-col justify-between grow space-y-5"
      >
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">Full Name</label>
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
              <User size={20} />
            </div>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Enter your full name"
              style={inputStyle}
              className={inputClass(errors.fullName)}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-400 font-semibold pt-0.5">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">Email Address</label>
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
              <Mail size={20} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              style={inputStyle}
              className={inputClass(errors.email)}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 font-semibold pt-0.5">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">Password</label>
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
              <Lock size={20} />
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              style={{ ...inputStyle, paddingRight: "56px" }}
              className={inputClass(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 bottom-0 right-4 flex items-center text-slate-400 hover:text-white cursor-pointer bg-transparent border-none z-10"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 font-semibold pt-0.5">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">Confirm Password</label>
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
              <Lock size={20} />
            </div>
            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              style={inputStyle}
              className={inputClass(errors.confirmPassword)}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 font-semibold pt-0.5">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("terms")}
              type="checkbox"
              className="w-4.5 h-4.5 rounded accent-cyan-500 bg-[#060b16] border-slate-700 cursor-pointer shrink-0"
            />
            <span className="text-xs font-medium text-slate-200 select-none leading-relaxed">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setModalType("terms")}
                className="text-cyan-400 underline font-semibold hover:text-cyan-300 cursor-pointer bg-transparent border-none p-0 inline-block"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setModalType("privacy")}
                className="text-cyan-400 underline font-semibold hover:text-cyan-300 cursor-pointer bg-transparent border-none p-0 inline-block"
              >
                Privacy Policy
              </button>.
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-400 font-semibold mt-1 pl-7">{errors.terms.message}</p>}
        </div>

        {/* Create Account Button */}
        <div className="pt-2">
          <motion.button
            whileHover={isTermsAccepted ? { scale: 1.01 } : {}}
            whileTap={isTermsAccepted ? { scale: 0.99 } : {}}
            type="submit"
            disabled={isSubmittingState || !isTermsAccepted}
            style={{ height: "52px", fontSize: "16px", opacity: isTermsAccepted ? 1 : 0.5 }}
            className={`w-full rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center border ${
              isTermsAccepted 
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-cyan-400/30 shadow-cyan-600/25 hover:shadow-cyan-500/40 cursor-pointer" 
                : "bg-slate-800 border-slate-700 cursor-not-allowed text-slate-500"
            }`}
          >
            {isSubmittingState ? "Creating Account..." : "Create Account"}
          </motion.button>
        </div>

        {/* FLEXBOX OR DIVIDER */}
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-slate-700/80" />
          <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
          <div className="flex-1 border-t border-slate-700/80" />
        </div>

        {/* Google */}
        <SocialButtons
          onSuccess={(data) => {
            if (onRegisterSuccess) onRegisterSuccess(data);
          }}
          onError={(msg) => {
            console.error("Google register error:", msg);
          }}
        />

        {/* Switch to Login */}
        <p className="text-center text-xs text-slate-300 font-medium pt-1">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wide bg-transparent border-none cursor-pointer underline ml-1"
          >
            Sign In
          </button>
        </p>
      </motion.form>

      {/* Terms & Privacy Policy Overlay Modals */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1424] rounded-2xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative text-left"
            >
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl font-extrabold text-white mb-6 uppercase tracking-wider border-b border-slate-800 pb-3">
                {modalType === "terms" ? "Terms of Service" : "Privacy Policy"}
              </h3>

              <div className="mb-8">
                {modalType === "terms" ? termsContent : privacyContent}
              </div>

              <button
                type="button"
                onClick={() => setModalType(null)}
                className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-md cursor-pointer border-none text-center transition-colors"
              >
                Close & Return
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisterForm;
