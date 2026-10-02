import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Store, ArrowLeft } from 'lucide-react'

export const SignupPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md space-y-6 shadow-lift p-8">
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-safety-500 text-white flex items-center justify-center mx-auto shadow-safety">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-500">Join Nearbuy as a Customer or Shopkeeper</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" />
          <Input label="Email Address" type="email" placeholder="john@example.com" />
          <Input label="Phone Number" placeholder="+91 98765 43210" />
          <Input label="Password" type="password" placeholder="••••••••" />

          <Button type="submit" variant="safety" className="w-full py-3">
            Complete Registration
          </Button>
        </form>
      </Card>
    </div>
  )
}
