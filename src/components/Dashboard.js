const Dashboard = ({ books, members, transactions }) => {
  const stats = [
    {
      title: "Total Books",
      value: books.length,
      icon: "fas fa-book",
      color: "bg-indigo-600",
    },
    {
      title: "Active Members",
      value: members.filter((m) => m.membershipStatus === "ACTIVE").length,
      icon: "fas fa-users",
      color: "bg-green-600",
    },
    {
      title: "Borrowed Books",
      value: transactions.filter((t) => t.status === "BORROWED").length,
      icon: "fas fa-exchange-alt",
      color: "bg-yellow-600",
    },
    {
      title: "Overdue Books",
      value: transactions.filter((t) => t.status === "BORROWED" && new Date(t.dueDate) < new Date()).length,
      icon: "fas fa-clock",
      color: "bg-red-500",
    },
  ]

  const getBookTitle = (bookId) => {
    const book = books.find((b) => b.id === bookId)
    return book ? book.title : "Unknown Book"
  }

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown Member"
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 flex items-center">
              <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Book</th>
                    <th className="py-2 text-left">Member</th>
                    <th className="py-2 text-left">Due Date</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{getBookTitle(transaction.bookId)}</td>
                      <td className="py-3">{getMemberName(transaction.memberId)}</td>
                      <td className="py-3">{transaction.dueDate}</td>
                      <td className="py-3">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Overdue Books</h2>
            <div className="space-y-4">
              {transactions
                .filter((t) => t.status === "BORROWED" && new Date(t.dueDate) < new Date())
                .slice(0, 3)
                .map((transaction) => {
                  const daysOverdue = Math.floor((new Date() - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{getBookTitle(transaction.bookId)}</p>
                        <p className="text-sm text-gray-600">Borrowed by: {getMemberName(transaction.memberId)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-medium">{daysOverdue} days overdue</p>
                        <p className="text-sm text-gray-600">Due: {transaction.dueDate}</p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
