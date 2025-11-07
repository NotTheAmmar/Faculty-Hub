import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../api'
import Header from '../components/Header'

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await adminAPI.login(password)
      localStorage.setItem('admin_token', response.data.access_token)
      navigate('/admin/dashboard')
    } catch (error) {
      setError('Invalid password')
    }
  }

  return (
    <div>
      <Header />
      
      <div className="admin-container">
        <h2>Admin Login</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
