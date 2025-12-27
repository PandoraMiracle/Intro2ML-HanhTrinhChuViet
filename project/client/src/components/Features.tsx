import type { Feature } from "../content";

type Props = {
  items: Feature[];
};

function Features({ items }: Props) {
  return (
    <section id="features" className="section">
      <div className="section-head">
        <p className="eyebrow">Designed to keep you motivated</p>
        <h2>Everything feels like a gentle game</h2>
        <p className="section-lede">
          For Vietnamese learners who love visuals, rhythm, and quick wins. Earn
          petals, crowns, and XP as you progress through each lesson.
        </p>
      </div>
      <div className="grid">
        {items.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.copy}</p>
            <button className="text-link">See sample mission →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
