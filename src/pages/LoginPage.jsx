import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Store, UserCheck, Shield, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(location.state?.message || null)

  const handleRoleLogin = (role) => {
    let demoEmail = email || `${role}@nearbuy.com`
    login({ name: `Demo ${role.toUpperCase()}`, email: demoEmail }, role)

    // Redirect to respective permitted dashboard
    if (role === 'buyer') navigate('/buyer')
    else if (role === 'vendor') navigate('/vendor')
    else if (role === 'admin') navigate('/admin')
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (email.includes('admin')) {
      handleRoleLogin('admin')
    } else if (email.includes('vendor') || email.includes('shop')) {
      handleRoleLogin('vendor')
    } else {
      handleRoleLogin('buyer')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md space-y-6 shadow-lift p-8">
        {/* Banner Alert for Redirects */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center mx-auto shadow-lift">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900">Sign in to Nearbuy</h1>
          <p className="text-xs text-slate-500">Role-Protected Hyperlocal Commerce Platform</p>
        </div>

        {/* Quick Role Tester Buttons */}
        <div className="bg-surface-100 p-3.5 rounded-2xl space-y-2 border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-display">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>Role-Based Sign In Quick Tester</span>
          </div>
          <p className="text-[11px] text-slate-500">Sign in as an authorized role to test route permissions:</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              onClick={() => handleRoleLogin('buyer')}
              className="text-[11px] px-2 py-2"
            >
              Buyer
            </Button>
            <Button
              variant="safety"
              size="sm"
              icon={Store}
              onClick={() => handleRoleLogin('vendor')}
              className="text-[11px] px-2 py-2"
            >
              Vendor
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Shield}
              onClick={() => handleRoleLogin('admin')}
              className="text-[11px] px-2 py-2"
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <hr className="w-full border-slate-200" />
          <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Or enter email</span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="e.g. buyer@nearbuy.com or admin@nearbuy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" className="w-full py-3" icon={ArrowRight}>
            Sign In
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-semibold text-primary-600 hover:underline">
            Register Shop or Account
          </button>
        </div>
      </Card>
    </div>
  )
}
