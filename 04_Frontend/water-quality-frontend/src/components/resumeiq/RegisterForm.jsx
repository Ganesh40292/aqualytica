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

  const inputStyle = { padding: "16px 20px 16px 52px", fontSize: "16px" };
  const inputClass = (hasError) =>
    `w-full bg-slate-50 border-2 ${hasError ? "border-red-400" : "border-slate-300 focus:border-indigo-500"} rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-colors`;

  const termsContent = (
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <p className="font-bold text-slate-800 text-base">Welcome to ResumeIQ AI</p>
      <p>By registering an account with ResumeIQ AI ("Platform"), you agree to abide by the following Terms of Service:</p>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">1. AI Analysis & Processing</h4>
        <p>ResumeIQ AI utilizes advanced language models and parsing algorithms to score, analyze, and generate feedback on uploaded documents. Accuracy of recommendations is subject to model parameters.</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">2. Document Storage & Security</h4>
        <p>Uploaded resumes are stored in secure cloud systems. You retain full ownership of your data. We apply state-of-the-art encryption protocols to safeguard your credentials and files.</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">3. Permitted Usage</h4>
        <p>The service is provided for individual career advancement. Automated scraping, bulk uploading of mock files, or attempts to compromise model parameters are strictly prohibited.</p>
      </div>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <p className="font-bold text-slate-800 text-base">Privacy Policy & Data Protection</p>
      <p>Your privacy is of utmost importance. This Privacy Policy details how ResumeIQ AI collects, uses, and safeguards your profile data:</p>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">1. Data We Collect</h4>
        <p>We collect registration details (name, email) and documents you explicitly upload for analysis (resumes, CVs, text inputs).</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">2. Usage of Data</h4>
        <p>Your data is strictly used to render safety feedback, score calculations, and matching optimization. We do not sell or monetize your documents or personal details to third parties.</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-700">3. User Controls</h4>
        <p>You have full access to delete your uploaded history and close your account at any time through the profile configuration settings.</p>
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
        className="text-left"
        style={{ display: "flex", flexDirection: "column", gap: "22px" }}
      >
        {/* Full Name */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
              <User size={22} />
            </div>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Enter your full name"
              style={inputStyle}
              className={inputClass(errors.fullName)}
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-500 font-medium mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
              <Mail size={22} />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              style={inputStyle}
              className={inputClass(errors.email)}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 font-medium mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
              <Lock size={22} />
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              style={{ ...inputStyle, paddingRight: "52px" }}
              className={inputClass(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer bg-transparent border-none"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500 font-medium mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-base font-semibold text-slate-700 mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
              <Lock size={22} />
            </div>
            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              style={inputStyle}
              className={inputClass(errors.confirmPassword)}
            />
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500 font-medium mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register("terms")}
              type="checkbox"
              className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-650 select-none">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setModalType("terms")}
                className="text-indigo-600 underline font-semibold hover:text-indigo-800 cursor-pointer bg-transparent border-none p-0 inline-block"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setModalType("privacy")}
                className="text-indigo-600 underline font-semibold hover:text-indigo-800 cursor-pointer bg-transparent border-none p-0 inline-block"
              >
                Privacy Policy
              </button>.
            </span>
          </label>
          {errors.terms && <p className="text-sm text-red-500 font-medium mt-1 pl-8">{errors.terms.message}</p>}
        </div>

        {/* Create Account Button */}
        <motion.button
          whileHover={isTermsAccepted ? { scale: 1.01 } : {}}
          whileTap={isTermsAccepted ? { scale: 0.99 } : {}}
          type="submit"
          disabled={isSubmittingState || !isTermsAccepted}
          style={{ padding: "16px", fontSize: "18px", opacity: isTermsAccepted ? 1 : 0.6 }}
          className={`w-full text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center border-none ${
            isTermsAccepted ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer" : "bg-slate-450 cursor-not-allowed"
          }`}
        >
          {isSubmittingState ? "Creating Account..." : "Create Account"}
        </motion.button>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t-2 border-slate-200" />
          <span className="absolute bg-white px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">OR</span>
        </div>

        {/* Google */}
        <SocialButtons onGoogleClick={() => onSubmit({ fullName: "Google User", email: "google.user@resumeiq.ai" })} />

        {/* Switch to Login */}
        <p className="text-center text-base text-slate-500 font-medium">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-800 font-bold bg-transparent border-none cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </motion.form>

      {/* Terms & Privacy Policy Overlay Modals */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">
                {modalType === "terms" ? "Terms of Service" : "Privacy Policy"}
              </h3>

              <div className="mb-8">
                {modalType === "terms" ? termsContent : privacyContent}
              </div>

              <button
                type="button"
                onClick={() => setModalType(null)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md cursor-pointer border-none text-center transition-colors"
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
