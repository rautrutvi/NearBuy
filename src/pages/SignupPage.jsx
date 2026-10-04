import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  Store, UserCheck, ArrowLeft, ArrowRight,
  Mail, Lock, Phone, User, MapPin, FileText, CheckCircle2
} from 'lucide-react'

const ROLES = [
  {
    id: 'buyer',
    label: 'Customer / Buyer',
    description: 'Browse real-time stock at nearby shops, reserve items, and track pickups.',
    icon: UserCheck,
    color: 'border-primary-400 bg-primary-50 text-primary-700',
    activeColor: 'border-primary-500 bg-primary-500 text-white shadow-lift',
  },
  {
    id: 'vendor',
    label: 'Shopkeeper / Vendor',
    description: 'List your shop, manage live inventory, scan barcodes, and fulfill buyer reservations.',
    icon: Store,
    color: 'border-safety-400 bg-safety-50 text-safety-700',
    activeColor: 'border-safety-500 bg-safety-500 text-white shadow-safety',
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
    if (form.phone.length < 10) newErrors.phone = 'Valid phone number required'
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
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
    // Simulate API call to Spring Boot /api/auth/register
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    setStep(3)
    // Auto login after registration
    login({ name: form.name, email: form.email }, selectedRole)
  }

  const handleSuccessContinue = () => {
    if (selectedRole === 'buyer') navigate('/buyer')
    else if (selectedRole === 'vendor') navigate('/vendor')
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-6">

        {/* Back Button */}
        {step < 3 && (
          <button
            onClick={() => step === 1 ? navigate('/login') : setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Login' : 'Change Role'}
          </button>
        )}

        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'bg-primary-500 text-white shadow-lift' :
                  s < step ? 'bg-safety-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${s < step ? 'bg-safety-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
            <span className="ml-2 text-xs text-slate-500 font-medium">
              Step {step} of 2: {step === 1 ? 'Choose Your Role' : 'Your Details'}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <Card hoverEffect={false} className="p-6 space-y-2">
                <h1 className="text-2xl font-extrabold font-display text-slate-900">Join Nearbuy</h1>
                <p className="text-xs text-slate-500">First, tell us how you'll use Nearbuy:</p>
              </Card>

              <div className="grid grid-cols-1 gap-4">
                {ROLES.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.id
                  return (
                    <motion.button
                      key={role.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                        isSelected ? role.activeColor : role.color + ' hover:border-opacity-70'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20' : 'bg-white'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base font-display">{role.label}</h3>
                        <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                          {role.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 shrink-0 ml-auto text-white/90" />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <Button
                variant="primary"
                className="w-full py-3"
                icon={ArrowRight}
                disabled={!selectedRole}
                onClick={() => setStep(2)}
              >
                Continue as {selectedRole === 'buyer' ? 'Customer' : selectedRole === 'vendor' ? 'Shopkeeper' : '...'}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Details Form */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <Card hoverEffect={false} className="p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">
                    {selectedRole === 'vendor' ? 'Register Your Shop' : 'Create Your Account'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedRole === 'vendor'
                      ? 'Your shop will be reviewed by an admin before going live.'
                      : 'Start discovering and reserving local stock instantly.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" icon={User} placeholder="e.g. Priya Sharma"
                      value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                      error={errors.name} />
                    <Input label="Phone Number" icon={Phone} placeholder="+91 98765 43210"
                      value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                      error={errors.phone} />
                  </div>

                  <Input label="Email Address" icon={Mail} type="email" placeholder="you@example.com"
                    value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Password" icon={Lock} type="password" placeholder="Min. 6 characters"
                      value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                      error={errors.password} />
                    <Input label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password"
                      value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      error={errors.confirmPassword} />
                  </div>

                  {/* Vendor-only Shop Fields */}
                  {selectedRole === 'vendor' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-2 border-t border-slate-100"
                    >
                      <p className="text-xs font-bold text-safety-700 uppercase tracking-wider">Shop Information</p>
                      <Input label="Shop Name" icon={Store} placeholder="e.g. Sharma General Store"
                        value={form.shopName} onChange={(e) => handleChange('shopName', e.target.value)}
                        error={errors.shopName} />
                      <Input label="Shop Address" icon={MapPin} placeholder="e.g. 12, Station Road, Ward 4"
                        value={form.shopAddress} onChange={(e) => handleChange('shopAddress', e.target.value)}
                        error={errors.shopAddress} />
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Shop Category</label>
                        <select
                          value={form.shopCategory}
                          onChange={(e) => handleChange('shopCategory', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-safety-200 focus:border-safety-500"
                        >
                          <option value="">Select a category...</option>
                          {['Grocery / Kirana', 'Pharmacy & Medical', 'Hardware & Tools', 'Electronics', 'Clothing', 'Other'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  <Button type="submit" variant={selectedRole === 'vendor' ? 'safety' : 'primary'}
                    className="w-full py-3" isLoading={isLoading} icon={ArrowRight}>
                    {isLoading ? 'Creating Account...' : selectedRole === 'vendor' ? 'Submit Shop for Verification' : 'Create My Account'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <Card hoverEffect={false} className="p-10 space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${
                    selectedRole === 'vendor' ? 'bg-safety-500 shadow-safety' : 'bg-primary-500 shadow-lift'
                  } text-white`}
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold font-display text-slate-900">
                    {selectedRole === 'vendor' ? 'Shop Submitted!' : 'Welcome to Nearbuy!'}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                    {selectedRole === 'vendor'
                      ? 'Your shop registration is under review. An admin will verify and approve it shortly. We will notify you via email!'
                      : `Hi ${form.name}! Your account is ready. Start exploring nearby shops and reserving live stock instantly.`}
                  </p>
                </div>

                <Button
                  variant={selectedRole === 'vendor' ? 'safety' : 'primary'}
                  className="w-full py-3"
                  icon={ArrowRight}
                  onClick={handleSuccessContinue}
                >
                  {selectedRole === 'vendor' ? 'Go to Vendor Portal' : 'Explore Nearby Shops'}
                </Button>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>

        {step < 3 && (
          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="font-semibold text-primary-600 hover:underline">
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
