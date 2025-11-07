import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { facultyAPI } from '../api'
import Header from '../components/Header'

function FacultyProfile() {
  const { id } = useParams()
  const [faculty, setFaculty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFaculty()
  }, [id])

  const loadFaculty = async () => {
    try {
      const response = await facultyAPI.getById(id)
      setFaculty(response.data)
    } catch (error) {
      console.error('Error loading faculty:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!faculty) {
    return <div className="loading">Faculty not found</div>
  }

  return (
    <div>
      <Header />
      
      <div className="profile-container">
        <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
          ← Back to all faculty
        </Link>

        <div className="profile-header">
          {faculty.profile_picture_url && (
            <img
              src={faculty.profile_picture_url}
              alt={faculty.name}
              className="profile-image"
            />
          )}
          <div className="profile-info">
            <h1>{faculty.name}</h1>
            <p><strong>{faculty.title}</strong></p>
            <p>{faculty.department}</p>
            {faculty.office_location && <p>📍 {faculty.office_location}</p>}
            {faculty.email && <p>📧 {faculty.email}</p>}
            {faculty.headline && <p style={{ marginTop: '12px', fontStyle: 'italic' }}>{faculty.headline}</p>}
          </div>
        </div>

        {faculty.experience && faculty.experience.length > 0 && (
          <div className="section">
            <h2>Experience</h2>
            {faculty.experience.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.position}</h3>
                <p>{exp.company}</p>
                {exp.duration && <p>{exp.duration}</p>}
              </div>
            ))}
          </div>
        )}

        {faculty.publications && faculty.publications.length > 0 && (
          <div className="section">
            <h2>Recent Publications</h2>
            {faculty.publications.map((pub, index) => (
              <div key={index} className="item">
                <h3>{pub.title}</h3>
                {pub.authors && <p>{pub.authors}</p>}
                {pub.year && <p>{pub.year}</p>}
              </div>
            ))}
          </div>
        )}

        {faculty.projects && faculty.projects.length > 0 && (
          <div className="section">
            <h2>Projects</h2>
            {faculty.projects.map((project, index) => (
              <div key={index} className="item">
                <h3>{project.title}</h3>
                {project.description && <p>{project.description}</p>}
              </div>
            ))}
          </div>
        )}

        {faculty.certifications && faculty.certifications.length > 0 && (
          <div className="section">
            <h2>Certifications</h2>
            {faculty.certifications.map((cert, index) => (
              <div key={index} className="item">
                <h3>{cert.name}</h3>
                {cert.issuer && <p>{cert.issuer}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          {faculty.linkedin_url && (
            <a
              href={faculty.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: '20px' }}
            >
              LinkedIn Profile
            </a>
          )}
          {faculty.google_scholar_url && (
            <a
              href={faculty.google_scholar_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Scholar
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default FacultyProfile
