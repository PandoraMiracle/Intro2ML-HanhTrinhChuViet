import { useState, useEffect } from "react";
import { userExpApi } from "../utils/api";

interface LeaderboardRow {
  rank: number;
  name: string;
  xp: string;
  level: number;
  levelName: string;
  streak: number;
}

function HomePage() {
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState("Mầm non");
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate progress percentage to next level
  const getProgressPercentage = (xp: number) => {
    const currentLevel = Math.floor(xp / 1000) + 1;
    const xpForCurrentLevel = (currentLevel - 1) * 1000;
    const xpForNextLevel = currentLevel * 1000;
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  };

  // Load user exp and leaderboard
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Load user exp if logged in
        if (token) {
          try {
            const userExp = await userExpApi.get();
            setTotalXP(userExp.exp || 0);
            setLevel(userExp.level || 1);
            setLevelName(userExp.levelName || "Mầm non");
          } catch (err) {
            console.error("Failed to load user exp:", err);
            // Fallback to localStorage
            const saved = localStorage.getItem("totalXP");
            setTotalXP(saved ? Number(saved) : 0);
          }
        } else {
          // Fallback to localStorage if not logged in
          const saved = localStorage.getItem("totalXP");
          setTotalXP(saved ? Number(saved) : 0);
        }

        // Load leaderboard (public)
        try {
          const leaderboardData = await userExpApi.getLeaderboard(10);
          setLeaderboard(leaderboardData);
        } catch (err) {
          console.error("Failed to load leaderboard:", err);
          // Fallback to static data
          setLeaderboard([
            { rank: 1, name: 'Lan Anh', xp: '12,450 XP', level: 13, levelName: 'Lớp 12', streak: 5 },
            { rank: 2, name: 'Minh Trần', xp: '10,980 XP', level: 11, levelName: 'Lớp 10', streak: 3 },
            { rank: 3, name: 'Hành trình', xp: '9,120 XP', level: 10, levelName: 'Lớp 9', streak: 7 },
          ]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for XP updates
    const handleStorageChange = () => {
      const saved = localStorage.getItem("totalXP");
      if (saved) {
        setTotalXP(Number(saved));
      }
    };

    window.addEventListener("xpUpdated", handleStorageChange);
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds

    return () => {
      window.removeEventListener("xpUpdated", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const progress = getProgressPercentage(totalXP);

  return (
    <div className="homepage">
      <div className="homepage-content">
        <section className="home-intro">
          <h1>Welcome to Vietnamese Learning Journey</h1>
          <p>
            Practice and learn Vietnamese through interactive lessons and games.
            Track your progress, improve your skills, and enjoy a simple, focused
            experience.
          </p>
        </section>
        <section className="home-actions">
          <a href="/learn" className="cta solid">
            Start Learning
          </a>
          <a href="/game" className="cta ghost">
            Practice Game
          </a>
        </section>
        <section className="home-guide">
          <h2>How to Use</h2>
          <ul>
            <li>
              Go to <b>Learn</b> to follow the curriculum and lessons.
            </li>
            <li>
              Go to <b>Practice Game</b> for extra exercises and fun challenges.
            </li>
            <li>Your progress and XP are tracked automatically.</li>
          </ul>
        </section>
      </div>
      <div className="homepage-leaderboard">
        <div className="leaderboard-card">
          <div className="xp-level-circle">
            <div
              className="xp-circle"
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            >
              <div className="xp-circle-inner">
                <p className="xp-value">{totalXP}</p>
                <p className="xp-label">XP</p>
                <p className="level-label">{levelName}</p>
              </div>
            </div>
          </div>
          <div className="leaderboard-header">
            <h2>Bảng Xếp Hạng</h2>
            <span className="pill success">Live</span>
          </div>
          <div className="leaderboard-table">
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-500)' }}>
                Đang tải...
              </div>
            ) : leaderboard.length > 0 ? (
              leaderboard.map((row) => (
                <div key={row.rank} className="leaderboard-row">
                  <div className="leaderboard-rank">{row.rank}</div>
                  <div className="leaderboard-avatar">{row.name[0]}</div>
                  <div className="leaderboard-info">
                    <p className="leaderboard-name">{row.name}</p>
                    <p className="leaderboard-status">{row.levelName}</p>
                  </div>
                  <div className="leaderboard-xp">{row.xp}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-500)' }}>
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>
      <section className="home-navigation-cards">
        <a href="/learn" className="nav-card">
          <div className="nav-card-icon">📖</div>
          <h3 className="nav-card-title">Learn</h3>
          <p className="nav-card-description">
            Go to 'Learn' to follow the curriculum and lessons.
          </p>
        </a>
        <a href="/game" className="nav-card">
          <div className="nav-card-icon">🎮</div>
          <h3 className="nav-card-title">Practice Game</h3>
          <p className="nav-card-description">
            Go to 'Practice Game' for extra exercises and fun challenges.
          </p>
        </a>
        <div className="nav-card">
          <div className="nav-card-icon">📈</div>
          <h3 className="nav-card-title">Track Progress</h3>
          <p className="nav-card-description">
            Your progress and XP are tracked automatically.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
