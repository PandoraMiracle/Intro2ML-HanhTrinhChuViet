type Props = {
  steps: string[]
}

function Concept({ steps }: Props) {
  return (
    <section id="concept" className="concept">
      <div className="concept-card">
        <div className="concept-badge">Key Concept</div>
        <h2>Phong cách Bloomboard</h2>
        <p>
          Xanh lá mềm, vàng bơ, cánh mai và cánh đào gợi buổi sáng thôn quê Việt Nam. Bảng
          màu dẫn dắt toàn bộ nền tảng—nền chuyển sắc, token phần thưởng, minh họa đều mang
          năng lượng nở hoa này.
        </p>
        <ul>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
      <div className="concept-visual">
        <div className="motif motif-1" />
        <div className="motif motif-2" />
        <div className="motif motif-3" />
        <div className="concept-text">
          <p className="eyebrow">Màu chủ đạo</p>
          <p className="color-chip chip-fern">Fern</p>
          <p className="color-chip chip-mint">Mint bloom</p>
          <p className="color-chip chip-butter">Butter cream</p>
          <p className="color-chip chip-peach">Apricot</p>
          <p className="color-chip chip-lotus">Lotus pink</p>
        </div>
      </div>
    </section>
  )
}

export default Concept

