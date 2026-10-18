import { axiosClient } from './axiosClient'

export const authService = {
  // Real login via Spring Boot JWT endpoint
  async login(email, password) {
    try {
      const response = await axiosClient.post('/auth/login', { email, password })
      return response.data // { token, user: { id, name, email, role, phone, active } }
    } catch (error) {
      // If server error or offline, throw so caller can catch and decide fallback
      throw error
    }
  },

  // Signup endpoint
  async signup({ name, email, password, role, phone }) {
    try {
      const response = await axiosClient.post('/auth/signup', {
        name,
        email,
        password,
        role: role.toUpperCase(), // CUSTOMER, SHOPKEEPER
        phone,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Fetch current authenticated user
  async getMe() {
    try {
      const response = await axiosClient.get('/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  },
}
