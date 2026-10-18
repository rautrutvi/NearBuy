import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { authService } from '../api/authService'
import { Store, UserCheck, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Terminal, KeyRound } from 'lucide-react'

const PLATFORM_ADMIN_EMAIL = 'rautrutvi@gmail.com'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(location.state?.message || null)

  const performLogin = async (targetEmail, targetPassword, targetRole) => {
    setIsLoading(true)
    setErrorMsg(null)

    const normalizedEmail = (targetEmail || '').trim().toLowerCase()

    // Enforce admin email check
    if (targetRole === 'admin' && normalizedEmail !== PLATFORM_ADMIN_EMAIL) {
      setErrorMsg(`Access Denied: The Admin Mission Control is exclusively restricted to ${PLATFORM_ADMIN_EMAIL}.`)
      setIsLoading(false)
      return
    }

    try {
      // Attempt real Spring Boot JWT authentication
      const data = await authService.login(normalizedEmail, targetPassword)
      const userRole = (data.user?.role || targetRole || 'buyer').toLowerCase()
      const normalizedRole = userRole === 'customer' ? 'buyer' : userRole === 'shopkeeper' ? 'vendor' : userRole

      if (normalizedRole === 'admin' && normalizedEmail !== PLATFORM_ADMIN_EMAIL) {
        setErrorMsg(`Unauthorized: Only ${PLATFORM_ADMIN_EMAIL} can hold the admin role.`)
        setIsLoading(false)
        return
      }

      login(data.user, normalizedRole, data.token)

      if (normalizedRole === 'buyer') navigate('/buyer')
      else if (normalizedRole === 'vendor') navigate('/vendor')
      else if (normalizedRole === 'admin') navigate('/admin')
    } catch (err) {
      console.warn('Backend login attempt:', err?.response?.data || err.message)

      if (err?.response?.data?.message) {
        setErrorMsg(err.response.data.message)
        setIsLoading(false)
        return
      }

      // If backend is currently not running, provide local fallback with strict email restriction
      console.info('Falling back to local session authentication')
      if (targetRole === 'admin' && normalizedEmail !== PLATFORM_ADMIN_EMAIL) {
        setErrorMsg(`Access Denied: Admin portal access is exclusively restricted to ${PLATFORM_ADMIN_EMAIL}.`)
        setIsLoading(false)
        return
      }

      const assignedRole = normalizedEmail === PLATFORM_ADMIN_EMAIL ? 'admin' : targetRole === 'admin' ? 'buyer' : targetRole
      const displayName = normalizedEmail === PLATFORM_ADMIN_EMAIL
        ? 'Rutvi Raut (Platform Administrator)'
        : assignedRole === 'vendor'
        ? 'Shopkeeper Partner'
        : 'Nearbuy Customer'

      login({ name: displayName, email: normalizedEmail }, assignedRole)

      if (assignedRole === 'buyer') navigate('/buyer')
      else if (assignedRole === 'vendor') navigate('/vendor')
      else if (assignedRole === 'admin') navigate('/admin')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresetSelect = (presetRole) => {
    setErrorMsg(null)
    if (presetRole === 'buyer') {
      setEmail('customer@test.com')
      setPassword('pass123')
      performLogin('customer@test.com', 'pass123', 'buyer')
    } else if (presetRole === 'vendor') {
      setEmail('shop@test.com')
      setPassword('pass123')
      performLogin('shop@test.com', 'pass123', 'vendor')
    } else if (presetRole === 'admin') {
      setEmail(PLATFORM_ADMIN_EMAIL)
      setPassword('admin123')
      performLogin(PLATFORM_ADMIN_EMAIL, 'admin123', 'admin')
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.')
      return
    }

    let determinedRole = 'buyer'
    if (cleanEmail === PLATFORM_ADMIN_EMAIL) {
      determinedRole = 'admin'
    } else if (cleanEmail.includes('admin')) {
      setErrorMsg(`Access Denied: Admin operations are exclusively restricted to ${PLATFORM_ADMIN_EMAIL}.`)
      return
    } else if (cleanEmail.includes('vendor') || cleanEmail.includes('shop')) {
      determinedRole = 'vendor'
    }

    performLogin(cleanEmail, password || 'pass123', determinedRole)
  }

  return (
    <div className="min-h-[90vh] bg-[#050508] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-primary-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[350px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glowing Conic Border Card */}
        <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 shadow-[0_0_50px_rgba(224,82,54,0.25)]">
          <div className="bg-[#0b0b12]/95 backdrop-blur-2xl rounded-[22px] p-8 space-y-6 border border-white/10">

            {/* Error / Alert banner */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-950/70 border border-amber-500/50 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-mono text-amber-200"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-amber-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(224,82,54,0.5)]">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-amber-400">
                <Terminal className="w-3 h-3 animate-pulse" />
                <span>SECURE AUTHENTICATION SYSTEM</span>
              </div>
              <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
                Sign In to Nearbuy
              </h1>
              <p className="text-xs text-slate-400 font-mono">Hyperlocal Commerce &amp; Flood Radar Core</p>
            </div>

            {/* Quick Test Accounts */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Quick Account Selection
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">PRESET</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handlePresetSelect('buyer')}
                  className="py-2.5 px-2 rounded-xl bg-primary-600/30 hover:bg-primary-600 border border-primary-500/50 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(224,82,54,0.3)] hover:scale-105 flex flex-col items-center gap-1 disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4 text-primary-400" />
                  <span>Buyer</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handlePresetSelect('vendor')}
                  className="py-2.5 px-2 rounded-xl bg-teal-600/30 hover:bg-teal-600 border border-teal-500/50 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] hover:scale-105 flex flex-col items-center gap-1 disabled:opacity-50"
                >
                  <Store className="w-4 h-4 text-teal-400" />
                  <span>Vendor</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handlePresetSelect('admin')}
                  className="py-2.5 px-2 rounded-xl bg-violet-600/30 hover:bg-violet-600 border border-violet-500/50 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 flex flex-col items-center gap-1 disabled:opacity-50"
                  title="Super Admin (rautrutvi@gmail.com only)"
                >
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>Rutvi (Admin)</span>
                </button>
              </div>
              <div className="text-[10px] font-mono text-violet-300 bg-violet-950/60 p-2 rounded-lg border border-violet-500/30 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-violet-400 shrink-0" />
                <span>Admin portal is restricted exclusively to <strong>{PLATFORM_ADMIN_EMAIL}</strong></span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder={`e.g. ${PLATFORM_ADMIN_EMAIL} or vendor@nearbuy.in`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 font-mono font-extrabold text-xs text-white tracking-wider uppercase shadow-[0_0_25px_rgba(224,82,54,0.4)] hover:shadow-[0_0_40px_rgba(224,82,54,0.7)] transition-all flex items-center justify-center gap-2 group hover:scale-[1.02] disabled:opacity-50"
              >
                <span>{isLoading ? 'AUTHENTICATING...' : 'ENTER PORTAL'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="text-center text-xs font-mono text-slate-400 pt-2 border-t border-white/10">
              New to Nearbuy?{' '}
              <button onClick={() => navigate('/signup')} className="font-bold text-amber-400 hover:text-amber-300 underline">
                Register New Shop or Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
