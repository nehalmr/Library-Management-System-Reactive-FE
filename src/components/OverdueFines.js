"use client"

import { useState } from "react"
import { apiService } from "../services/apiService"

const OverdueFines = ({ fines, members, setFines }) => {
  const [loading, setLoading] = useState(false)

  const handlePayFine = async (fineId) => {
    setLoading(true)
    try {
      await apiService.payFine(fineId)
      setFines(
        fines.map((fine) =>
          fine.id === fineId ? { ...fine, status: "PAID", paidDate: new Date().toISOString().split("T")[0] } : fine,
        ),
      )
    } catch (error) {
      alert("Failed to pay fine: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown Member"
  }

  const totalOutstanding = fines.filter((fine) => fine.status === "PENDING").reduce((sum, fine) => sum + fine.amount, 0)

  const totalCollected = fines.filter((fine) => fine.status === "PAID").reduce((sum, fine) => sum + fine.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overdue Books & Fines</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Fines Summary */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Fines Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Outstanding Fines</p>
                  <p className="text-sm text-gray-600">Unpaid fines across all members</p>
                </div>
                <span className="text-2xl font-bold text-red-500">${totalOutstanding.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Collected Fines</p>
                  <p className="text-sm text-gray-600">Paid fines this month</p>
                </div>
                <span className="text-2xl font-bold text-green-500">${totalCollected.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Fine Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Fines</span>
                <span className="font-bold">{fines.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Fines</span>
                <span className="font-bold text-red-500">{fines.filter((f) => f.status === "PENDING").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Paid Fines</span>
                <span className="font-bold text-green-500">{fines.filter((f) => f.status === "PAID").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Fine Amount</span>
                <span className="font-bold">
                  ${fines.length > 0 ? (fines.reduce((sum, f) => sum + f.amount, 0) / fines.length).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fines List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Fines Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Issued Date</th>
                  <th className="py-3 px-4 text-left">Paid Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{getMemberName(fine.memberId)}</td>
                    <td className="py-3 px-4">${fine.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          fine.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{fine.issuedDate}</td>
                    <td className="py-3 px-4">{fine.paidDate || "-"}</td>
                    <td className="py-3 px-4">
                      {fine.status === "PENDING" && (
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          onClick={() => handlePayFine(fine.id)}
                          disabled={loading}
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverdueFines
