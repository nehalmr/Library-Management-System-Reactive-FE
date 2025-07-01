"use client"

import { useState } from "react"
import { apiService } from "../services/apiService"

const Notifications = ({ notifications, members, setNotifications }) => {
  const [loading, setLoading] = useState(false)
  const [newNotification, setNewNotification] = useState({
    memberId: "",
    message: "",
    type: "CUSTOM",
    subject: "",
  })

  const handleSendNotification = async () => {
    if (!newNotification.memberId || !newNotification.message) {
      alert("Please select a member and enter a message")
      return
    }

    setLoading(true)
    try {
      const notificationData = {
        ...newNotification,
        memberId: Number.parseInt(newNotification.memberId),
      }

      const createdNotification = await apiService.createNotification(notificationData)
      setNotifications([createdNotification, ...notifications])

      // Reset form
      setNewNotification({
        memberId: "",
        message: "",
        type: "CUSTOM",
        subject: "",
      })
    } catch (error) {
      alert("Failed to send notification: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown Member"
  }

  const getMemberEmail = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.email : "Unknown Email"
  }

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "DUE_REMINDER":
        return "bg-blue-100 text-blue-800"
      case "OVERDUE_ALERT":
        return "bg-red-100 text-red-800"
      case "FINE_NOTICE":
        return "bg-yellow-100 text-yellow-800"
      case "WELCOME":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications & Alerts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Send Notification Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-1">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Send New Notification</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newNotification.memberId}
                  onChange={(e) => setNewNotification({ ...newNotification, memberId: e.target.value })}
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notification Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                >
                  <option value="CUSTOM">Custom Message</option>
                  <option value="DUE_REMINDER">Due Date Reminder</option>
                  <option value="OVERDUE_ALERT">Overdue Alert</option>
                  <option value="FINE_NOTICE">Fine Notification</option>
                  <option value="WELCOME">Welcome Message</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newNotification.subject}
                  onChange={(e) => setNewNotification({ ...newNotification, subject: e.target.value })}
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  rows="4"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Enter notification message..."
                ></textarea>
              </div>

              <button
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleSendNotification}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </div>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Notification History</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{getMemberName(notification.memberId)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getNotificationTypeColor(notification.type)}`}
                        >
                          {notification.type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{getMemberEmail(notification.memberId)}</p>
                      {notification.subject && (
                        <p className="font-medium text-sm mb-1">Subject: {notification.subject}</p>
                      )}
                      <p className="text-sm">{notification.message}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{notification.createdAt}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          notification.status === "SENT"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Statistics */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h2 className="text-xl font-semibold mb-4">Notification Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.status === "SENT").length}
              </p>
              <p className="text-sm text-gray-600">Sent Successfully</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter((n) => n.status === "PENDING").length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter((n) => n.status === "FAILED").length}
              </p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
