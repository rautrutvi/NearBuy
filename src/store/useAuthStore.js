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

const normalizeRole = (role) => {
  if (!role) return 'buyer'
  const r = role.toLowerCase()
  if (r === 'customer' || r === 'buyer') return 'buyer'
  if (r === 'shopkeeper' || r === 'vendor') return 'vendor'
  if (r === 'admin') return 'admin'
  return r
}

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  login: (userData, role, token = null) => {
    const normalizedRole = normalizeRole(role || userData?.role)
    const userObj = {
      ...(userData || { name: 'Demo User', email: `${normalizedRole}@nearbuy.local` }),
      token: token || userData?.token,
    }
    const newState = {
      user: userObj,
      role: normalizedRole,
      token: token || userObj.token,
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
    const newState = { user: null, role: null, token: null, isAuthenticated: false }
    try {
      localStorage.removeItem('nearbuy_auth')
    } catch (e) {
      console.error('Failed to clear auth from localStorage', e)
    }
    set(newState)
  },
}))
