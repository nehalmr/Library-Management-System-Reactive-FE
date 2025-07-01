"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Dashboard from "./components/Dashboard"
import BookManagement from "./components/BookManagement"
import MemberManagement from "./components/MemberManagement"
import BorrowReturn from "./components/BorrowReturn"
import OverdueFines from "./components/OverdueFines"
import Notifications from "./components/Notifications"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import { apiService } from "./services/apiService"

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for all data
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [fines, setFines] = useState([])
  const [notifications, setNotifications] = useState([])

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [booksData, membersData, transactionsData, finesData, notificationsData] = await Promise.all([
        apiService.getBooks(),
        apiService.getMembers(),
        apiService.getTransactions(),
        apiService.getFines(),
        apiService.getNotifications(),
      ])

      setBooks(booksData)
      setMembers(membersData)
      setTransactions(transactionsData)
      setFines(finesData)
      setNotifications(notificationsData)
    } catch (err) {
      setError("Failed to load data: " + err.message)
      console.error("Error loading initial data:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard books={books} members={members} transactions={transactions} />
      case "books":
        return <BookManagement books={books} setBooks={setBooks} />
      case "members":
        return <MemberManagement members={members} setMembers={setMembers} />
      case "borrow":
        return (
          <BorrowReturn
            books={books}
            members={members}
            transactions={transactions}
            setTransactions={setTransactions}
            setBooks={setBooks}
          />
        )
      case "fines":
        return <OverdueFines fines={fines} members={members} setFines={setFines} />
      case "notifications":
        return <Notifications notifications={notifications} members={members} setNotifications={setNotifications} />
      default:
        return <Dashboard books={books} members={members} transactions={transactions} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={toggleSidebar}
        notificationCount={notifications.filter((n) => n.status === "PENDING").length}
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto">{renderContent()}</div>
        </main>
      </div>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Library Management System &copy; {new Date().getFullYear()} - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}

export default App
