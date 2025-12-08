function Register() {
  return (
    <section id="register" className="auth-section">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Mới tham gia?</p>
          <h2>Tạo tài khoản Hành trình Tiếng Việt</h2>
          <p className="section-lede">
            Chọn hành trình—du lịch, nguồn cội hay luyện thi—và bắt đầu gom cánh hoa.
          </p>
        </div>
        <form className="auth-form">
          <label>
            <span>Họ và tên</span>
            <input type="text" placeholder="Nguyen Van A" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Mật khẩu</span>
            <input type="password" placeholder="Tối thiểu 8 ký tự" required />
          </label>
          <div className="auth-actions">
            <button className="cta solid" type="submit">
              Tạo tài khoản
            </button>
            <button className="cta ghost" type="button">
              Đăng ký bằng Google
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Register

