const API_BASE_URL = "http://localhost:8080" // API Gateway URL
const API_VERSION = "/api/v1" // Add version if your backend uses it

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log(`Making request to: ${url}`) // For debugging
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Handle empty responses (like DELETE operations)
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      } else {
        return {} // Return empty object for non-JSON responses
      }
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Book Service APIs (routed through API Gateway)
  async getBooks() {
    return this.request("/books")
  }

  async getBook(id) {
    return this.request(`/books/${id}`)
  }

  async searchBooks(searchTerm) {
    return this.request(`/books/search?q=${encodeURIComponent(searchTerm)}`)
  }

  async createBook(bookData) {
    return this.request("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    })
  }

  async updateBook(id, bookData) {
    return this.request(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    })
  }

  async deleteBook(id) {
    return this.request(`/books/${id}`, {
      method: "DELETE",
    })
  }

  // Member Service APIs
  async getMembers() {
    return this.request("/members")
  }

  async getMember(id) {
    return this.request(`/members/${id}`)
  }

  async createMember(memberData) {
    return this.request("/members", {
      method: "POST",
      body: JSON.stringify(memberData),
    })
  }

  async updateMember(id, memberData) {
    return this.request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    })
  }

  async updateMemberStatus(id, status) {
    return this.request(`/members/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  // Transaction Service APIs
  async getTransactions() {
    return this.request("/transactions")
  }

  async getMemberTransactions(memberId) {
    return this.request(`/transactions/member/${memberId}`)
  }

  async borrowBook(borrowData) {
    return this.request("/transactions/borrow", {
      method: "POST",
      body: JSON.stringify(borrowData),
    })
  }

  async returnBook(transactionId) {
    return this.request(`/transactions/${transactionId}/return`, {
      method: "PUT",
    })
  }

  async getOverdueTransactions() {
    return this.request("/transactions/overdue")
  }

  // Fine Service APIs
  async getFines() {
    return this.request("/fines")
  }

  async getMemberFines(memberId) {
    return this.request(`/fines/member/${memberId}`)
  }

  async createFine(fineData) {
    return this.request("/fines", {
      method: "POST",
      body: JSON.stringify(fineData),
    })
  }

  async payFine(fineId) {
    return this.request(`/fines/${fineId}/pay`, {
      method: "PUT",
    })
  }

  // Notification Service APIs
  async getNotifications() {
    return this.request("/notifications")
  }

  async getMemberNotifications(memberId) {
    return this.request(`/notifications/member/${memberId}`)
  }

  async createNotification(notificationData) {
    return this.request("/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    })
  }

  async sendDueReminders() {
    return this.request("/notifications/due-reminders", {
      method: "POST",
    })
  }

  async sendOverdueAlerts() {
    return this.request("/notifications/overdue-alerts", {
      method: "POST",
    })
  }

  // Health check for all services
  async checkServiceHealth() {
    try {
      const services = ["books", "members", "transactions", "fines", "notifications"]
      const healthChecks = await Promise.allSettled(services.map((service) => this.request(`/${service}/health`)))

      return services.reduce((acc, service, index) => {
        acc[service] = healthChecks[index].status === "fulfilled" ? "UP" : "DOWN"
        return acc
      }, {})
    } catch (error) {
      console.error("Health check failed:", error)
      return {}
    }
  }
}

export const apiService = new ApiService()
