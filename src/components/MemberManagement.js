"use client"

import { useState } from "react"
import { apiService } from "../services/apiService"

const MemberManagement = ({ members, setMembers }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipStatus: "ACTIVE",
  })

  const resetForm = () => {
    setNewMember({
      name: "",
      email: "",
      phone: "",
      address: "",
      membershipStatus: "ACTIVE",
    })
    setEditingMember(null)
  }

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      alert("Name and Email are required")
      return
    }

    setLoading(true)
    try {
      const createdMember = await apiService.createMember(newMember)
      setMembers([...members, createdMember])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      alert("Failed to add member: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMember = async () => {
    if (!newMember.name || !newMember.email) {
      alert("Name and Email are required")
      return
    }

    setLoading(true)
    try {
      const updatedMember = await apiService.updateMember(editingMember.id, newMember)
      setMembers(members.map((member) => (member.id === editingMember.id ? updatedMember : member)))
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      alert("Failed to update member: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (memberId, newStatus) => {
    setLoading(true)
    try {
      await apiService.updateMemberStatus(memberId, newStatus)
      setMembers(
        members.map((member) => (member.id === memberId ? { ...member, membershipStatus: newStatus } : member)),
      )
    } catch (error) {
      alert("Failed to update member status: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (member) => {
    setEditingMember(member)
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      address: member.address || "",
      membershipStatus: member.membershipStatus,
    })
    setShowAddModal(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Management</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          <i className="fas fa-plus mr-2"></i> Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">{member.phone}</td>
                  <td className="py-3 px-4">
                    <select
                      value={member.membershipStatus}
                      onChange={(e) => handleStatusChange(member.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-0 ${
                        member.membershipStatus === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                      disabled={loading}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => openEditModal(member)}
                      disabled={loading}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingMember ? "Edit Member" : "Add New Member"}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newMember.address}
                  onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newMember.membershipStatus}
                  onChange={(e) => setNewMember({ ...newMember, membershipStatus: e.target.value })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
                  onClick={editingMember ? handleEditMember : handleAddMember}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingMember ? "Update Member" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberManagement
