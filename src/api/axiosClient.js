import axios from 'axios'

// Configured Axios client pointing to Spring Boot backend (/api/**)
export const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Attach auth token to headers if present in localStorage
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('nearbuy_auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        const token = parsed.token || parsed.user?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (e) {
      console.error('Failed to attach auth token', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)
