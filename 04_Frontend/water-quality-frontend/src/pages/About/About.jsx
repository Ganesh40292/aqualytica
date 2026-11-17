import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../../components/common/PageWrapper";
import ModelInfoCard from "../../components/about/ModelInfoCard";
import ArchitectureFlowchart from "../../components/about/ArchitectureFlowchart";
import SensorCalibrationCard from "../../components/about/SensorCalibrationCard";
import AnomalyDetectionOverview from "../../components/about/AnomalyDetectionOverview";
import SystemSpecsTable from "../../components/about/SystemSpecsTable";
import { 
  BookOpen, Layers, Brain, Target, Terminal, Compass, 
  ShieldCheck, Cpu, Award, ChevronDown, 
  ChevronsUpDown, Sparkles, Radio, Database, Check
} from "lucide-react";

/**
 * Revamped, Spacious & Interactive About System Page
 * Features expandable dropdown sections, executive summaries, quick-jump pills,
 * and condensed, high-impact content blocks to eliminate congestion.
 */
const About = () => {
  // Section dropdown state - Section 1 open by default for immediate orientation
  const [openSections, setOpenSections] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true });
  };

  const collapseAll = () => {
    setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false });
  };

  const scrollToSection = (id) => {
    // Open section if closed
    setOpenSections((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const element = document.getElementById(`about-section-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const allExpanded = Object.values(openSections).every(Boolean);

  const sectionsList = [
    { id: 1, title: "Overview", icon: BookOpen, color: "text-cyan-400" },
    { id: 2, title: "Architecture", icon: Layers, color: "text-purple-400" },
    { id: 3, title: "Sensors & Formulas", icon: Cpu, color: "text-cyan-400" },
    { id: 4, title: "Anomaly Intelligence", icon: ShieldCheck, color: "text-amber-400" },
    { id: 5, title: "Random Forest ML", icon: Brain, color: "text-emerald-400" },
    { id: 6, title: "Full-Stack Blueprint", icon: Terminal, color: "text-yellow-400" },
    { id: 7, title: "Future Roadmap", icon: Compass, color: "text-teal-400" },
  ];

  return (
    <PageWrapper className="space-y-8 sm:space-y-10 max-w-6xl pb-20">

      {/* Hero Title Section */}
      <div className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award size={13} /> Final-Year Major Project
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} /> IoT + Machine Learning
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={13} /> Real-Time Telemetry & Anomaly Intelligence
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight">
              AQUALYTICA
            </h1>
            <p className="text-base sm:text-lg text-cyan-400 font-semibold tracking-wide mt-1">
              IoT-Based Smart Water Quality Monitoring and Anomaly Detection System Using Machine Learning
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            An end-to-end cyber-physical environmental monitoring platform. Combines calibrated physical sensor probes, sub-second MQTT telemetry, deterministic anomaly guardrails, and a trained Random Forest model for real-time potability classification.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/60">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950/40 text-cyan-400">
                <Cpu size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Physical Probes</span>
                <span className="text-sm font-black text-slate-200">5 Channels</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400">
                <Brain size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">ML Accuracy</span>
                <span className="text-sm font-black text-emerald-400">82.60% Verified</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400">
                <Radio size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Telemetry Link</span>
                <span className="text-sm font-black text-slate-200">MQTT :1883</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-950/40 text-amber-400">
                <Database size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Data Store</span>
                <span className="text-sm font-black text-slate-200">Supabase PG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills & Expand/Collapse Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/20 backdrop-blur-2xl border border-slate-800/40 rounded-2xl p-3 sm:px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1 hidden lg:inline">
            Jump to:
          </span>
          {sectionsList.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-850 text-slate-300 hover:text-cyan-400 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <sec.icon size={12} className={sec.color} />
              <span>0{sec.id} {sec.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={allExpanded ? collapseAll : expandAll}
          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <ChevronsUpDown size={13} className="text-cyan-400" />
          <span>{allExpanded ? "Collapse All Sections" : "Expand All Sections"}</span>
        </button>
      </div>

      {/* ═══ SECTION 1: PROJECT OVERVIEW ═══ */}
      <div id="about-section-1" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-cyan-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(1)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Section 01</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Mission & Problem Statement</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Project Overview & Objectives
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/50 border border-cyan-800/40 text-cyan-300">
              Problem & Solution
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[1] ? "rotate-180 text-cyan-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[1] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Target size={16} className="text-rose-400" /> The Drinking Water Safety Challenge
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Traditional laboratory-based water testing requires manual sample transit and 24 to 72 hours for chemical titration and culturing. This substantial delay prevents rapid response during sudden pollution surges or pipeline corrosion events.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    <strong>Aqualytica</strong> eliminates these delays through an autonomous cyber-physical architecture. Submersible sensors deployed in reservoirs continuously measure physicochemical indicators, apply digital noise filters, and stream telemetry via MQTT to a cloud-hosted decision tree ensemble for instant potability classification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-3">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                      Core Deliverables
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>Continuous in-situ measurement of pH, Turbidity, TDS, Temperature, and EC.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>Sub-second MQTT event dispatch between ESP32 hardware and Spring Boot backend.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>On-demand hardware calibration testing directly from the web interface.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-3">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                      Key Innovations
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>Dual-layer anomaly intelligence separating hardware probe faults from ML predictions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>Standardized 5-feature Random Forest model with 82.60% verified testing accuracy.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>Immutable audit logging in Supabase PostgreSQL with real-time waveform dashboards.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 2: ARCHITECTURE & WORKFLOWS ═══ */}
      <div id="about-section-2" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-purple-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(2)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Section 02</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Pipelines & Topology</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                End-to-End System Architecture & Workflows
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/50 border border-purple-800/40 text-purple-300">
              3 Data Pipelines
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[2] ? "rotate-180 text-purple-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[2] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Aqualytica coordinates three primary workflows: <em>Periodic Telemetry Streaming</em> (every 10s), <em>On-Demand Bidirectional Hardware Testing</em> (sub-second trigger via MQTT commands), and <em>Manual Lab Potability Estimation</em>. Toggle through each interactive flow below:
                </p>

                <ArchitectureFlowchart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 3: PHYSICAL SENSORS & CALIBRATION ═══ */}
      <div id="about-section-3" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-cyan-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(3)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">Section 03</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Hardware Transducers & Formulas</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Physical Sensors, Calibration & Mathematical Formulas
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/50 border border-cyan-800/40 text-cyan-300">
              5 Calibrated Probes
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[3] ? "rotate-180 text-cyan-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[3] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Each physical sensor connected to the ESP32 DevKit V1 operates under calibrated signal-conditioning formulas (trimmed-mean filters, moving averages, and thermal compensation) to eliminate electrical noise:
                </p>

                <SensorCalibrationCard />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 4: DUAL-TIER ANOMALY INTELLIGENCE ═══ */}
      <div id="about-section-4" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(4)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Section 04</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Fault Protection & Guardrails</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Two-Tier Anomaly Intelligence & Safety Guardrails
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/50 border border-amber-800/40 text-amber-300">
              2 Defense Tiers
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[4] ? "rotate-180 text-amber-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[4] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Aqualytica implements a two-tier guardrail system. Physical hardware faults (broken probe wires, saturation, or -127°C readings) are caught deterministically by the Spring Boot backend to safeguard ML inference from distorted data:
                </p>

                <AnomalyDetectionOverview />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 5: RANDOM FOREST MACHINE LEARNING ═══ */}
      <div id="about-section-5" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-emerald-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(5)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Section 05</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Classification & Weights</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Random Forest ML Architecture & Evaluation
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/50 border border-emerald-800/40 text-emerald-300">
              82.60% Accuracy • 100 Trees
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[5] ? "rotate-180 text-emerald-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[5] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  The potability classifier consists of a 100-tree Random Forest ensemble hosted in the Python Flask microservice. Features are preprocessed with Standard Z-Score normalization:
                </p>

                <ModelInfoCard />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 6: FULL-STACK BLUEPRINT ═══ */}
      <div id="about-section-6" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-yellow-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(6)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-yellow-950/40 border border-yellow-800/40 flex items-center justify-center text-yellow-400 shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">Section 06</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Technologies & Protocols</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Full-Stack System Layer Specifications
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-950/50 border border-yellow-800/40 text-yellow-300">
              6 Architectural Tiers
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[6] ? "rotate-180 text-yellow-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[6] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Summary of frameworks, network communication protocols, and cloud storage engines utilized throughout the project:
                </p>

                <SystemSpecsTable />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ SECTION 7: FUTURE SCOPE & ROADMAP ═══ */}
      <div id="about-section-7" className="bg-slate-900/30 backdrop-blur-3xl border border-slate-800/40 rounded-3xl overflow-hidden shadow-2xl hover:border-teal-500/20 transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection(7)}
          className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-teal-950/40 border border-teal-800/40 flex items-center justify-center text-teal-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest">Section 07</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-semibold">Scalability & Expansion</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                Future Scope & Research Roadmap
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-950/50 border border-teal-800/40 text-teal-300">
              4 Future Horizons
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSections[7] ? "rotate-180 text-teal-400" : ""}`} />
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {openSections[7] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-800/60"
            >
              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Planned research directions to transition Aqualytica from an edge prototype into an enterprise-grade municipal water monitoring solution:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
                    <span className="text-teal-400 font-bold uppercase tracking-wider text-xs block">
                      1. Edge AI via TinyML
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deploying quantized Decision Trees directly onto the ESP32 using TensorFlow Lite for Microcontrollers (TFLM) to enable offline classification without cloud reliance.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs block">
                      2. Cellular & Satellite Telemetry
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Integrating SIM7600 4G LTE and NB-IoT modems for remote reservoirs and agricultural canals beyond local Wi-Fi router coverage.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
                    <span className="text-purple-400 font-bold uppercase tracking-wider text-xs block">
                      3. Temporal Trend Forecasting
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deploying LSTM recurrent neural networks to forecast water contamination 12 to 24 hours in advance based on seasonal temperatures and runoff.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-2">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block">
                      4. Geospatial GIS Mapping
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Integrating Leaflet/Mapbox GIS mapping to display multi-station water sensor stations across city grids with color-coded safety contours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </PageWrapper>
  );
};

export default About;
