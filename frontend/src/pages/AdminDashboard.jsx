import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { facultyAPI, adminAPI } from '../api'
import Header from '../components/Header'
import FacultyForm from '../components/FacultyForm'
import CSVImport from '../components/CSVImport'

function AdminDashboard() {
  const [faculty, setFaculty] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    try {
      const response = await facultyAPI.getAll()
      setFaculty(response.data)
    } catch (error) {
      console.error('Error loading faculty:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const handleAdd = () => {
    setEditingFaculty(null)
    setShowModal(true)
  }

  const handleEdit = (member) => {
    setEditingFaculty(member)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) {
      return
    }

    try {
      await adminAPI.deleteFaculty(id)
      loadFaculty()
    } catch (error) {
      console.error('Error deleting faculty:', error)
      alert('Failed to delete faculty')
    }
  }

  const handleSave = async () => {
    setShowModal(false)
    loadFaculty()
  }

  return (
    <div>
      <Header />
      
      <div className="container">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <div>
            <button onClick={handleAdd} className="btn btn-primary" style={{ marginRight: '12px' }}>
              Add Faculty
            </button>
            <button onClick={() => setShowCSVImport(true)} className="btn btn-primary" style={{ marginRight: '12px' }}>
              Import CSV
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        <div className="faculty-list">
          {faculty.map((member) => (
            <div key={member.id} className="faculty-list-item">
              <div>
                <h3>{member.name}</h3>
                <p>{member.title} - {member.department}</p>
              </div>
              <div className="faculty-list-item-actions">
                <button onClick={() => handleEdit(member)} className="btn btn-secondary">
                  Edit
                </button>
                <button onClick={() => handleDelete(member.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {faculty.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666' }}>
              No faculty members yet. Click "Add Faculty" to get started.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <FacultyForm
          faculty={editingFaculty}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showCSVImport && (
        <CSVImport
          onClose={() => setShowCSVImport(false)}
          onSuccess={() => {
            setShowCSVImport(false)
            loadFaculty()
          }}
        />
      )}
    </div>
  )
}

export default AdminDashboard
