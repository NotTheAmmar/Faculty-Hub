import { useState } from 'react'
import { adminAPI } from '../api'

function CSVImport({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      previewFile(selectedFile)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length > 1) {
        const headers = lines[0].split(',')
        const dataRows = lines.slice(1, 6).map(line => line.split(','))
        setPreview({ headers, dataRows, totalRows: lines.length - 1 })
      }
    }
    reader.readAsText(file)
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const facultyList = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const faculty = {}

      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        switch(header.toLowerCase()) {
          case 'name':
            faculty.name = value
            break
          case 'title':
            faculty.title = value
            break
          case 'department':
            faculty.department = value
            break
          case 'office_location':
          case 'office':
            faculty.office_location = value
            break
          case 'email':
            faculty.email = value
            break
          case 'linkedin_url':
          case 'linkedin':
            faculty.linkedin_url = value
            break
          case 'google_scholar_url':
          case 'scholar_url':
          case 'scholar':
            faculty.google_scholar_url = value
            break
          case 'headline':
            faculty.headline = value
            break
          case 'profile_picture_url':
          case 'picture_url':
          case 'photo_url':
            faculty.profile_picture_url = value
            break
        }
      })

      if (faculty.name) {
        faculty.experience = []
        faculty.certifications = []
        faculty.projects = []
        faculty.publications = []
        facultyList.push(faculty)
      }
    }

    return facultyList
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const text = e.target.result
          const facultyList = parseCSV(text)

          let successCount = 0
          let failCount = 0

          for (const faculty of facultyList) {
            try {
              await adminAPI.createFaculty(faculty)
              successCount++
            } catch (err) {
              console.error(`Failed to create faculty ${faculty.name}:`, err)
              failCount++
            }
          }

          setUploading(false)
          alert(`Import complete!\nSuccessful: ${successCount}\nFailed: ${failCount}`)
          onSuccess()
        } catch (err) {
          setUploading(false)
          setError(err.message || 'Failed to parse CSV file')
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setUploading(false)
      setError(err.message || 'Failed to upload file')
    }
  }

  const downloadTemplate = () => {
    const template = `name,title,department,office_location,email,linkedin_url,google_scholar_url,headline
Dr. John Doe,Professor,Computer Science,Building A Room 305,john.doe@university.edu,https://linkedin.com/in/johndoe,https://scholar.google.com/citations?user=ABC123,AI and Machine Learning Researcher
Dr. Jane Smith,Associate Professor,Electrical Engineering,Building B Room 201,jane.smith@university.edu,https://linkedin.com/in/janesmith,https://scholar.google.com/citations?user=XYZ456,Power Systems and Renewable Energy Expert`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'faculty_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Import Faculty from CSV</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            Upload a CSV file to import multiple faculty members at once.
          </p>
          <button
            type="button"
            onClick={downloadTemplate}
            className="btn btn-secondary"
            style={{ marginBottom: '16px' }}
          >
            Download CSV Template
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            padding: '12px', 
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#c00'
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Select CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {preview && (
          <div style={{ 
            background: '#f9f9f9', 
            padding: '16px', 
            borderRadius: '6px',
            marginBottom: '20px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>
              Preview ({preview.totalRows} rows)
            </h3>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {preview.headers.map((header, idx) => (
                    <th key={idx} style={{ 
                      textAlign: 'left', 
                      padding: '8px',
                      borderBottom: '2px solid #ddd',
                      background: '#f0f0f0'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.dataRows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} style={{ 
                        padding: '8px',
                        borderBottom: '1px solid #eee'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.totalRows > 5 && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                ... and {preview.totalRows - 5} more rows
              </p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={uploading || !file}
            style={{ flex: 1 }}
          >
            {uploading ? 'Importing...' : 'Import Faculty'}
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={uploading}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CSVImport
