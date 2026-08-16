import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import InitialLoader from "./components/common/InitialLoader";
import AuthPage from "./pages/Auth/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Prediction from "./pages/Prediction/Prediction";
import Telemetry from "./pages/Telemetry/Telemetry";
import History from "./pages/History/History";
import Analytics from "./pages/Analytics/Analytics";
import Errors from "./pages/Errors/Errors";
import About from "./pages/About/About";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Handbook from "./pages/Handbook/Handbook";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("wqms-logged-in") === "true";
  });

  useEffect(() => {
    if (!initializing && isLoggedIn && (location.pathname === "/login" || location.pathname === "/auth")) {
      navigate("/");
    }
  }, [initializing, isLoggedIn, location.pathname, navigate]);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    localStorage.setItem("wqms-logged-in", "true");
    if (userData) {
      localStorage.setItem("wqms-username", userData.username || userData.fullName || "Analyst");
      localStorage.setItem("wqms-email", userData.email || "");
    }
    navigate("/");
  };

  return (
    <>
      {/* Initial Boot Loader */}
      <AnimatePresence mode="wait">
        {initializing && (
          <InitialLoader key="boot-loader" onComplete={() => setInitializing(false)} />
        )}
      </AnimatePresence>

      {/* Main App Routes */}
      {!initializing && (
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AuthPage onComplete={handleLoginSuccess} />} />
          <Route path="/auth" element={<AuthPage onComplete={handleLoginSuccess} />} />
          {isLoggedIn ? (
            <Route
              path="/*"
              element={
                <Layout>
                  <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/prediction" element={<Prediction />} />
                      <Route path="/telemetry" element={<Telemetry />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/errors" element={<Errors />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/handbook" element={<Handbook />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </Layout>
              }
            />
          ) : (
            <Route path="*" element={<AuthPage onComplete={handleLoginSuccess} />} />
          )}
        </Routes>
      )}
    </>
  );
}

export default App;