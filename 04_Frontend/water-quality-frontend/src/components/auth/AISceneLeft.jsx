import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AqualyticaLogo from "./AqualyticaLogo";

const QUOTES = [
  "“Safe water is the fundamental foundation of life, health, and human dignity.”",
  "“AI-powered real-time water quality intelligence at your fingertips.”",
  "“Precision hardware sensing & machine learning predictions for a sustainable future.”",
  "“Continuous monitoring, immediate alerts, and uncompromised potability verification.”",
  "“Empowering communities with transparent water safety analytics.”",
  "“Pure water is the world's first and foremost medicine.” — Slovak Proverb",
  "“Instant telemetry diagnostics backed by Random Forest ML classification.”",
  "“Transforming environmental telemetry into actionable potability insights.”"
];

const AISceneLeft = ({ activeTab = "login" }) => {
  const [quote, setQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    return QUOTES[randomIndex];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[randomIndex]);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden select-none bg-gradient-to-br from-[#04101e] via-[#081b33] to-[#06263b]">
      
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CENTERED DYNAMIC AQUALYTICA LOGO */}
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-72 h-72 md:w-80 md:h-80 flex items-center justify-center relative cursor-pointer"
        >
          <AqualyticaLogo className="w-full h-full" showText={true} />
        </motion.div>

        {/* DYNAMIC ROTATING INSPIRATIONAL QUOTE BOX */}
        <motion.div
          key={quote}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md px-6 py-4 text-center space-y-2.5"
        >
          <p className="text-slate-200 text-sm md:text-base font-semibold leading-relaxed tracking-wide italic font-serif">
            {quote}
          </p>
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
        </motion.div>
      </div>

    </div>
  );
};

export default AISceneLeft;
