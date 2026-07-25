import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AnimatedBackground from "../common/AnimatedBackground";
import BubbleCursorTrail from "../common/BubbleCursorTrail";
import ParameterReferenceDrawer from "../common/ParameterReferenceDrawer";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Responsive Sidebar auto-collapse listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    handleResize(); // trigger initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans relative">
      {/* Global Interactive Elements */}
      <BubbleCursorTrail />
      <ParameterReferenceDrawer />

      {/* Dynamic Futuristic Animated Background */}
      <AnimatedBackground />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-col flex-1 min-w-0 z-10 relative">
        <Navbar />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;