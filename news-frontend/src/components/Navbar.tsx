import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Theme } from "../hooks/useDarkMode";

interface NavbarProps {
  theme: Theme;
  onThemeToggle: () => void;
}

/**
 * Navbar component for primary page navigation, responsive links drawer,
 * bookmark count display, and light/dark theme toggles.
 * 
 * @param props
 * @param props.theme - The current active theme ("light" | "dark")
 * @param props.onThemeToggle - Handler function to toggle between light/dark themes
 */
export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [bookmarksCount, setBookmarksCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("news_bookmarks");
      return saved ? JSON.parse(saved).length : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem("news_bookmarks");
        setBookmarksCount(saved ? JSON.parse(saved).length : 0);
      } catch (e) {
        setBookmarksCount(0);
      }
    };

    window.addEventListener("bookmarksChanged", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("bookmarksChanged", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand" onClick={closeMenu}>
        <span>📰</span> GNews Reader
      </NavLink>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink 
          to="/bookmarks" 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={closeMenu}
        >
          Saved Articles
          {bookmarksCount > 0 && (
            <span className="badge" aria-label={`${bookmarksCount} saved articles`}>
              {bookmarksCount}
            </span>
          )}
        </NavLink>
      </div>

      <div className="navbar-actions">
        <button 
          className="theme-toggle-btn" 
          onClick={onThemeToggle}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div 
          className="hamburger" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          &#9776;
        </div>
      </div>
    </nav>
  );
}
