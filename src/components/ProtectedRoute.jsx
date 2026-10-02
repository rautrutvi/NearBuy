import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    // Save attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location, message: 'Please sign in to access this page.' }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect unauthorized role to their allowed dashboard with access denied message
    const redirectPath = role === 'buyer' ? '/buyer' : role === 'vendor' ? '/vendor' : role === 'admin' ? '/admin' : '/login'
    return (
      <Navigate
        to={redirectPath}
        state={{ accessDenied: true, message: `Access Denied: Your account role (${role}) cannot access ${location.pathname}.` }}
        replace
      />
    )
  }

  return children
}
