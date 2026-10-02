import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { FloodBadge, StockBadge } from '../../components/ui/Badge'
import { ShoppingBag, MapPin, Search, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const BuyerDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-display text-slate-900">Customer Dashboard</h1>
            <FloodBadge level="safe" label="Nearby Safe Zone" />
          </div>
          <p className="text-xs text-slate-500">Browsing nearby verified shops with real-time stock & monsoon flood guidance.</p>
        </div>
        <Button variant="primary" icon={Search}>
          Explore Shops Nearby
        </Button>
      </div>

      {/* Role Placeholder Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Active Reservations</h3>
          <p className="text-xs text-slate-500">Track order pickup progress in real-time.</p>
          <div className="pt-2 text-xs font-semibold text-primary-600">1 Item Ready for Pickup</div>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-safety-50 text-safety-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Monsoon Safety Layer</h3>
          <p className="text-xs text-slate-500">Live flood reports & waterlogging safe routes.</p>
          <div className="pt-2 text-xs font-semibold text-safety-700">Routes clear in 2.5km</div>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Verified Local Stores</h3>
          <p className="text-xs text-slate-500">Guaranteed real stock counts updated by shops.</p>
          <div className="pt-2">
            <StockBadge count={14} />
          </div>
        </Card>
      </motion.div>

      <Card hoverEffect={false} className="p-8 text-center bg-surface-50 border-dashed border-slate-300">
        <h3 className="text-base font-bold font-display text-slate-700">Buyer Features Coming in Next Steps!</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          In upcoming steps, we will build live shop inventory cards, interactive Leaflet OpenStreetMap, cart management, and pickup reservation tracking.
        </p>
      </Card>
    </div>
  )
}
