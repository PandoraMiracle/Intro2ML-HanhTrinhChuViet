import { Form, useActionData, useNavigation } from "react-router-dom";

interface ActionData {
  error?: string;
  success?: boolean;
}

function Login() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <section id="login" className="auth-section">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Chào mừng trở lại</p>
          <h2>Đăng nhập để giữ chuỗi ngày</h2>
          <p className="section-lede">
            Tiếp tục năng lượng nở hoa, học tiếp ngay.
          </p>
        </div>
        <Form method="post" className="auth-form">
          {actionData?.error && (
            <div
              style={{
                padding: "12px",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: 8,
                color: "#c33",
                marginBottom: "12px",
              }}
            >
              {actionData.error}
            </div>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Mật khẩu</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </label>
          <div className="auth-actions">
            <button className="cta solid" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <button className="text-link" type="button">
              Quên mật khẩu?
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
}

export default Login;
