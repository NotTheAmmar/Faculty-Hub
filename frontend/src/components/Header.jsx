import { Link } from 'react-router-dom'
import mitLogo from '../mit_logo.svg'

function Header({ showAdminLink = false }) {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={mitLogo} alt="MIT Logo" style={{ height: '40px', width: '40px' }} />
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
