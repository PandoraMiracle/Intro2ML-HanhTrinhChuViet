import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { userExpApi } from "../utils/api";

function Header() {
  const location = useLocation();
  const isLearningPage = location.pathname === "/learn";
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        return user.fullname || user.name || user.email?.split("@")[0] || "User";
      } catch {
        return saved;
      }
    }
    
    // If token exists but no user data, try to get from token or create default
    return "User";
  });

  const [showDropdown, setShowDropdown] = useState(false);

  // Load user exp and streak from API
  useEffect(() => {
    const loadUserExp = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTotalXP(0);
        setStreak(0);
        return;
      }

      try {
        const userExp = await userExpApi.get();
        setTotalXP(userExp.exp || 0);
        setStreak(userExp.streak || 0);
      } catch (err) {
        console.error("Failed to load user exp:", err);
        // Fallback to localStorage
        const saved = localStorage.getItem("totalXP");
        setTotalXP(saved ? Number(saved) : 0);
        setStreak(0);
      }
    };

    loadUserExp();

    // Listen for XP updates
    const handleStorageChange = () => {
      const saved = localStorage.getItem("totalXP");
      if (saved) {
        setTotalXP(Number(saved));
      }
      // Reload from API when xpUpdated event fires
      loadUserExp();
    };

    window.addEventListener("xpUpdated", handleStorageChange);

    // Refresh every 30 seconds
    const interval = setInterval(loadUserExp, 30000);

    return () => {
      window.removeEventListener("xpUpdated", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Update user name when token changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserName(null);
        setShowDropdown(false);
        setTotalXP(0);
        setStreak(0);
        return;
      }
      
      const userSaved = localStorage.getItem("user");
      if (userSaved) {
        try {
          const user = JSON.parse(userSaved);
          setUserName(user.fullname || user.name || user.email?.split("@")[0] || "User");
        } catch {
          setUserName(userSaved);
        }
      } else {
        setUserName("User");
      }
    };

    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowDropdown(false);
    window.location.href = "/";
  };

  const isLoggedIn = localStorage.getItem("token");

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
            <span className="streak-value">{streak}</span>
          </div>
        )}
        <Link className="ghost-link" to="/learn">
          Learn
        </Link>
        <Link className="ghost-link" to="/game">
          Practice
        </Link>
        {isLoggedIn && userName ? (
          <div className="user-profile-container" ref={dropdownRef}>
            <div 
              className="user-profile" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">{getInitials(userName)}</div>
              <span className="user-name">{userName}</span>
            </div>
            {showDropdown && (
              <div className="user-dropdown">
                <button className="dropdown-item" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link className="ghost-link" to="/login">
            Log In
          </Link>
        )}
        {!isLoggedIn && (
          <Link className="ghost-link" to="/register">
            Register
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
