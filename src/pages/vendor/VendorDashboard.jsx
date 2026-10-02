import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Store, QrCode, PackageCheck, BarChart3 } from 'lucide-react'

export const VendorDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-display text-slate-900">Shopkeeper / Vendor Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-safety-100 text-safety-800">Verified Shop</span>
          </div>
          <p className="text-xs text-slate-500">Manage products, scan barcodes to sell, and fulfill buyer reservations.</p>
        </div>
        <Button variant="safety" icon={QrCode}>
          Scan Barcode to Sell
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-safety-50 text-safety-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Live Inventory Count</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">124 Items</p>
          <p className="text-xs text-slate-500">Auto-updated via barcode scanner</p>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Incoming Reservations</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">3 Pending</p>
          <p className="text-xs text-slate-500">Buyers waiting for pickup</p>
        </Card>

        <Card className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 font-display">Today's Sales</h3>
          <p className="text-2xl font-extrabold text-slate-900 font-display">₹4,850</p>
          <p className="text-xs text-slate-500">18 orders fulfilled</p>
        </Card>
      </motion.div>

      <Card hoverEffect={false} className="p-8 text-center bg-surface-50 border-dashed border-slate-300">
        <h3 className="text-base font-bold font-display text-slate-700">Vendor Management Tools Coming Soon!</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          In upcoming steps, we will build the live barcode scanner (`html5-qrcode`), product inventory manager, and incoming reservation fulfillment workflow.
        </p>
      </Card>
    </div>
  )
}
