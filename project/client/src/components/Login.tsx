import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!resp.ok) {
        const data = await resp.json()
        throw new Error(data.message || 'Đăng nhập thất bại')
      }

      const data = await resp.json()
      // Lưu token và user info vào localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Redirect đến trang game
      navigate('/game')
    } catch (err) {
      setError((err as Error).message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="login" className="auth-section">
      <div className="auth-card">
        <div>
          <p className="eyebrow">Chào mừng trở lại</p>
          <h2>Đăng nhập để giữ chuỗi ngày</h2>
          <p className="section-lede">Tiếp tục năng lượng nở hoa, học tiếp ngay.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              padding: '12px', 
              background: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: 8, 
              color: '#c33',
              marginBottom: '12px'
            }}>
              {error}
            </div>
          )}
          <label>
            <span>Email</span>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </label>
          <label>
            <span>Mật khẩu</span>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </label>
          <div className="auth-actions">
            <button className="cta solid" type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <button className="text-link" type="button">
              Quên mật khẩu?
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Login

