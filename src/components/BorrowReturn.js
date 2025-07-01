"use client"

import { useState } from "react"
import { apiService } from "../services/apiService"

const BorrowReturn = ({ books, members, transactions, setTransactions, setBooks }) => {
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")
  const [actionType, setActionType] = useState("borrow")
  const [loading, setLoading] = useState(false)

  const calculateDueDate = (date) => {
    const borrowDate = new Date(date)
    borrowDate.setDate(borrowDate.getDate() + 30) // 30 days borrowing period
    return borrowDate.toISOString().split("T")[0]
  }

  const handleBorrowDateChange = (date) => {
    setBorrowDate(date)
    setDueDate(calculateDueDate(date))
  }

  const handleBorrowBook = async () => {
    if (!selectedBook || !selectedMember || !borrowDate) {
      alert("Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const borrowData = {
        bookId: Number.parseInt(selectedBook),
        memberId: Number.parseInt(selectedMember),
        borrowDate: borrowDate,
        dueDate: dueDate || calculateDueDate(borrowDate),
      }

      const transaction = await apiService.borrowBook(borrowData)
      setTransactions([...transactions, transaction])

      // Update book available copies
      setBooks(
        books.map((book) =>
          book.id === Number.parseInt(selectedBook) ? { ...book, availableCopies: book.availableCopies - 1 } : book,
        ),
      )

      // Reset form
      setSelectedBook("")
      setSelectedMember("")
      setBorrowDate(new Date().toISOString().split("T")[0])
      setDueDate("")
    } catch (error) {
      alert("Failed to borrow book: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReturnBook = async (transactionId) => {
    setLoading(true)
    try {
      await apiService.returnBook(transactionId)

      // Update transaction status
      setTransactions(
        transactions.map((t) =>
          t.id === transactionId ? { ...t, status: "RETURNED", returnDate: new Date().toISOString().split("T")[0] } : t,
        ),
      )

      // Update book available copies
      const transaction = transactions.find((t) => t.id === transactionId)
      if (transaction) {
        setBooks(
          books.map((book) =>
            book.id === transaction.bookId ? { ...book, availableCopies: book.availableCopies + 1 } : book,
          ),
        )
      }
    } catch (error) {
      alert("Failed to return book: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId)
    return book ? book.title : "Unknown Book"
  }

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown Member"
  }

  const availableBooks = books.filter((book) => book.availableCopies > 0)
  const activeMembers = members.filter((member) => member.membershipStatus === "ACTIVE")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Book Borrowing & Returning</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Borrow Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Borrow Book</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Book *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                >
                  <option value="">Select a book</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} ({book.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Select Member *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select a member</option>
                  {activeMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Borrow Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={borrowDate}
                  onChange={(e) => handleBorrowDateChange(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={handleBorrowBook}
              disabled={loading}
            >
              {loading ? "Processing..." : "Borrow Book"}
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{getBookTitle(transaction.bookId)}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === "BORROWED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Member: {getMemberName(transaction.memberId)}</p>
                  <p className="text-sm text-gray-600">Borrowed: {transaction.borrowDate}</p>
                  {transaction.status === "BORROWED" && (
                    <p className="text-sm text-gray-600">Due: {transaction.dueDate}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-5">
          <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Book</th>
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Borrow Date</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Return Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{getBookTitle(transaction.bookId)}</td>
                    <td className="py-3 px-4">{getMemberName(transaction.memberId)}</td>
                    <td className="py-3 px-4">{transaction.borrowDate}</td>
                    <td className="py-3 px-4">{transaction.dueDate}</td>
                    <td className="py-3 px-4">{transaction.returnDate || "-"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "BORROWED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {transaction.status === "BORROWED" && (
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          onClick={() => handleReturnBook(transaction.id)}
                          disabled={loading}
                        >
                          Return
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

export default BorrowReturn
