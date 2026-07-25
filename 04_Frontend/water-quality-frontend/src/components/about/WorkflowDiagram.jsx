import { motion } from "framer-motion";
import { Cpu, Server, Brain, GitCommit, CheckSquare, Database, LayoutDashboard, ChevronDown } from "lucide-react";

const pipelineNodes = [
  {
    step: "01",
    name: "ESP32 Sensor Probes",
    icon: Cpu,
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/30",
    description: "Samples chemical, optical, and thermal signals continuously."
  },
  {
    step: "02",
    name: "Spring Boot Gateway",
    icon: Server,
    color: "text-purple-400 border-purple-500/20 bg-purple-950/30",
    description: "Ingests raw telemetry endpoints, parses boundaries, and coordinates requests."
  },
  {
    step: "03",
    name: "Python Flask Service",
    icon: Brain,
    color: "text-green-400 border-green-500/20 bg-green-950/30",
    description: "Applies feature scaling standardizers to incoming data arrays."
  },
  {
    step: "04",
    name: "Random Forest Classifier",
    icon: GitCommit,
    color: "text-yellow-400 border-yellow-500/20 bg-yellow-950/30",
    description: "Evaluates consensus across trained decision tree structures."
  },
  {
    step: "05",
    name: "Prediction Decision",
    icon: CheckSquare,
    color: "text-emerald-450 border-emerald-500/20 bg-emerald-950/30",
    description: "Generates output safety label (Potable / Not Potable) and confidence indices."
  },
  {
    step: "06",
    name: "MySQL Relational Tables",
    icon: Database,
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/30",
    description: "Persists records to historical analysis databases."
  },
  {
    step: "07",
    name: "React 19 Dashboard",
    icon: LayoutDashboard,
    color: "text-teal-400 border-teal-500/20 bg-teal-950/30",
    description: "Retrieves histories and presents metrics using real-time graphical charts."
  }
];

function WorkflowDiagram() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
        <span className="text-[10px] font-bold text-cyan-405 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded uppercase tracking-wider">
          Architecture Pipeline
        </span>
        <h4 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
          End-to-End System Integration Flow
        </h4>
      </div>

      <div className="flex flex-col items-center relative">
        {pipelineNodes.map((node, index) => {
          const NodeIcon = node.icon;
          const isLast = index === pipelineNodes.length - 1;

          return (
            <div key={node.step} className="flex flex-col items-center w-full max-w-lg">
              <motion.div
                variants={itemVariants}
                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 transition-all duration-300 relative group"
              >
                {/* Node Index */}
                <div className="text-[10px] font-bold font-mono text-slate-500 shrink-0">
                  {node.step}
                </div>

                {/* Node Icon Circle */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${node.color} shadow-sm group-hover:scale-105 transition-transform duration-350`}>
                  <NodeIcon className="w-5 h-5" />
                </div>

                {/* Node Details */}
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-200 block group-hover:text-slate-100 transition-colors">
                    {node.name}
                  </span>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                    {node.description}
                  </p>
                </div>
              </motion.div>

              {/* Connecting animated arrow/line */}
              {!isLast && (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center my-3 text-slate-650 shrink-0"
                >
                  <div className="h-6 w-[2px] bg-gradient-to-b from-cyan-500/30 to-purple-500/20" />
                  <ChevronDown className="w-4 h-4 text-purple-400/40 -mt-1 animate-bounce" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default WorkflowDiagram;
