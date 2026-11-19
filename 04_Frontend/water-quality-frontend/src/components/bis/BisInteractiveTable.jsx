import { useState } from "react";
import {
  Table,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  AlertTriangle,
  CheckCircle2,
  Activity
} from "lucide-react";

/**
 * Section 4: BIS Values Table for 5 Parameters
 * Standard Year specified at top: BIS IS 10500:2012
 * Prominent dropdown toggle on each row revealing clear, simple details.
 * Optimized with bold, comfortable font sizes for high visibility.
 */
const BisInteractiveTable = ({ latestRecord = null }) => {
  // Store expanded row IDs in state
  const [expandedRows, setExpandedRows] = useState({ ph: true }); // pH expanded by default for discoverability

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const parameters = [
    {
      id: "ph",
      name: "pH Level",
      pin: "GPIO 34",
      unit: "pH units",
      acceptable: "6.5 – 8.5",
      permissible: "No relaxation",
      currentVal: latestRecord?.ph !== undefined ? Number(latestRecord.ph).toFixed(2) : null,
      status: latestRecord?.ph
        ? latestRecord.ph >= 6.5 && latestRecord.ph <= 8.5
          ? "Within Acceptable Limit"
          : "Exceeds Specified Limit"
        : "Standby",
      isBreached: latestRecord?.ph ? latestRecord.ph < 6.5 || latestRecord.ph > 8.5 : false,
      whatIsIt:
        "pH measures how acidic or alkaline the water is on a scale from 0 to 14. A pH of 7.0 is neutral. Clean natural drinking water is typically near neutral.",
      whyLimitMatters:
        "Water with pH below 6.5 is acidic and can corrode metallic pipes, causing metals to leach into water. Water with pH above 8.5 has a bitter taste, feels slippery, and leaves mineral scale on plumbing and utensils.",
      sensorDetails: "Analog pH Sensor on GPIO 34 (taking 50-sample arithmetic mean per reading)"
    },
    {
      id: "turbidity",
      name: "Turbidity",
      pin: "GPIO 35",
      unit: "NTU",
      acceptable: "Max 1.0 NTU",
      permissible: "Max 5.0 NTU",
      currentVal: latestRecord?.turbidity !== undefined ? Number(latestRecord.turbidity).toFixed(1) : null,
      status: latestRecord?.turbidity
        ? latestRecord.turbidity <= 1.0
          ? "Within Acceptable Limit"
          : latestRecord.turbidity <= 5.0
          ? "Within Permissible Limit"
          : "Exceeds Permissible Limit"
        : "Standby",
      isBreached: latestRecord?.turbidity ? latestRecord.turbidity > 5.0 : false,
      whatIsIt:
        "Turbidity measures the cloudiness or haziness of water caused by tiny suspended mud, silt, or microscopic particles that scatter light.",
      whyLimitMatters:
        "High turbidity makes water look cloudy and unappealing. More importantly, suspended particles can shield bacteria and harmful microbes from chlorine disinfection.",
      sensorDetails: "Optical Infrared Turbidity Sensor on GPIO 35 (41-sample median trimmed piecewise curve)"
    },
    {
      id: "tds",
      name: "Total Dissolved Solids (TDS)",
      pin: "GPIO 32",
      unit: "mg/L (ppm)",
      acceptable: "Max 500 mg/L",
      permissible: "Max 2000 mg/L",
      currentVal: latestRecord?.totalDissolvedSolids !== undefined ? Number(latestRecord.totalDissolvedSolids).toFixed(1) : null,
      status: latestRecord?.totalDissolvedSolids
        ? latestRecord.totalDissolvedSolids <= 500
          ? "Within Acceptable Limit"
          : latestRecord.totalDissolvedSolids <= 2000
          ? "Within Permissible Limit"
          : "Exceeds Permissible Limit"
        : "Standby",
      isBreached: latestRecord?.totalDissolvedSolids ? latestRecord.totalDissolvedSolids > 2000 : false,
      whatIsIt:
        "TDS refers to the total amount of dissolved minerals, salts, calcium, and metals dissolved in the water.",
      whyLimitMatters:
        "Water with TDS under 500 mg/L tastes pleasant and natural. Water with very high TDS (above 500 mg/L) tastes salty or bitter and causes hard water scaling on heating coils and boilers.",
      sensorDetails: "Analog TDS Probe on GPIO 32 (thermally compensated using temperature sensor)"
    },
    {
      id: "temp",
      name: "Water Temperature",
      pin: "GPIO 4",
      unit: "°C",
      acceptable: "No numerical limit",
      permissible: "No numerical limit",
      currentVal: latestRecord?.temperature !== undefined ? Number(latestRecord.temperature).toFixed(1) : null,
      status: "Ambient In-Situ Reading",
      isBreached: false,
      whatIsIt:
        "The physical temperature of the water sample at the moment of measurement.",
      whyLimitMatters:
        "BIS IS 10500:2012 does not prescribe a rigid numerical limit for temperature because seasonal and source temperatures vary widely across India. However, temperature directly influences chemical reaction rates, taste, and the calibration of pH and TDS sensors.",
      sensorDetails: "DS18B20 1-Wire Waterproof Digital Probe on GPIO 4 (-10°C to < 85°C validated range)"
    },
    {
      id: "ec",
      name: "Electrical Conductivity (EC)",
      pin: "Derived",
      unit: "µS/cm",
      acceptable: "Covered under TDS",
      permissible: "Estimated: TDS × 2.0",
      currentVal:
        latestRecord?.conductivity !== undefined && latestRecord?.conductivity !== null
          ? Number(latestRecord.conductivity).toFixed(1)
          : latestRecord?.totalDissolvedSolids
          ? (latestRecord.totalDissolvedSolids * 2.0).toFixed(1)
          : null,
      status: "Calculated Proxy Indicator",
      isBreached: false,
      whatIsIt:
        "Electrical Conductivity measures the ability of water to carry an electric current. Pure distilled water does not conduct electricity, while water containing dissolved mineral ions conducts electricity easily.",
      whyLimitMatters:
        "BIS regulates ionic content primarily through Total Dissolved Solids (TDS). In routine water testing, EC is directly related to TDS through the standard formula: EC ≈ TDS × 2.0 µS/cm.",
      sensorDetails: "Derived by software formula from thermally compensated TDS reading (EC = TDS × 2.0 µS/cm)"
    }
  ];

  return (
    <section className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* ═══ TABLE TOP HEADER WITH YEAR PROMINENTLY SPECIFIED ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 shadow-md">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-cyan-400">
                OFFICIAL SPECIFICATION YEAR: 2012
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-400">
                SECOND REVISION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              BIS IS 10500:2012 — 5 Key Monitored Parameters
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 font-medium">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Click any row or dropdown toggle to view detailed parameter facts</span>
        </div>
      </div>

      {/* ═══ EXPANDABLE PARAMETERS TABLE ═══ */}
      <div className="space-y-4">
        {parameters.map((param) => {
          const isExpanded = !!expandedRows[param.id];

          return (
            <div
              key={param.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? "bg-slate-950/80 border-cyan-500/50 shadow-xl"
                  : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Row Header (Clickable) */}
              <div
                onClick={() => toggleRow(param.id)}
                className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 cursor-pointer select-none"
              >
                {/* Column 1: Parameter Name and Hardware Pin */}
                <div className="flex items-center gap-4 min-w-[260px]">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {param.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold bg-cyan-950/60 text-cyan-300 px-2.5 py-0.5 rounded-md border border-cyan-900/60">
                        {param.pin}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-slate-400 font-medium">
                        Unit: {param.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Acceptable vs Permissible Limits */}
                <div className="grid grid-cols-2 gap-5 sm:gap-10 flex-1 lg:max-w-md">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Acceptable Limit
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                      {param.acceptable}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                      Permissible Limit
                    </span>
                    <span className={`text-base sm:text-lg font-black font-mono mt-0.5 block ${
                      param.permissible === "No relaxation" ? "text-red-400" : "text-amber-400"
                    }`}>
                      {param.permissible}
                    </span>
                  </div>
                </div>

                {/* Column 3: Live Hardware Value (if available) */}
                <div className="flex items-center justify-between lg:justify-end gap-5 min-w-[220px]">
                  {param.currentVal !== null ? (
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Live ESP32 Reading
                      </span>
                      <span className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                        {param.currentVal} <span className="text-xs text-slate-400 font-sans">{param.unit}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="text-left lg:text-right">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Live Reading
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono font-medium">Standby</span>
                    </div>
                  )}

                  {/* Dropdown Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(param.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isExpanded
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* ═══ EXPANDED INFORMATION PANEL (DROPDOWN CONTENT) ═══ */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 bg-slate-900/30 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    {/* What is it? */}
                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-cyan-400 block flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        What is {param.name}?
                      </span>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                        {param.whatIsIt}
                      </p>
                    </div>

                    {/* Why this limit matters */}
                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 block flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Why This BIS Limit Matters
                      </span>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                        {param.whyLimitMatters}
                      </p>
                    </div>
                  </div>

                  {/* Hardware details and Live Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                      <span>
                        <strong className="text-white">Sensor Configuration:</strong> {param.sensorDetails}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400">Current Status:</span>
                      <span className={`font-black px-3 py-1 rounded-lg text-xs ${
                        param.isBreached
                          ? "bg-red-950/70 text-red-300 border border-red-800"
                          : "bg-emerald-950/70 text-emerald-300 border border-emerald-800"
                      }`}>
                        {param.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-3 text-xs sm:text-sm text-slate-300">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white">Official BIS Reference:</strong> Bureau of Indian Standards IS 10500:2012 (Second Revision) Table 1 (Organoleptic and Physical Parameters) and Table 2 (General Parameters Concerning Substances Undesirable in Excessive Amounts).
        </span>
      </div>
    </section>
  );
};

export default BisInteractiveTable;
