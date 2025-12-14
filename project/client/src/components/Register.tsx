import { Form, useActionData } from "react-router-dom";

interface ActionData {
  error?: string;
  success?: boolean;
}

function Register() {
  const actionData = useActionData() as ActionData;

  return (
    <section id="register" className="auth-section">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Mới tham gia?</p>
          <h2>Tạo tài khoản Hành trình Tiếng Việt</h2>
          <p className="section-lede">
            Chọn hành trình—du lịch, nguồn cội hay luyện thi—và bắt đầu gom cánh
            hoa.
          </p>
        </div>
        <Form method="post" className="auth-form">
          {actionData?.error && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
              {actionData.error}
            </div>
          )}
          <label>
            <span>Họ và tên</span>
            <input
              name="fullname"
              type="text"
              placeholder="Nguyen Van A"
              required
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Mật khẩu</span>
            <input
              name="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              minLength={8}
              required
            />
          </label>
          <div className="auth-actions">
            <button className="cta solid" type="submit">
              Tạo tài khoản
            </button>
            <button className="cta ghost" type="button">
              Đăng ký bằng Google
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
}

export default Register;
