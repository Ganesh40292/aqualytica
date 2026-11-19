import PageWrapper from "../../components/common/PageWrapper";
import PredictionForm from "../../components/prediction/PredictionForm";
import ParameterReferencePanel from "../../components/prediction/ParameterReferencePanel";
import ExportButton from "../../components/common/ExportButton";
import { exportExactPageToPDF } from "../../utils/exportUtils";
import { Sparkles, Brain } from "lucide-react";

/**
 * Professional Water Analysis Page (Route: /prediction)
 * High-end SCADA laboratory UI with full-width Water Sample Analysis section
 * and Statutory Benchmark Reference section positioned directly below it.
 */
const Prediction = () => {
  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  return (
    <PageWrapper className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-16">
      {/* ═══ CONSOLE HEADER ═══ */}
      <header className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Sparkles size={13} className="text-cyan-400" />
              Aqualytica Analysis Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              <Brain size={13} />
              Random Forest In-Memory
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight pt-1">
            WATER QUALITY ANALYSIS & ML PREDICTION
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
            Enter sample parameters for real-time Random Forest potability inference, or trigger on-demand physical sensor acquisition from the ESP32 hardware cluster.
          </p>
        </div>

        <div className="relative z-10 self-start md:self-auto shrink-0">
          <ExportButton onExportPDF={handleExportPDF} label="Export Report" />
        </div>
      </header>

      {/* ═══ SECTION 1: WATER SAMPLE ANALYSIS (FULL WIDTH & EXPANDED) ═══ */}
      <section className="w-full">
        <PredictionForm />
      </section>

      {/* ═══ SECTION 2: STATUTORY BENCHMARK REFERENCE (POSITIONED BELOW) ═══ */}
      <section className="w-full">
        <ParameterReferencePanel />
      </section>
    </PageWrapper>
  );
};

export default Prediction;
