import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import SocialButtons from "./SocialButtons";

const loginSchema = z.object({
  email: z.string().nonempty("Username or Email is required"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters")
});

const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingState, setIsSubmittingState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data) => {
    setIsSubmittingState(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsSubmittingState(false);
    if (onLoginSuccess) onLoginSuccess(data);
  };

  const inputStyle = {
    height: "52px",
    paddingLeft: "52px",
    paddingRight: "20px",
    fontSize: "15px"
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit(onSubmit)}
      className="text-left w-full flex flex-col gap-5 sm:gap-6"
    >
      {/* Email / Username */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">Email or Username</label>
        <div className="relative group">
          <div className="absolute top-0 bottom-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10">
            <Mail size={20} />
          </div>
          <input
            {...register("email")}
            type="text"
            placeholder="Enter your email or username"
            style={inputStyle}
            className={`w-full bg-[#060b16] border-2 ${
              errors.email ? "border-red-500" : "border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400"
            } rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium relative z-0`}
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
            placeholder="Enter your password"
            style={{ ...inputStyle, paddingRight: "52px" }}
            className={`w-full bg-[#060b16] border-2 ${
              errors.password ? "border-red-500" : "border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400"
            } rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner font-medium relative z-0`}
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

      {/* Remember me */}
      <div className="flex items-center gap-3 pt-0.5">
        <input
          type="checkbox"
          id="remember-me"
          className="w-4.5 h-4.5 rounded accent-cyan-500 bg-[#060b16] border-slate-700 cursor-pointer"
        />
        <label htmlFor="remember-me" className="text-sm font-semibold text-slate-200 cursor-pointer select-none">
          Remember me
        </label>
      </div>

      {/* Sign In Button */}
      <div className="pt-1">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmittingState}
          style={{ height: "52px", fontSize: "16px" }}
          className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/40 border border-cyan-400/30 transition-all cursor-pointer flex items-center justify-center"
        >
          {isSubmittingState ? "Signing In..." : "Sign In"}
        </motion.button>
      </div>

      {/* FLEXBOX OR DIVIDER */}
      <div className="flex items-center my-1">
        <div className="flex-1 border-t border-slate-700/80" />
        <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
        <div className="flex-1 border-t border-slate-700/80" />
      </div>

      {/* Google OAuth */}
      <SocialButtons
        onSuccess={(data) => {
          if (onLoginSuccess) onLoginSuccess(data);
        }}
        onError={(msg) => {
          console.error("Google login error:", msg);
        }}
      />

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-300 font-medium pt-1">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wide bg-transparent border-none cursor-pointer underline ml-1"
        >
          Sign Up
        </button>
      </p>
    </motion.form>
  );
};

export default LoginForm;
