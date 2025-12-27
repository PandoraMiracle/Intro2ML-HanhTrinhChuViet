import type { Feature } from '../content'

type Props = {
  items: Feature[]
}

function Features({ items }: Props) {
  return (
    <section id="features" className="section">
      <div className="section-head">
        <p className="eyebrow">Thiết kế để bạn luôn có động lực</p>
        <h2>Mọi thứ đều như một trò chơi nhẹ nhàng</h2>
        <p className="section-lede">
          Dành cho người học tiếng Việt yêu hình ảnh, nhịp điệu và chiến thắng nhanh. Nhận
          cánh hoa, vương miện và XP khi bạn đi qua từng bài.
        </p>
      </div>
      <div className="grid">
        {items.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.copy}</p>
            <button className="text-link">Xem mẫu nhiệm vụ →</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features

