import PageWrapper from "../../components/common/PageWrapper";
import ModelInfoCard from "../../components/about/ModelInfoCard";
import WorkflowDiagram from "../../components/about/WorkflowDiagram";
import { BookOpen, Layers, Brain, Target, Terminal, Compass, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <PageWrapper className="space-y-16 max-w-5xl">

      {/* Section 1: Project Overview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-cyan-400 flex items-center gap-3">
          <BookOpen className="w-6.5 h-6.5 text-cyan-400" />
          1. Project Overview
        </h3>
        
        <div className="pl-4 border-l-2 border-cyan-500/20 ml-1">
          <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-4">
            <p className="text-lg text-slate-305 leading-relaxed font-semibold">
              Aqualytica is a comprehensive Water Quality Monitoring and Analytics Platform. It bridges physical IoT nodes with machine learning algorithms to verify water potability. The system monitors critical chemical, optical, and thermal characteristics in real-time, providing immediate classifications for drinking water safety.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Problem Statement & Objectives */}
      <div className="space-y-6 pt-4 border-t border-slate-805/40">
        <h3 className="text-2xl font-black text-rose-400 flex items-center gap-3">
          <Target className="w-6.5 h-6.5 text-rose-400" />
          2. Scope & Objectives
        </h3>
        
        <div className="pl-4 border-l-2 border-rose-500/20 ml-1 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/40 border border-slate-850 shadow-md space-y-3">
            <h4 className="text-slate-200 text-lg font-bold uppercase tracking-wider">Problem Statement</h4>
            <p className="text-base text-slate-350 leading-relaxed">
              Access to clean drinking water is a critical requirement for public health. Traditional laboratory testing of water samples is slow, costly, and cannot provide real-time updates. This delay can lead to consumption of contaminated water before an issue is identified. Aqualytica addresses this gap by combining fast IoT sensor stream scanning with AI prediction algorithms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-955/20 border border-slate-850 shadow-md space-y-4">
            <h4 className="text-slate-200 text-lg font-bold uppercase tracking-wider">Project Objectives</h4>
            <div className="space-y-3 text-base text-slate-350">
              <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-rose-400 shrink-0 mt-0.5" /> Deploy multi-sensor IoT probes to collect chemical and optical diagnostics.</div>
              <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-rose-405 shrink-0 mt-0.5" /> Implement standard scalers to scale feature vectors without skews.</div>
              <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-rose-400 shrink-0 mt-0.5" /> Run live classification using decision tree consensus rules.</div>
              <div className="flex items-start gap-3"><CheckCircle2 size={18} className="text-rose-400 shrink-0 mt-0.5" /> Render interactive dashboards and analytical records.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: System Integration Pipeline & Custom Workflow Diagram */}
      <div className="space-y-6 pt-4 border-t border-slate-805/40">
        <h3 className="text-2xl font-black text-purple-400 flex items-center gap-3">
          <Layers className="w-6.5 h-6.5 text-purple-400" />
          3. System Integration Architecture
        </h3>
        
        <div className="pl-4 border-l-2 border-purple-500/20 ml-1 space-y-8">
          <p className="text-lg text-slate-300 leading-relaxed font-semibold">
            The platform executes data transmissions across main components sequentially. Below is the custom integration workflow diagram:
          </p>

          <WorkflowDiagram />
        </div>
      </div>

      {/* Section 4: Technologies & Hardware Sensors Configuration */}
      <div className="space-y-6 pt-4 border-t border-slate-805/40">
        <h3 className="text-2xl font-black text-yellow-405 flex items-center gap-3">
          <Terminal className="w-6.5 h-6.5 text-yellow-405" />
          4. Hardware & Technology Stack
        </h3>
        
        <div className="pl-4 border-l-2 border-yellow-500/20 ml-1 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-955/40 border border-slate-850">
              <span className="text-cyan-405 font-bold uppercase tracking-wider text-sm block mb-1">Frontend Layer</span>
              <p className="text-slate-350 text-sm leading-relaxed font-semibold">React 19, React Router, TailwindCSS, Framer Motion, Recharts.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-955/40 border border-slate-850">
              <span className="text-purple-400 font-bold uppercase tracking-wider text-sm block mb-1">Gateway Layer</span>
              <p className="text-slate-350 text-sm leading-relaxed font-semibold">Spring Boot REST API, relational MySQL persistence engine.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-955/40 border border-slate-850">
              <span className="text-green-400 font-bold uppercase tracking-wider text-sm block mb-1">Inference Service</span>
              <p className="text-slate-350 text-sm leading-relaxed font-semibold">Python Flask inference microservice, Scikit-learn scaling modules.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-955/40 border border-slate-850">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-sm block mb-1">Hardware Microcontroller</span>
              <p className="text-slate-350 text-sm leading-relaxed font-semibold">ESP32 SoC node, analog ADC signal parsing algorithms.</p>
            </div>
          </div>

          <h4 className="text-slate-205 text-lg font-bold uppercase tracking-wider mt-4">Hardware Probes Specification</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">pH Electrode Probe</span>
              <p className="text-slate-350 mt-2 text-sm leading-relaxed font-semibold">Measures hydrogen-ion activity to determine acidity or alkalinity levels.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
              <span className="text-teal-400 font-bold uppercase tracking-wider text-sm">Turbidity Optical Sensor</span>
              <p className="text-slate-350 mt-2 text-sm leading-relaxed font-semibold">Uses light scattering to detect suspended particles and clarity levels.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
              <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">TDS Electrical Probe</span>
              <p className="text-slate-350 mt-2 text-sm leading-relaxed font-semibold">Measures conductivity to evaluate total dissolved minerals and salts.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-sm">Temp Transducer</span>
              <p className="text-slate-350 mt-2 text-sm leading-relaxed font-semibold">Measures thermal fluctuations affecting parameter scale ranges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Machine Learning Model Specifications */}
      <div className="space-y-6 pt-4 border-t border-slate-805/40">
        <h3 className="text-2xl font-black text-green-400 flex items-center gap-3">
          <Brain className="w-6.5 h-6.5 text-green-400" />
          5. Machine Learning Specifications
        </h3>
        
        <div className="pl-4 border-l-2 border-green-500/20 ml-1 space-y-6">
          <p className="text-lg text-slate-250 leading-relaxed font-semibold">
            Below are the detailed Random Forest classifier metrics:
          </p>

          <ModelInfoCard />
        </div>
      </div>

      {/* Section 6: Future Scope */}
      <div className="space-y-6 pt-4 border-t border-slate-805/40">
        <h3 className="text-2xl font-black text-teal-400 flex items-center gap-3">
          <Compass className="w-6.5 h-6.5 text-teal-400" />
          6. Future Scope & Roadmap
        </h3>
        
        <div className="pl-4 border-l-2 border-teal-500/20 ml-1">
          <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-8 shadow-2xl space-y-4">
            <div className="space-y-3.5 text-base text-slate-350">
              <div className="flex items-start gap-3.5"><CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" /> Integration of GSM modules for remote telemetry streaming in non-WiFi zones.</div>
              <div className="flex items-start gap-3.5"><CheckCircle2 size={18} className="text-teal-405 shrink-0 mt-0.5" /> Implementation of neural network models (LSTM/Dense) to predict parameter trends.</div>
              <div className="flex items-start gap-3.5"><CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" /> Edge computing deployment using TinyML to run predictions directly on ESP32 microcontrollers.</div>
              <div className="flex items-start gap-3.5"><CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" /> Multi-region geospatial mapping of water safety indices on web client modules.</div>
            </div>
          </div>
        </div>
      </div>

    </PageWrapper>
  );
};

export default About;
