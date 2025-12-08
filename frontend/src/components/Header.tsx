import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-mark">HT</span>
        <div className="brand-copy">
          <p className="brand-name">Hành trình tiếng Việt</p>
          <p className="brand-tagline">Học tiếng Việt kiểu game</p>
        </div>
      </div>
      <div className="nav-actions">
        <Link className="ghost-link" to="/#concept">
          Khái niệm
        </Link>
        <Link className="ghost-link" to="/#features">
          Tính năng
        </Link>
        {localStorage.getItem('token') ? (
          <>
            <Link className="ghost-link" to="/game">
              Chơi game
            </Link>
            <button 
              className="cta ghost" 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/'
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-link" to="/login">
              Đăng nhập
            </Link>
            <Link className="ghost-link" to="/register">
              Đăng ký
            </Link>
            <button className="cta ghost">Thử bản demo</button>
            <button className="cta solid">Bắt đầu miễn phí</button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header

