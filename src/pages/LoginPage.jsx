import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Store, UserCheck, Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRoleLogin = (role) => {
    login({ name: `Demo ${role.toUpperCase()}`, email: email || `${role}@nearbuy.local` }, role)
    if (role === 'buyer') navigate('/buyer')
    else if (role === 'vendor') navigate('/vendor')
    else if (role === 'admin') navigate('/admin')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md space-y-6 shadow-lift p-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center mx-auto shadow-lift">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900">Sign in to Nearbuy</h1>
          <p className="text-xs text-slate-500">Hyperlocal Inventory & Monsoon Flood Safe Platform</p>
        </div>

        {/* Quick Role Tester Bar */}
        <div className="bg-surface-100 p-3 rounded-2xl space-y-2 border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>Quick Role-Based Login Tester</span>
          </div>
          <p className="text-[11px] text-slate-500">Click a role below to test Zustand auth state & role-based redirect:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              onClick={() => handleRoleLogin('buyer')}
              className="text-[11px] px-2 py-1.5"
            >
              Buyer
            </Button>
            <Button
              variant="safety"
              size="sm"
              icon={Store}
              onClick={() => handleRoleLogin('vendor')}
              className="text-[11px] px-2 py-1.5"
            >
              Vendor
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Shield}
              onClick={() => handleRoleLogin('admin')}
              className="text-[11px] px-2 py-1.5"
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <hr className="w-full border-slate-200" />
          <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Or enter details</span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRoleLogin('buyer'); }} className="space-y-4">
          <Input
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
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
            Sign In as Buyer
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
