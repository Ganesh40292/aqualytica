import { Table, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * Clean & Concise BIS Limits Table
 * Strictly official BIS IS 10500:2012 thresholds in dark glassmorphism.
 */
const BisLimitsTable = () => {
  const tableData = [
    {
      parameter: "pH Level",
      pin: "GPIO 34",
      unit: "pH",
      acceptable: "6.5 – 8.5",
      acceptableNote: "At 25°C reference condition",
      permissible: "No relaxation",
      permissibleNote: "Strict bounds",
      isStrict: true,
      method: "Analog pH Sensor (50-sample arithmetic mean)"
    },
    {
      parameter: "Turbidity",
      pin: "GPIO 35",
      unit: "NTU",
      acceptable: "Max 1.0 NTU",
      acceptableNote: "Recommended target",
      permissible: "Max 5.0 NTU",
      permissibleNote: "If no alternative source",
      isStrict: false,
      method: "Optical Turbidity (41 samples, 8 trimmed, piecewise calibration)"
    },
    {
      parameter: "Total Dissolved Solids (TDS)",
      pin: "GPIO 32",
      unit: "mg/L (ppm)",
      acceptable: "Max 500 mg/L",
      acceptableNote: "Palatable target",
      permissible: "Max 2000 mg/L",
      permissibleNote: "If no alternative source",
      isStrict: false,
      method: "Analog TDS Probe (30 samples, thermally compensated)"
    },
    {
      parameter: "Water Temperature",
      pin: "GPIO 4",
      unit: "°C",
      acceptable: "No limit specified",
      acceptableNote: "Ambient parameter",
      permissible: "No limit specified",
      permissibleNote: "In-situ reading",
      isStrict: false,
      method: "DS18B20 1-Wire Digital Probe (-10°C to < 85°C)"
    },
    {
      parameter: "Electrical Conductivity (EC)",
      pin: "Derived",
      unit: "µS/cm",
      acceptable: "No limit specified",
      acceptableNote: "Informational proxy",
      permissible: "No limit specified",
      permissibleNote: "Estimated from TDS",
      isStrict: false,
      method: "Calculated: EC = TDS × 2.0 µS/cm"
    }
  ];

  return (
    <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Table Header */}
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-cyan-400 shadow-md">
          <Table className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block">
            STATUTORY BENCHMARK REFERENCE
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            BIS IS 10500:2012 SPECIFICATION MATRIX
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/80 shadow-inner">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider text-xs">
              <th className="py-4 px-5 font-black text-slate-200">Parameter</th>
              <th className="py-4 px-4">Pin</th>
              <th className="py-4 px-4">Unit</th>
              <th className="py-4 px-5">BIS Acceptable Limit</th>
              <th className="py-4 px-5">Permissible Limit (No Alt Source)</th>
              <th className="py-4 px-5">Hardware Sensing Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium bg-slate-900/30">
            {tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-5 font-black text-white text-sm">{row.parameter}</td>
                <td className="py-4 px-4">
                  <span className="font-mono text-xs font-bold bg-slate-950/80 px-2 py-1 rounded-lg text-cyan-300 border border-cyan-900/40">
                    {row.pin}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-slate-400">{row.unit}</td>
                <td className="py-4 px-5">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    {row.acceptable !== "No limit specified" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{row.acceptable}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">{row.acceptableNote}</div>
                </td>
                <td className="py-4 px-5">
                  <div className={`font-bold flex items-center gap-1.5 text-sm ${row.isStrict ? "text-red-400" : "text-amber-400"}`}>
                    {row.permissible !== "No limit specified" && (
                      <AlertTriangle className={`w-4 h-4 shrink-0 ${row.isStrict ? "text-red-400" : "text-amber-400"}`} />
                    )}
                    <span>{row.permissible}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">{row.permissibleNote}</div>
                </td>
                <td className="py-4 px-5 text-xs text-slate-300 leading-relaxed">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-1">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-200">Acceptable Limit:</strong> Recommended drinking water target.{" "}
          <strong className="text-slate-200">Permissible Limit:</strong> Maximum statutory threshold allowed only when no alternative water source is available.
        </span>
      </div>
    </section>
  );
};

export default BisLimitsTable;