import React, { useState, useEffect } from 'react'
import { usersAPI } from '../../services/api'
import { useApp } from '../../context/AppContext'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Loading from '../../components/common/Loading'
import { Users, Trash2, Edit, UserCheck, UserX } from 'lucide-react'

const ManageUsers = () => {
  const { showToast, currentUser } = useApp()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null })
  const [editModal, setEditModal] = useState({ open: false, user: null })
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await usersAPI.getAll()
      setUsers(res.data.data)
    } catch (err) {
      showToast('Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.user) return
    try {
      await usersAPI.delete(deleteModal.user.id)
      showToast(`User ${deleteModal.user.name} deleted successfully!`, 'success')
      setDeleteModal({ open: false, user: null })
      loadUsers()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error')
    }
  }

  const handleEdit = async () => {
    if (!editModal.user) return
    try {
      await usersAPI.update(editModal.user.id, formData)
      showToast('User updated successfully!', 'success')
      setEditModal({ open: false, user: null })
      setFormData({ name: '', email: '', role: '' })
      loadUsers()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error')
    }
  }

  const openEditModal = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role })
    setEditModal({ open: true, user })
  }

  if (loading) return <Loading />

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    reviewers: users.filter(u => u.role === 'reviewer').length,
    innovators: users.filter(u => u.role === 'innovator').length,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-600 mt-2">View, edit, and delete users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewers}</p>
              <p className="text-sm text-gray-600">Reviewers</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.innovators}</p>
              <p className="text-sm text-gray-600">Innovators</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card title="All Users">
        <Table
          headers={['Name', 'Email', 'Role', 'Joined', 'Actions']}
          data={users}
          emptyMessage="No users found"
          renderRow={(user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  {user.id === currentUser?.id && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">You</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'reviewer' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit user"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, user })}
                    disabled={user.id === currentUser?.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user.id === currentUser?.id ? "You cannot delete yourself" : "Delete user"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <UserX className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to delete this user?
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{deleteModal.user?.name}</span> ({deleteModal.user?.email})
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            This action cannot be undone. All data associated with this user will be permanently deleted.
          </p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setDeleteModal({ open: false, user: null })} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => {
          setEditModal({ open: false, user: null })
          setFormData({ name: '', email: '', role: '' })
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
            >
              <option value="">Select role...</option>
              <option value="admin">Admin</option>
              <option value="reviewer">Reviewer</option>
              <option value="innovator">Innovator</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setEditModal({ open: false, user: null })
                setFormData({ name: '', email: '', role: '' })
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="btn-primary"
              disabled={!formData.name || !formData.email || !formData.role}
            >
              Update User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageUsers
