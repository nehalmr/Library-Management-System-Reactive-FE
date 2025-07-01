"use client"

const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <li>
      <button
        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-white/10 ${
          active ? "bg-indigo-600/80" : ""
        }`}
        onClick={onClick}
      >
        <i className={`${icon} mr-3`}></i>
        <span>{label}</span>
      </button>
    </li>
  )
}

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const handleNavClick = (tab) => {
    setActiveTab(tab)
    setIsSidebarOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <aside
      className={`bg-gray-800 text-white w-64 fixed md:relative h-full md:h-auto z-10 transform md:transform-none transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Navigation</h2>
        <nav>
          <ul className="space-y-2">
            <NavItem
              icon="fas fa-home"
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => handleNavClick("dashboard")}
            />
            <NavItem
              icon="fas fa-book"
              label="Book Management"
              active={activeTab === "books"}
              onClick={() => handleNavClick("books")}
            />
            <NavItem
              icon="fas fa-users"
              label="Member Management"
              active={activeTab === "members"}
              onClick={() => handleNavClick("members")}
            />
            <NavItem
              icon="fas fa-exchange-alt"
              label="Borrow/Return"
              active={activeTab === "borrow"}
              onClick={() => handleNavClick("borrow")}
            />
            <NavItem
              icon="fas fa-money-bill-wave"
              label="Overdue & Fines"
              active={activeTab === "fines"}
              onClick={() => handleNavClick("fines")}
            />
            <NavItem
              icon="fas fa-bell"
              label="Notifications"
              active={activeTab === "notifications"}
              onClick={() => handleNavClick("notifications")}
            />
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
