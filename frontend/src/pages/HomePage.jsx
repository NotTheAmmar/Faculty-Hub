import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { facultyAPI } from '../api'
import Header from '../components/Header'

function HomePage() {
  const [faculty, setFaculty] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    try {
      const response = await facultyAPI.getAll()
      setFaculty(response.data)
    } catch (error) {
      console.error('Error loading faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === '') {
      loadFaculty()
      return
    }

    try {
      const response = await facultyAPI.search(query)
      setFaculty(response.data)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div>
      <Header showAdminLink={true} />
      
      <div className="container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, department, research area, or keyword..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="faculty-grid">
          {faculty.map((member) => (
            <Link
              key={member.id}
              to={`/faculty/${member.id}`}
              className="faculty-card"
            >
              {member.profile_picture_url && (
                <img src={member.profile_picture_url} alt={member.name} />
              )}
              <h3>{member.name}</h3>
              <p><strong>{member.title}</strong></p>
              <p>{member.department}</p>
              {member.headline && <p style={{ marginTop: '8px', fontSize: '14px' }}>{member.headline}</p>}
            </Link>
          ))}
        </div>

        {faculty.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
            No faculty members found.
          </p>
        )}
      </div>
    </div>
  )
}

export default HomePage
