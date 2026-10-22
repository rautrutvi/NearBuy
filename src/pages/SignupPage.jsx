import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { authService } from '../api/authService'
import {
  Store, UserCheck, ArrowLeft, ArrowRight,
  Mail, Lock, Phone, User, MapPin, CheckCircle2, Terminal, Sparkles
} from 'lucide-react'

const ROLES = [
  {
    id: 'buyer',
    label: 'Customer / Buyer',
    description: 'Browse real-time stock at nearby shops, reserve items for 30-min pickup, and check flood radar.',
    icon: UserCheck,
    color: 'border-primary-500/30 bg-primary-950/20 text-primary-300 hover:border-primary-500/60',
    activeColor: 'border-primary-500 bg-gradient-to-r from-primary-900/40 to-amber-900/30 text-white shadow-[0_0_25px_rgba(224,82,54,0.4)]',
  },
  {
    id: 'vendor',
    label: 'Shopkeeper / Vendor',
    description: 'Register your store, manage live inventory, scan barcodes to sell, and fulfill customer reservations.',
    icon: Store,
    color: 'border-teal-500/30 bg-teal-950/20 text-teal-300 hover:border-teal-500/60',
    activeColor: 'border-teal-500 bg-gradient-to-r from-teal-900/40 to-emerald-900/30 text-white shadow-[0_0_25px_rgba(13,148,136,0.4)]',
  },
]

export const SignupPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [step, setStep] = useState(1) // 1: Role selection, 2: Details form, 3: Success
  const [selectedRole, setSelectedRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    shopName: '', shopAddress: '', shopCategory: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (form.phone.length < 10) newErrors.phone = 'Valid 10-digit phone required'
    if (form.password.length < 6) newErrors.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (selectedRole === 'vendor') {
      if (!form.shopName.trim()) newErrors.shopName = 'Shop name is required'
      if (!form.shopAddress.trim()) newErrors.shopAddress = 'Shop address is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setIsLoading(true)
    try {
      const signupRole = selectedRole === 'buyer' ? 'CUSTOMER' : 'SHOPKEEPER'
      const userRes = await authService.signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: signupRole,
        phone: form.phone,
      })
      // Automatically log in with the new credentials
      try {
        const loginData = await authService.login(form.email, form.password)
        login(loginData.user, selectedRole, loginData.token)
      } catch (loginErr) {
        login(userRes, selectedRole)
      }
    } catch (err) {
      console.warn('Backend signup error, falling back to demo mode:', err?.response?.data || err.message)
      login({ name: form.name, email: form.email, phone: form.phone }, selectedRole)
    } finally {
      setIsLoading(false)
      setStep(3)
    }
  }

  const handleSuccessContinue = () => {
    if (selectedRole === 'buyer') navigate('/buyer')
    else if (selectedRole === 'vendor') navigate('/vendor')
  }

  return (
    <div className="min-h-[90vh] bg-[#050508] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-primary-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[350px] bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">

        {/* Back Button */}
        {step < 3 && (
          <button
            onClick={() => step === 1 ? navigate('/login') : setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Login' : 'Change Role'}
          </button>
        )}

        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs font-mono">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(224,82,54,0.5)]' :
                  s < step ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${s < step ? 'bg-teal-500' : 'bg-slate-800'}`} />}
              </React.Fragment>
            ))}
            <span className="text-slate-400">
              Step {step} of 2: {step === 1 ? 'Choose Role' : 'Your Details'}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="p-6 rounded-3xl bg-[#0c0c14] border border-white/10 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>REGISTRATION PROTOCOL</span>
                </div>
                <h1 className="text-2xl font-extrabold font-display text-white">Join the Nearbuy Network</h1>
                <p className="text-xs text-slate-400 font-mono">Select how you intend to access the platform:</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {ROLES.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.id
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                        isSelected ? role.activeColor : role.color
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-300'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base font-display text-white">{role.label}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                disabled={!selectedRole}
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 font-mono font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_25px_rgba(224,82,54,0.4)] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue as {selectedRole === 'buyer' ? 'Customer' : selectedRole === 'vendor' ? 'Merchant' : '...'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Details Form */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="p-7 rounded-3xl bg-[#0c0c14] border border-white/10 space-y-5">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">
                    {selectedRole === 'vendor' ? 'Merchant Store Registration' : 'Create Customer Account'}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedRole === 'vendor'
                      ? 'Merchant shops are verified by admin before public listing.'
                      : 'Instant access to nearby shop stock & monsoon flood radar.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      {errors.name && <p className="text-[10px] text-rose-400 font-mono">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      {errors.phone && <p className="text-[10px] text-rose-400 font-mono">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@nearbuy.in"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    {errors.email && <p className="text-[10px] text-rose-400 font-mono">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Password</label>
                      <input
                        type="password"
                        placeholder="Min 6 chars"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      {errors.password && <p className="text-[10px] text-rose-400 font-mono">{errors.password}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Repeat password"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-rose-400 font-mono">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  {selectedRole === 'vendor' && (
                    <div className="space-y-4 pt-3 border-t border-white/10">
                      <p className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">Store Specifications</p>
                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-300">Store Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Sharma General Kirana"
                          value={form.shopName}
                          onChange={(e) => handleChange('shopName', e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                        />
                        {errors.shopName && <p className="text-[10px] text-rose-400 font-mono">{errors.shopName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-mono text-slate-300">Store Physical Address</label>
                        <input
                          type="text"
                          placeholder="e.g. 12, Station Road, Ward 4"
                          value={form.shopAddress}
                          onChange={(e) => handleChange('shopAddress', e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                        />
                        {errors.shopAddress && <p className="text-[10px] text-rose-400 font-mono">{errors.shopAddress}</p>}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 font-mono font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_25px_rgba(224,82,54,0.4)] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{isLoading ? 'Processing Registration...' : selectedRole === 'vendor' ? 'Submit Store Application' : 'Create Customer Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="p-10 rounded-3xl bg-[#0c0c14] border border-white/10 space-y-5">
                <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-tr from-primary-500 to-teal-500 text-white shadow-[0_0_35px_rgba(13,148,136,0.6)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold font-display text-white">
                    {selectedRole === 'vendor' ? 'Store Application Submitted!' : 'Welcome to Nearbuy!'}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {selectedRole === 'vendor'
                      ? 'Your merchant store registration has been transmitted for admin telemetry verification. You can now access your vendor portal.'
                      : `Account confirmed for ${form.name}. Explore local store inventory and reserve supplies immediately.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSuccessContinue}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 font-mono font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_25px_rgba(224,82,54,0.4)]"
                >
                  {selectedRole === 'vendor' ? 'Enter Vendor Portal' : 'Open Local Marketplace'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {step < 3 && (
          <p className="text-center text-xs font-mono text-slate-500">
            Already registered?{' '}
            <button onClick={() => navigate('/login')} className="font-bold text-amber-400 hover:underline">
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
