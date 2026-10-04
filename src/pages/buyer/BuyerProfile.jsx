import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuthStore } from '../../store/useAuthStore'
import { reservationService } from '../../api/reservationService'
import { ProgressTracker } from '../../components/ui/ProgressTracker'
import { User, Mail, Phone, MapPin, Package, Star, Edit3, LogOut, Clock, ChevronRight } from 'lucide-react'

export const BuyerProfile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [reservations] = useState(reservationService.getReservations instanceof Function
    ? [] : [])
  const [activeTab, setActiveTab] = useState('profile')

  // Mock reservation history
  const history = [
    { id: 'r1', productName: 'Heavy Duty Umbrella (Large)', shopName: 'Sharma Kirana', status: 'picked_up', date: '2 days ago', price: 349 },
    { id: 'r2', productName: 'Kolam Raw Rice 5kg', shopName: 'Green Grocery Hub', status: 'picked_up', date: '5 days ago', price: 320 },
    { id: 'r3', productName: 'Emergency Torch Set', shopName: 'Quick Hardware & Tools', status: 'pending', date: 'Today', price: 299 },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl p-8 text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 -translate-y-20 translate-x-20" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lift text-4xl font-extrabold font-display">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-display">{user?.name || 'Buyer'}</h1>
            <p className="text-slate-300 text-sm">{user?.email || 'buyer@nearbuy.in'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold bg-primary-500/30 border border-primary-400/40 px-2.5 py-1 rounded-full text-primary-200">
                ✓ Verified Customer
              </span>
              <span className="text-xs text-slate-400">Member since Oct 2026</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'history', label: 'Order History', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === tab.id ? 'bg-white shadow-soft text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card hoverEffect={false} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm font-display text-slate-900">Account Details</h3>
              <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            {[
              { icon: User, label: 'Full Name', value: user?.name || 'Buyer Account' },
              { icon: Mail, label: 'Email', value: user?.email || 'buyer@nearbuy.in' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Default Area', value: 'Sector 7, Industrial Zone' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Orders', value: '12', icon: Package },
              { label: 'Reviews Given', value: '7', icon: Star },
              { label: 'Shops Visited', value: '5', icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} hoverEffect={false} className="text-center p-4 space-y-1">
                <Icon className="w-5 h-5 text-primary-500 mx-auto" />
                <p className="text-2xl font-extrabold font-display text-slate-900">{value}</p>
                <p className="text-[10px] text-slate-500 font-medium">{label}</p>
              </Card>
            ))}
          </div>

          <Button variant="danger" icon={LogOut} className="w-full" onClick={() => { logout(); navigate('/') }}>
            Log Out
          </Button>
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="font-bold text-sm font-display text-slate-900">Reservation History</h3>
          {history.map((item) => (
            <Card key={item.id} hoverEffect={false} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm font-display text-slate-900">{item.productName}</h4>
                  <p className="text-xs text-slate-500">{item.shopName} · {item.date}</p>
                </div>
                <span className="font-extrabold text-slate-900 font-display shrink-0">₹{item.price}</span>
              </div>
              <ProgressTracker currentStep={item.status} />
              <div className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {item.status === 'picked_up' ? 'Completed' : item.status === 'ready' ? 'Ready for Pickup' : 'Order Confirmed'}
              </div>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  )
}
