import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, User, UserPlus, LogIn, Sparkles, Droplets } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabaseClient";
import SocialButtons from "../../components/resumeiq/SocialButtons";

const Login = ({ onLoginSuccess }) => {
  const toast = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!username || !email || !password || !confirmPassword) {
        toast.showWarning("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        toast.showError("Passwords do not match.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
          toast.showSuccess("Registration successful! You can now log in.");
          setIsRegistering(false);
          setPassword("");
          setConfirmPassword("");
        } else {
          toast.showError(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        toast.showError("Network error. Cannot reach server.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        toast.showWarning("Please enter your email and password.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          toast.showSuccess(`Welcome back, ${data.username}!`);
          onLoginSuccess(data);
        } else {
          toast.showError(data.message || "Invalid email or password.");
        }
      } catch (err) {
        console.error("Login error:", err);
        // Fallback demo login if server is unreachable
        if (email === "analyst@wqms.org" && password === "admin123") {
          toast.showSuccess("Logged in successfully (Offline Mode).");
          onLoginSuccess({ username: "Offline Analyst", email });
        } else {
          toast.showError("Network error. Cannot reach authorization server.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoAccess = () => {
    setEmail("analyst@wqms.org");
    setPassword("admin123");
    toast.showSuccess("Demo credentials pre-filled.");
  };

  return (
    // Solid background color only - no gradients, centered container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19] p-4 md:p-8 overflow-y-auto">
      
      {/* Centered, spacious, and large form box */}
      <div className="w-full max-w-xl bg-[#161f30] border border-[#24334c] rounded-[24px] shadow-2xl p-8 md:p-12 flex flex-col items-center my-auto">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#0b0f19] border border-[#24334c] flex items-center justify-center shadow-lg mb-6">
          {isRegistering ? (
            <UserPlus className="w-7 h-7 text-cyan-400" />
          ) : (
            <Droplets className="w-7 h-7 text-cyan-400" />
          )}
        </div>

        {/* Centered Title & Centered Paragraph (High-visibility text colors) */}
        <div className="text-center space-y-3 mb-8 w-full">
          <h2 className="text-3xl font-black uppercase tracking-wider text-white">
            {isRegistering ? "Create Account" : "Log In"}
          </h2>
          <p className="text-sm font-semibold text-slate-350 leading-relaxed max-w-md mx-auto">
            {isRegistering 
              ? "Sign up to start monitoring water quality parameters." 
              : "Welcome back! Enter your credentials below to log into the monitor dashboard."
            }
          </p>
        </div>

        {/* Form Fields with generous spacing and height */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          {/* Username Field (Sign Up Only) */}
          {isRegistering && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 justify-start">
                <User size={12} className="text-cyan-400" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full bg-[#0b0f19] border border-[#24334c] rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-semibold"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 justify-start">
              <Mail size={12} className="text-cyan-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full bg-[#0b0f19] border border-[#24334c] rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-semibold"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 justify-start">
              <Lock size={12} className="text-cyan-400" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#0b0f19] border border-[#24334c] rounded-xl px-5 py-4 pr-14 text-white text-base focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer border-none bg-transparent"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isRegistering && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 justify-start">
                <Lock size={12} className="text-cyan-400" /> Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full bg-[#0b0f19] border border-[#24334c] rounded-xl px-5 py-4 text-white text-base focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-semibold"
              />
            </div>
          )}

          {/* Center-aligned Toggle Link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all bg-transparent border-none cursor-pointer tracking-wider"
            >
              {isRegistering ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Submit & Demo Buttons */}
          <div className="space-y-4 pt-3 w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-xl py-4 font-bold text-base tracking-widest uppercase transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  {isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />}
                  <span>{isRegistering ? "Sign Up" : "Log In"}</span>
                </>
              )}
            </button>

            {/* Google OAuth Button (Available for both Login and Register) */}
            <SocialButtons
              onSuccess={(data) => {
                toast.showSuccess(`Welcome, ${data.username}!`);
                onLoginSuccess(data);
              }}
              onError={(msg) => toast.showError(msg)}
            />

            {!isRegistering && (
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full bg-[#0b0f19] hover:bg-slate-900 border border-[#24334c] text-slate-400 hover:text-slate-200 rounded-xl py-4 font-semibold text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-yellow-400" />
                <span>Use Demo Credentials</span>
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;
