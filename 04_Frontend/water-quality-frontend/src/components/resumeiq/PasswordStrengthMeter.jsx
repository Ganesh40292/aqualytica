import { useMemo } from "react";
import { Check, X } from "lucide-react";

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-slate-800" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500", textColor: "text-rose-400" };
  if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500", textColor: "text-amber-400" };
  if (score === 3) return { score: 75, label: "Good", color: "bg-cyan-500", textColor: "text-cyan-400" };
  return { score: 100, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400" };
}

const PasswordStrengthMeter = ({ password = "" }) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) }
  ];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2 pt-1">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-slate-400">Password Strength</span>
        <span className={`font-bold uppercase tracking-wider ${strength.textColor}`}>
          {strength.label}
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/50 p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            {req.met ? (
              <Check size={12} className="text-emerald-400 shrink-0" />
            ) : (
              <X size={12} className="text-slate-600 shrink-0" />
            )}
            <span className={req.met ? "text-slate-300 font-semibold" : "text-slate-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
