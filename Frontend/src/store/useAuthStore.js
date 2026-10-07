import { create } from 'zustand'

const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('nearbuy_auth')
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to parse auth from localStorage', e)
  }
  return { user: null, role: null, isAuthenticated: false }
}

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  login: (userData, role) => {
    const newState = {
      user: userData || { name: 'Demo User', email: `${role}@nearbuy.local` },
      role: role,
      isAuthenticated: true,
    }
    try {
      localStorage.setItem('nearbuy_auth', JSON.stringify(newState))
    } catch (e) {
      console.error('Failed to save auth to localStorage', e)
    }
    set(newState)
  },

  logout: () => {
    const newState = { user: null, role: null, isAuthenticated: false }
    try {
      localStorage.removeItem('nearbuy_auth')
    } catch (e) {
      console.error('Failed to clear auth from localStorage', e)
    }
    set(newState)
  },
}))
