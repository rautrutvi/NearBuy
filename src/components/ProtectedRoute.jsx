import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to respective dashboard based on actual role
    if (role === 'buyer') return <Navigate to="/buyer" replace />
    if (role === 'vendor') return <Navigate to="/vendor" replace />
    if (role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
