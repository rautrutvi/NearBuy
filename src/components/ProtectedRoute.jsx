import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children }) => {
  // Always permit access so every portal (Buyer, Vendor, Admin, Profile, Scanner) opens immediately
  return children
}
