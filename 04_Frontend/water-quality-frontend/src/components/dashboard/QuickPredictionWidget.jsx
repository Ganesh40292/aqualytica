import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { predictWaterQuality } from "../../services/predictionService";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../common/LoadingSpinner";

const QuickPredictionWidget = ({ onPredictionSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ph: "",
    temperature: "",
    turbidity: "",
    totalDissolvedSolids: "",
    conductivity: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await predictWaterQuality(formData);
      toast.showSuccess("Prediction generated successfully!");
      if (onPredictionSuccess) {
        onPredictionSuccess(result);
      }
    } catch (err) {
      console.error(err);
      toast.showError("Prediction failed. Check backend APIs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Quick Prediction
        </h3>
        <Link
          to="/prediction"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
        >
          Full Screen Form
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400">pH Level</label>
          <input
            type="number"
            step="0.01"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            placeholder="e.g. 7.2"
            required
            className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400">Temp (°C)</label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="e.g. 24"
            required
            className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400">Turbidity (NTU)</label>
          <input
            type="number"
            step="0.1"
            name="turbidity"
            value={formData.turbidity}
            onChange={handleChange}
            placeholder="e.g. 4.0"
            required
            className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400">TDS (mg/L)</label>
          <input
            type="number"
            step="1"
            name="totalDissolvedSolids"
            value={formData.totalDissolvedSolids}
            onChange={handleChange}
            placeholder="e.g. 300"
            required
            className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs font-semibold text-slate-400">Conductivity (µS/cm)</label>
          <input
            type="number"
            step="1"
            name="conductivity"
            value={formData.conductivity}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
            className="bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 mt-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-sm font-bold text-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
        >
          {loading ? <LoadingSpinner size="w-4 h-4" /> : "Run Model Predict"}
        </button>
      </form>
    </div>
  );
};

export default QuickPredictionWidget;
