import React, { useState } from 'react'
import { User, Package, Star, MapPin, Mail, Phone, LogOut, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { ProgressTracker } from '../../components/ui/ProgressTracker'
import { reservationService } from '../../api/reservationService';

  export const BuyerProfile = () => {
  const downloadBill = async (reservationId) => {
    try {
      const resp = await reservationService.getReceipt(reservationId);
      const blob = new Blob([resp.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${reservationId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download receipt', e);
      alert('Failed to download receipt');
    }
  };
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  const history = [
    { id: 'r1', productName: 'Premium Toor Dal (1 kg)', shopName: 'Vardhman Grain Stores', status: 'picked_up', date: '2 days ago', price: 165 },
    { id: 'r2', productName: 'Kolam Raw Rice (5 kg)', shopName: 'Dedhia Kirana', status: 'picked_up', date: '5 days ago', price: 320 },
    { id: 'r3', productName: 'Fortune Sunflower Oil (1 L)', shopName: 'Jashoda Grain Stores', status: 'pending', date: 'Today', price: 145 },
  ]

  return (
    <div className="min-h-screen bg-[#06060a] text-white px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[350px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">

        {/* Profile Header Card */}
        <div className="rounded-3xl p-[1px] bg-gradient-to-r from-primary-500/50 via-amber-500/40 to-teal-500/50 shadow-2xl">
          <div className="bg-[#0c0c14]/95 backdrop-blur-xl rounded-[23px] p-8 border border-white/10 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center shadow-[0_0_25px_rgba(224,82,54,0.4)] text-3xl font-extrabold font-display text-white shrink-0">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-amber-400 mb-1">
                <Terminal className="w-3 h-3" />
                <span>BUYER ID #{user?.email ? user.email.slice(0, 5) : '8492'}</span>
              </div>
              <h1 className="text-2xl font-extrabold font-display text-white">{user?.name || 'Demo Buyer'}</h1>
              <p className="text-slate-400 text-xs font-mono">{user?.email || 'buyer@nearbuy.in'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          {[
            { id: 'profile', label: 'Account Credentials', icon: User },
            { id: 'history', label: 'Order History', icon: Package },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-[0_0_15px_rgba(224,82,54,0.4)]'
                    : 'text-slate-400 hover:text-white'
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
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4">
              <h3 className="font-bold text-sm font-mono text-white flex items-center justify-between">
                <span>Account Specifications</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">VERIFIED</span>
              </h3>
              {[
                { icon: User, label: 'Full Name', value: user?.name || 'Buyer Account' },
                { icon: Mail, label: 'Email', value: user?.email || 'buyer@nearbuy.in' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Local Grid Zone', value: 'Sector 7, Industrial Ward' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 bg-slate-900/80 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/5 text-primary-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-500">{label}</p>
                    <p className="text-xs font-mono font-bold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Orders', value: '12', icon: Package, color: 'text-primary-400' },
                { label: 'Reviews Given', value: '7', icon: Star, color: 'text-amber-400' },
                { label: 'Stores Visited', value: '5', icon: MapPin, color: 'text-teal-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="text-center p-4 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-1">
                  <Icon className={`w-5 h-5 mx-auto ${color}`} />
                  <p className="text-2xl font-extrabold font-display text-white">{value}</p>
                  <p className="text-[10px] font-mono text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => { logout(); navigate('/') }}
              className="w-full py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Terminate Session (Logout)
            </button>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm font-mono text-white">Pickup History Telemetry</h3>
            {history.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base font-display text-white">{item.productName}</h4>
                    <p className="text-xs font-mono text-slate-400">{item.shopName} · {item.date}</p>
                  </div>
                  <span className="font-extrabold text-amber-400 font-mono text-base">₹{item.price}</span>
                </div>
                <ProgressTracker currentStep={item.status} />
                {/* Download bill button for paid/picked_up reservations */}
                {item.status !== 'pending' && (
                  <button
                    onClick={() => downloadBill(item.id)}
                    className="mt-2 w-full py-2 rounded bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 text-white font-mono text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(224,82,54,0.4)] hover:scale-[1.02] transition-all"
                  >
                    Download Bill
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
