import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { ShieldCheck, AlertTriangle, Building2, Activity } from 'lucide-react'

export const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-display text-slate-900">Platform Admin Panel</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">Super Admin</span>
          </div>
          <p className="text-xs text-slate-500">Verify new shop listings, validate monsoon flood safety reports, and oversee platform activity.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Active Shops</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">48</p>
          <p className="text-xs text-slate-500">5 pending verification</p>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Flood Reports</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">2 Active</p>
          <p className="text-xs text-slate-500">Requires map verification</p>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-safety-50 text-safety-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Trust Rating</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">99.4%</p>
          <p className="text-xs text-slate-500">Verified stock accuracy</p>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Platform Traffic</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">1.2k</p>
          <p className="text-xs text-slate-500">Active users today</p>
        </Card>
      </motion.div>

      <Card hoverEffect={false} className="p-8 text-center bg-surface-50 border-dashed border-slate-300">
        <h3 className="text-base font-bold font-display text-slate-700">Admin Control Center Coming Soon!</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          In upcoming steps, we will build shop verification approval tables, community flood report validation, and platform analytics charts.
        </p>
      </Card>
    </div>
  )
}
