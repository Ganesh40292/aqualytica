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

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit(onSubmit)}
      className="text-left"
      style={{ display: "flex", flexDirection: "column", gap: "28px" }}
    >
      {/* Email / Username */}
      <div>
        <label className="block text-base font-semibold text-slate-700 mb-2">Email or Username</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500">
            <Mail size={22} />
          </div>
          <input
            {...register("email")}
            type="text"
            placeholder="Enter your email or username"
            style={{ padding: "18px 20px 18px 52px", fontSize: "16px" }}
            className={`w-full bg-slate-50 border-2 ${
              errors.email ? "border-red-400" : "border-slate-300 focus:border-indigo-500"
            } rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-colors`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500 font-medium mt-2">{errors.email.message}</p>}
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
            placeholder="Enter your password"
            style={{ padding: "18px 52px 18px 52px", fontSize: "16px" }}
            className={`w-full bg-slate-50 border-2 ${
              errors.password ? "border-red-400" : "border-slate-300 focus:border-indigo-500"
            } rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer bg-transparent border-none"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500 font-medium mt-2">{errors.password.message}</p>}
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="remember-me"
          className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
        />
        <label htmlFor="remember-me" className="text-base font-medium text-slate-600 cursor-pointer select-none">
          Remember me
        </label>
      </div>

      {/* Sign In Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isSubmittingState}
        style={{ padding: "18px", fontSize: "18px" }}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer flex items-center justify-center border-none"
      >
        {isSubmittingState ? "Signing In..." : "Sign In"}
      </motion.button>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t-2 border-slate-200" />
        <span className="absolute bg-white px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">OR</span>
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
      <p className="text-center text-base text-slate-500 font-medium">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-indigo-600 hover:text-indigo-800 font-bold bg-transparent border-none cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </motion.form>
  );
};

export default LoginForm;
