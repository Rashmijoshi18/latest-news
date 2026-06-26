import { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import Toast from "./components/Toast";
import useDarkMode from "./hooks/useDarkMode";

// Global styling is imported in main.jsx

/**
 * Main App component. Setups layout containers, error boundaries,
 * routing paths, notifications, and dark theme state hooks.
 */
function App() {
  const [theme, toggleTheme] = useDarkMode();
  const [toast, setToast] = useState({ message: "", type: "success" });

  // Callbacks for global triggers
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: "" }));
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        {/* Navigation Bar */}
        <Navbar theme={theme} onThemeToggle={toggleTheme} />

        {/* Primary Page Router */}
        <Routes>
          <Route path="/" element={<Home onShowToast={showToast} />} />
          <Route path="/bookmarks" element={<Bookmarks onShowToast={showToast} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Action Notifications */}
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
