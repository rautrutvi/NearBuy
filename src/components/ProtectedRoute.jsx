import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, login } = useAuthStore()
  const location = useLocation()

  // If not authenticated, auto-authenticate with the appropriate demo role so pages never get stuck or blocked
  if (!isAuthenticated && allowedRoles && allowedRoles.length > 0) {
    const defaultRole = allowedRoles[0]
    login({ name: `Demo ${defaultRole.toUpperCase()}`, email: `demo.${defaultRole}@nearbuy.in` }, defaultRole)
    return children
  }

  // If authenticated but visiting another role's dashboard, auto-switch role smoothly for seamless testing
  if (allowedRoles && !allowedRoles.includes(role)) {
    const targetRole = allowedRoles[0]
    login({ name: `Demo ${targetRole.toUpperCase()}`, email: `demo.${targetRole}@nearbuy.in` }, targetRole)
    return children
  }

  return children
}
