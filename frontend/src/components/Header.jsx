import { Link } from 'react-router-dom'

function Header({ showAdminLink = false }) {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>Faculty Hub</h1>
        </Link>
        {showAdminLink && (
          <Link to="/admin/login" style={{ color: 'white', textDecoration: 'none' }}>
            Admin
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
