function HomePage() {
  return (
    <div className="homepage">
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
  );
}

export default HomePage;
