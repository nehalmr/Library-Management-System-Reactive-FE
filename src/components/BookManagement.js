"use client"

import { useState } from "react"
import { apiService } from "../services/apiService"

const BookManagement = ({ books, setBooks }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    yearPublished: "",
    totalCopies: "",
    availableCopies: "",
  })

  const resetForm = () => {
    setNewBook({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      yearPublished: "",
      totalCopies: "",
      availableCopies: "",
    })
    setEditingBook(null)
  }

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Title and Author are required")
      return
    }

    setLoading(true)
    try {
      const bookData = {
        ...newBook,
        yearPublished: Number.parseInt(newBook.yearPublished) || new Date().getFullYear(),
        totalCopies: Number.parseInt(newBook.totalCopies) || 1,
        availableCopies: Number.parseInt(newBook.availableCopies) || Number.parseInt(newBook.totalCopies) || 1,
      }

      const createdBook = await apiService.createBook(bookData)
      setBooks([...books, createdBook])
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      alert("Failed to add book: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Title and Author are required")
      return
    }

    setLoading(true)
    try {
      const bookData = {
        ...newBook,
        yearPublished: Number.parseInt(newBook.yearPublished) || new Date().getFullYear(),
        totalCopies: Number.parseInt(newBook.totalCopies) || 1,
        availableCopies: Number.parseInt(newBook.availableCopies) || Number.parseInt(newBook.totalCopies) || 1,
      }

      const updatedBook = await apiService.updateBook(editingBook.id, bookData)
      setBooks(books.map((book) => (book.id === editingBook.id ? updatedBook : book)))
      setShowAddModal(false)
      resetForm()
    } catch (error) {
      alert("Failed to update book: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return
    }

    setLoading(true)
    try {
      await apiService.deleteBook(id)
      setBooks(books.filter((book) => book.id !== id))
    } catch (error) {
      alert("Failed to delete book: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (book) => {
    setEditingBook(book)
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      isbn: book.isbn || "",
      yearPublished: book.yearPublished?.toString() || "",
      totalCopies: book.totalCopies?.toString() || "",
      availableCopies: book.availableCopies?.toString() || "",
    })
    setShowAddModal(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Management</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          <i className="fas fa-plus mr-2"></i> Add Book
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">ISBN</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Available/Total</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.genre}</td>
                  <td className="py-3 px-4">{book.isbn}</td>
                  <td className="py-3 px-4">{book.yearPublished}</td>
                  <td className="py-3 px-4">
                    {book.availableCopies}/{book.totalCopies}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => openEditModal(book)}
                      disabled={loading}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={loading}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingBook ? "Edit Book" : "Add New Book"}</h2>
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
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ISBN</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    value={newBook.yearPublished}
                    onChange={(e) => setNewBook({ ...newBook, yearPublished: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Copies</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Available</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    value={newBook.availableCopies}
                    onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })}
                  />
                </div>
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
                  onClick={editingBook ? handleEditBook : handleAddBook}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookManagement
