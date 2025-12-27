import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const location = useLocation();
  const isLearningPage = location.pathname === "/learn";

  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem("totalXP");
    return saved ? Number(saved) : 0;
  });

  // Update XP when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("totalXP");
      setTotalXP(saved ? Number(saved) : 0);
    };

    // Listen for custom event
    window.addEventListener("xpUpdated", handleStorageChange);

    // Also check periodically
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("xpUpdated", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="top-nav">
      <Link className="brand" to="/">
        <span className="brand-mark">HT</span>
        <div className="brand-copy">
          <p className="brand-name">Vietnamese Journey</p>
        </div>
      </Link>
      <div className="nav-actions">
        {isLearningPage && (
          <div className="xp-display">
            <span className="xp-icon">⭐</span>
            <span className="xp-value">{totalXP}</span>
            <span className="xp-label">XP</span>
          </div>
        )}
        {isLearningPage && (
          <div className="streak-display">
            <span className="streak-icon">🔥</span>
            <span className="streak-value">7</span>
          </div>
        )}
        <Link className="ghost-link" to="/learn">
          Learn
        </Link>
        <Link className="ghost-link" to="/game">
          Practice
        </Link>
        {localStorage.getItem("token") ? (
          <button
            className="cta ghost"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Log Out
          </button>
        ) : (
          <>
            <Link className="ghost-link" to="/login">
              Log In
            </Link>
            <Link className="ghost-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
