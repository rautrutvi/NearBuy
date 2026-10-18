import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { ShieldAlert, Lock, ArrowLeft, LogIn } from 'lucide-react'

/**
 * ProtectedRoute: Real production-grade access control guard.
 * Strictly enforces authentication, role membership, and admin ownership (rautrutvi@gmail.com).
 */
export const ProtectedRoute = ({ children, allowedRoles, requireAdminEmail = false }) => {
  const location = useLocation()
  const { user, role, isAuthenticated, logout } = useAuthStore()

  // 1. Enforce authentication
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: requireAdminEmail
            ? 'Administrator portal requires logging in with rautrutvi@gmail.com.'
            : 'Please sign in to access this portal.',
        }}
      />
    )
  }

  // 2. Strict Administrator Check: Exclusively rautrutvi@gmail.com
  if (requireAdminEmail) {
    const userEmail = (user?.email || '').trim().toLowerCase()
    const isRutviAdmin = userEmail === 'rautrutvi@gmail.com'

    if (!isRutviAdmin) {
      return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#050508] text-white">
          <div className="max-w-lg w-full rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.3)]">
            <div className="bg-[#0c0c16]/95 backdrop-blur-2xl rounded-[22px] p-8 text-center space-y-6 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase bg-rose-950 text-rose-300 border border-rose-500/30">
                  403 FORBIDDEN · STRICT ACCESS RESTRICTION
                </span>
                <h1 className="text-2xl font-extrabold font-display text-white">
                  Admin Mission Control Restricted
                </h1>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  The Nearbuy Admin Portal is strictly reserved for the platform administrator{' '}
                  <strong className="text-amber-400">rautrutvi@gmail.com</strong>.
                </p>
                <div className="bg-slate-900/90 border border-white/10 rounded-xl p-3 text-left space-y-1 font-mono text-xs">
                  <div className="text-slate-400">Current Session:</div>
                  <div className="text-white truncate">Email: <span className="text-rose-400 font-bold">{user?.email || 'N/A'}</span></div>
                  <div className="text-slate-400">Role: <span className="uppercase text-slate-300">{role || 'buyer'}</span></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/"
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </Link>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(224,82,54,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In as Rutvi
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // 3. Role-based Access Check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(role) || (role === 'admin' && user?.email?.trim().toLowerCase() === 'rautrutvi@gmail.com')
    if (!hasRole) {
      return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#050508] text-white">
          <div className="max-w-md w-full rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-500 to-primary-500 shadow-2xl">
            <div className="bg-[#0c0c16]/95 backdrop-blur-2xl rounded-[22px] p-8 text-center space-y-5 border border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold font-display text-white">Portal Access Restricted</h2>
              <p className="text-xs font-mono text-slate-300">
                This portal is intended for <strong className="text-amber-400">{allowedRoles.join(' or ')}</strong> accounts.
                Your current account is registered as <strong className="text-primary-400 uppercase">{role}</strong>.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return children
}
