import { useState, useEffect } from 'react'
import { adminAPI } from '../api'

function FacultyForm({ faculty, onClose, onSave }) {
  const designationOptions = [
    'Assistant Professor',
    'Associate Professor', 
    'Professor',
    'Head of Department',
    'Lab Attendant',
    'Research Scholar',
    'Visiting Professor',
    'Emeritus Professor',
    'Lecturer',
    'Senior Lecturer'
  ]

  const departmentOptions = [
    'Computer Science',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Electronics and Communication',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Management Studies',
    'Humanities'
  ]

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    office_location: '',
    email: '',
    linkedin_url: '',
    google_scholar_url: ''
  })
  
  const [scrapedData, setScrapedData] = useState(null)
  const [scraping, setScraping] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || '',
        designation: faculty.designation || '',
        department: faculty.department || '',
        office_location: faculty.office_location || '',
        email: faculty.email || '',
        linkedin_url: faculty.linkedin_url || '',
        google_scholar_url: faculty.google_scholar_url || ''
      })
      setScrapedData({
        profile_picture_url: faculty.profile_picture_url,
        headline: faculty.headline,
        experience: faculty.experience || [],
        certifications: faculty.certifications || [],
        projects: faculty.projects || [],
        publications: faculty.publications || []
      })
    }
  }, [faculty])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleScrape = async () => {
    setScraping(true)
    try {
      const response = await adminAPI.scrapePreview(
        formData.linkedin_url,
        formData.google_scholar_url
      )
      setScrapedData(response.data)
    } catch (error) {
      console.error('Scraping failed:', error)
      alert('Scraping failed. Please check the URLs and try again.')
    } finally {
      setScraping(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        ...(scrapedData || {})
      }

      if (faculty) {
        await adminAPI.updateFaculty(faculty.id, payload)
      } else {
        await adminAPI.createFaculty(payload)
      }

      onSave()
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save faculty')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{faculty ? 'Edit Faculty' : 'Add Faculty'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departmentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Office Location</label>
            <input
              type="text"
              name="office_location"
              value={formData.office_location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Google Scholar URL</label>
            <input
              type="url"
              name="google_scholar_url"
              value={formData.google_scholar_url}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            onClick={handleScrape}
            className="btn btn-secondary"
            disabled={scraping || (!formData.linkedin_url && !formData.google_scholar_url)}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {scraping ? 'Scraping...' : 'Scrape Data from URLs'}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowManualEntry(!showManualEntry)
              if (!scrapedData) {
                setScrapedData({
                  profile_picture_url: '',
                  headline: '',
                  experience: [],
                  certifications: [],
                  projects: [],
                  publications: []
                })
              }
            }}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {showManualEntry ? 'Hide Manual Entry' : 'Add Manual Data Entry'}
          </button>

          {showManualEntry && (
            <div style={{ background: '#f0f8ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Manual Data Entry</h3>
              
              <div className="form-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  value={scrapedData?.profile_picture_url || ''}
                  onChange={(e) => setScrapedData({...scrapedData, profile_picture_url: e.target.value})}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <div className="form-group">
                <label>Headline</label>
                <input
                  type="text"
                  value={scrapedData?.headline || ''}
                  onChange={(e) => setScrapedData({...scrapedData, headline: e.target.value})}
                  placeholder="e.g., Professor of Computer Science | AI Researcher"
                />
              </div>

              <div className="form-group">
                <label>Experience</label>
                {scrapedData?.experience?.map((exp, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...scrapedData.experience]
                        newExp[idx].position = e.target.value
                        setScrapedData({...scrapedData, experience: newExp})
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...scrapedData.experience]
                        newExp[idx].company = e.target.value
                        setScrapedData({...scrapedData, experience: newExp})
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={exp.duration || ''}
                      onChange={(e) => {
                        const newExp = [...scrapedData.experience]
                        newExp[idx].duration = e.target.value
                        setScrapedData({...scrapedData, experience: newExp})
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newExp = scrapedData.experience.filter((_, i) => i !== idx)
                        setScrapedData({...scrapedData, experience: newExp})
                      }}
                      style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newExp = [...(scrapedData?.experience || []), { position: '', company: '', duration: '' }]
                    setScrapedData({...scrapedData, experience: newExp})
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px' }}
                >
                  + Add Experience
                </button>
              </div>

              <div className="form-group">
                <label>Projects</label>
                {scrapedData?.projects?.map((proj, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const newProj = [...scrapedData.projects]
                        newProj[idx].title = e.target.value
                        setScrapedData({...scrapedData, projects: newProj})
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={proj.description || ''}
                      onChange={(e) => {
                        const newProj = [...scrapedData.projects]
                        newProj[idx].description = e.target.value
                        setScrapedData({...scrapedData, projects: newProj})
                      }}
                      style={{ flex: 3 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newProj = scrapedData.projects.filter((_, i) => i !== idx)
                        setScrapedData({...scrapedData, projects: newProj})
                      }}
                      style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newProj = [...(scrapedData?.projects || []), { title: '', description: '' }]
                    setScrapedData({...scrapedData, projects: newProj})
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px' }}
                >
                  + Add Project
                </button>
              </div>

              <div className="form-group">
                <label>Certifications</label>
                {scrapedData?.certifications?.map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => {
                        const newCert = [...scrapedData.certifications]
                        newCert[idx].name = e.target.value
                        setScrapedData({...scrapedData, certifications: newCert})
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="Issuer (optional)"
                      value={cert.issuer || ''}
                      onChange={(e) => {
                        const newCert = [...scrapedData.certifications]
                        newCert[idx].issuer = e.target.value
                        setScrapedData({...scrapedData, certifications: newCert})
                      }}
                      style={{ flex: 2 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCert = scrapedData.certifications.filter((_, i) => i !== idx)
                        setScrapedData({...scrapedData, certifications: newCert})
                      }}
                      style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newCert = [...(scrapedData?.certifications || []), { name: '', issuer: '' }]
                    setScrapedData({...scrapedData, certifications: newCert})
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '8px' }}
                >
                  + Add Certification
                </button>
              </div>
            </div>
          )}

          {scrapedData && scrapedData.publications && scrapedData.publications.length > 0 && (
            <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '12px' }}>Scraped Data Preview</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                Note: LinkedIn requires authentication, so most data may not be available. You can manually add details below.
              </p>
              <p><strong>Headline:</strong> {scrapedData.headline || 'Not available'}</p>
              <p><strong>Experience:</strong> {scrapedData.experience?.length || 0} items</p>
              <p><strong>Publications:</strong> {scrapedData.publications?.length || 0} items</p>
              <p><strong>Projects:</strong> {scrapedData.projects?.length || 0} items</p>
              <p><strong>Certifications:</strong> {scrapedData.certifications?.length || 0} items</p>
              
              {scrapedData.publications && scrapedData.publications.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <strong>Publications:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {scrapedData.publications.map((pub, idx) => (
                      <li key={idx} style={{ fontSize: '13px', marginBottom: '4px' }}>
                        {pub.title} {pub.year && `(${pub.year})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FacultyForm
