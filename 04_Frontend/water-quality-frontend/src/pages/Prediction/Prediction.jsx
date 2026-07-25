import PageWrapper from "../../components/common/PageWrapper";
import PredictionForm from "../../components/prediction/PredictionForm";
import ParameterReferencePanel from "../../components/prediction/ParameterReferencePanel";
import ExportButton from "../../components/common/ExportButton";
import { exportExactPageToPDF } from "../../utils/exportUtils";
import { Cpu, Activity, Thermometer, ShieldCheck } from "lucide-react";

const Prediction = () => {
  const handleExportPDF = () => {
    exportExactPageToPDF();
  };

  return (
    <PageWrapper className="space-y-6">
      
      {/* Top Header and Exporter panel */}
      <div className="flex justify-between items-center no-print">
        <div className="text-slate-450 text-xs font-bold uppercase tracking-wider">
          Water Quality Anomaly Estimator
        </div>
        <ExportButton
          onExportPDF={handleExportPDF}
          label="Export Page"
        />
      </div>

      {/* Spacious 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
        
        {/* Left Column: Water Sample Analysis Form */}
        <div className="lg:col-span-2">
          <PredictionForm />
        </div>

        {/* Right Column: Telemetry Calibration Inspector */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Card 1: Sensor Hardware calibration stats */}
          <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-5 flex-1 hover:border-cyan-500/20 transition-all duration-300">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                IoT Calibration Panel
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Hardware Node Calibration Diagnostics
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-850">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Activity className="w-4 h-4 text-cyan-455" /> pH Probe
                  </span>
                  <span className="text-green-400 bg-green-950/40 border border-green-900/30 px-1.5 py-0.5 rounded text-[10px]">Calibrated (pH 7.0)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-[98%] bg-cyan-500 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-850">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Activity className="w-4 h-4 text-teal-400" /> Turbidity Optic
                  </span>
                  <span className="text-green-400 bg-green-950/40 border border-green-900/30 px-1.5 py-0.5 rounded text-[10px]">Calibrated (0 NTU)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-[95%] bg-teal-450 rounded-full" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-955/40 border border-slate-850">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Thermometer className="w-4 h-4 text-rose-400" /> Temp Transducer
                  </span>
                  <span className="text-green-400 bg-green-950/40 border border-green-900/30 px-1.5 py-0.5 rounded text-[10px]">Calibrated (25 °C)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-[99%] bg-rose-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/10 border border-cyan-800/20 text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Hardware Signal Stable
            </div>
          </div>

          {/* Card 2: ML Model evaluation guidelines explanation */}
          <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-4 hover:border-cyan-500/20 transition-all duration-300">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              Evaluation Guideline
            </h4>
            <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
              <p>
                Each evaluation runs through a multi-layer Scikit-learn estimator classifier hosting a Random Forest structure.
              </p>
              <p>
                The confidence values output indicates decision consensus across trees. Classifications are backed by standardized WHO target thresholds.
              </p>
            </div>
          </div>

          {/* Card 3: Water Quality Parameter Reference */}
          <ParameterReferencePanel />
        </div>

      </div>
    </PageWrapper>
  );
};

export default Prediction;
