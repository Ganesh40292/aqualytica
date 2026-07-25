import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResumeIQLogo from "./ResumeIQLogo";

const QUOTES = [
  "“The best way to predict the future is to create it.” — Peter Drucker",
  "“Your resume is your story. Make it a bestseller with ResumeIQ.”",
  "“Opportunities don't happen, you create them.” — Chris Grosser",
  "“The secret of getting ahead is getting started.” — Mark Twain",
  "“AI-powered career insights built for modern professionals.”",
  "“Success is where preparation and opportunity meet.” — Bobby Unser",
  "“Optimize your resume, improve ATS scores, and land your dream interview.”",
  "“Intelligence is the ability to adapt to change.” — Stephen Hawking"
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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden select-none bg-gradient-to-br from-[#06152d] via-[#051125] to-[#2b170c]">
      
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* CENTERED DYNAMIC RESUMEIQ LOGO */}
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-72 h-72 md:w-80 md:h-80 flex items-center justify-center relative cursor-pointer"
        >
          <ResumeIQLogo className="w-full h-full" showText={true} />
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
          <div className="w-12 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
        </motion.div>
      </div>

    </div>
  );
};

export default AISceneLeft;
