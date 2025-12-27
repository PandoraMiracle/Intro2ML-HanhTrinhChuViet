<<<<<<< HEAD
import type { LeaderboardRow } from "../content";

type Props = {
  leaderboard: LeaderboardRow[];
};
=======
import type { LeaderboardRow } from '../content'

type Props = {
  leaderboard: LeaderboardRow[]
}
>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c

function Hero({ leaderboard }: Props) {
  return (
    <section className="hero">
      <div className="hero-copy">
<<<<<<< HEAD
        <p className="eyebrow">Gamified Vietnamese · Learn visually</p>
        <h1>
          Grow your Vietnamese fluency
          <span className="accent-underline"> like a blooming garden</span>
        </h1>
        <p className="lede">
          A fun platform combining missions, short stories, and rewards. For
          learners who love images and want Vietnamese to be soft, vibrant, and
          lively.
        </p>
        <div className="cta-row">
          <button className="cta solid">Start your journey</button>
          <button className="cta ghost">See 90s tour</button>
          <div className="badge">New: Spring Roadmap</div>
        </div>
        <div className="stats">
          <div className="stat">
            <p className="stat-label">Streak</p>
            <p className="stat-value">24 days</p>
          </div>
          <div className="stat">
            <p className="stat-label">Avg session</p>
            <p className="stat-value">12 min</p>
          </div>
          <div className="stat">
            <p className="stat-label">Words remembered</p>
=======
        <p className="eyebrow">Tiếng Việt gamified · Học bằng trực quan</p>
        <h1>
          Nuôi dưỡng tiếng Việt trôi chảy
          <span className="accent-underline"> như khu vườn đang nở</span>
        </h1>
        <p className="lede">
          Nền tảng vui nhộn kết hợp nhiệm vụ, truyện ngắn và phần thưởng. Dành cho người học
          thích hình ảnh, muốn tiếng Việt mềm mại, rực rỡ và sống động.
        </p>
        <div className="cta-row">
          <button className="cta solid">Bắt đầu hành trình</button>
          <button className="cta ghost">Xem tour 90s</button>
          <div className="badge">Mới: Lộ trình Xuân nở</div>
        </div>
        <div className="stats">
          <div className="stat">
            <p className="stat-label">Chuỗi ngày</p>
            <p className="stat-value">24 ngày</p>
          </div>
          <div className="stat">
            <p className="stat-label">Phiên trung bình</p>
            <p className="stat-value">12 phút</p>
          </div>
          <div className="stat">
            <p className="stat-label">Từ vựng đã nhớ</p>
>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c
            <p className="stat-value">620</p>
          </div>
        </div>
      </div>

      <div className="hero-card">
        <div className="card-header">
          <p className="card-title">Nhiệm vụ đang nở</p>
          <span className="pill success">Live</span>
        </div>
        <div className="card-body">
          <div className="progress-circle">
            <div className="progress-inner">
              <p className="progress-value">78%</p>
              <p className="progress-label">Unit 3: Cà phê</p>
            </div>
          </div>
          <div className="card-detail">
            <p className="detail-label">Thưởng hôm nay</p>
            <p className="detail-value">🌼 Huy hiệu Hoa Mai</p>
            <div className="detail-bar">
<<<<<<< HEAD
              <span style={{ width: "78%" }} />
=======
              <span style={{ width: '78%' }} />
>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c
            </div>
            <p className="detail-caption">Hoàn thành 2 bài nói để mở khóa.</p>
          </div>
        </div>
        <div className="card-footer">
          <div className="leaderboard">
            {leaderboard.map((row) => (
              <div key={row.name} className="leader-row">
                <div className="avatar">{row.name[0]}</div>
                <div className="leader-meta">
                  <p className="leader-name">{row.name}</p>
                  <p className="leader-status">{row.status}</p>
                </div>
                <p className="leader-xp">{row.xp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
<<<<<<< HEAD
  );
}

export default Hero;
=======
  )
}

export default Hero

>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c
