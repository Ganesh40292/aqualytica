import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ExportButton({ onExportCSV, onExportPDF, label = "Export Report" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4.5 py-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-750 text-slate-300 hover:text-slate-100 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
      >
        <Download className="w-4 h-4 text-cyan-400" />
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 space-y-0.5"
          >
            {onExportCSV && (
              <button
                onClick={() => {
                  onExportCSV();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-350 hover:text-slate-100 hover:bg-slate-855 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-450" />
                <span>Export CSV</span>
              </button>
            )}

            {onExportPDF && (
              <button
                onClick={() => {
                  onExportPDF();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-350 hover:text-slate-100 hover:bg-slate-855 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Export PDF</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExportButton;
