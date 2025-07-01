"use client"

const Header = ({ toggleSidebar, notificationCount }) => {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <i className="fas fa-book text-2xl mr-3"></i>
          <h1 className="text-xl font-bold">Library Management System</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <i className="fas fa-bell text-xl"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full font-bold w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" className="w-8 h-8 rounded-full" />
            <span className="ml-2">Admin</span>
          </div>
        </div>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  )
}

export default Header
