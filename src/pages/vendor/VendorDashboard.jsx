import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StockBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ProgressTracker } from '../../components/ui/ProgressTracker'
import { reservationService } from '../../api/reservationService'
import { productService } from '../../api/productService'
import {
  QrCode, Package, ShieldAlert, X, CheckCircle2, BarChart3,
  Store, TrendingUp, PackageCheck, Clock, ChevronRight, AlertCircle
} from 'lucide-react'

const VENDOR_PRODUCTS = [
  { id: 'prod-101', name: 'Heavy Duty Windproof Umbrella (Large)', price: 349, stockCount: 14, barcode: '8901234567890', category: 'Monsoon Essentials' },
  { id: 'prod-102', name: 'Kolam Raw Rice 5kg Pack', price: 320, stockCount: 8, barcode: '8901234567891', category: 'Grocery' },
]

export const VendorDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)
  const [reservations, setReservations] = useState([])
  const [products, setProducts] = useState(VENDOR_PRODUCTS)
  const [activeTab, setActiveTab] = useState('reservations') // 'reservations' | 'inventory' | 'stats'
  const [updatingId, setUpdatingId] = useState(null)
  const [scanInput, setScanInput] = useState('')
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    const res = await reservationService.getReservations()
    setReservations(res)
  }

  const handleUpdateStatus = async (reservationId, newStatus) => {
    setUpdatingId(reservationId)
    await reservationService.updateReservationStatus(reservationId, newStatus)
    await loadReservations()
    setUpdatingId(null)
  }

  const handleScanLookup = () => {
    const found = products.find((p) => p.barcode === scanInput.trim())
    if (found) {
      setScanResult({ ...found, found: true })
      // Reduce stock count by 1 when selling
      setProducts(products.map((p) => p.id === found.id ? { ...p, stockCount: Math.max(0, p.stockCount - 1) } : p))
    } else {
      setScanResult({ found: false })
    }
  }

  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const readyCount = reservations.filter(r => r.status === 'ready').length
  const completedCount = reservations.filter(r => r.status === 'picked_up').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Access Denied Alert Banner */}
      {accessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{accessAlert}</span>
          </div>
          <button onClick={() => setAccessAlert(null)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900">Vendor Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safety-100 text-safety-800 border border-safety-200">✓ Verified Shop</span>
          </div>
          <p className="text-xs text-slate-500">Manage inventory, fulfill buyer reservations, and scan barcodes to sell.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          {[
            { id: 'reservations', label: 'Reservations', icon: PackageCheck },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'scan', label: 'Scan to Sell', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white shadow-soft text-safety-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'reservations' && pendingCount > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{pendingCount}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Orders', value: pendingCount, icon: Clock, color: 'amber', textColor: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Ready for Pickup', value: readyCount, icon: PackageCheck, color: 'safety', textColor: 'text-safety-700', bg: 'bg-safety-50' },
          { label: 'Completed Today', value: completedCount, icon: CheckCircle2, color: 'emerald', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hoverEffect={false} className={`${stat.bg} border-0`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.textColor} flex items-center justify-center border border-white shadow-soft`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-display text-slate-900">{stat.value}</p>
                  <p className="text-[11px] font-medium text-slate-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* TAB: Reservations */}
      {activeTab === 'reservations' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">Incoming Buyer Reservations</h2>
          {reservations.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="No Reservations Yet"
              description="When buyers reserve products from your shop, they will appear here for you to fulfill."
            />
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <Card key={res.id} hoverEffect={false} className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">Code: {res.verificationCode}</span>
                      <h3 className="font-bold text-base font-display text-slate-900">{res.productName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Qty: {res.quantity} · Total: <strong className="text-slate-900">₹{res.totalPrice}</strong></p>
                    </div>

                    {/* Action Buttons based on status */}
                    <div className="flex gap-2">
                      {res.status === 'pending' && (
                        <Button
                          variant="safety"
                          size="sm"
                          icon={CheckCircle2}
                          isLoading={updatingId === res.id}
                          onClick={() => handleUpdateStatus(res.id, 'ready')}
                        >
                          Mark Ready
                        </Button>
                      )}
                      {res.status === 'ready' && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={PackageCheck}
                          isLoading={updatingId === res.id}
                          onClick={() => handleUpdateStatus(res.id, 'picked_up')}
                        >
                          Mark Picked Up
                        </Button>
                      )}
                      {res.status === 'picked_up' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" /> Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <ProgressTracker currentStep={res.status} />
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB: Inventory */}
      {activeTab === 'inventory' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">Live Inventory Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} hoverEffect={false} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm font-display text-slate-900 truncate">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">₹{product.price} / {product.category}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">Barcode: {product.barcode}</p>
                </div>
                <div className="shrink-0">
                  <StockBadge count={product.stockCount} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* TAB: Scan to Sell */}
      {activeTab === 'scan' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">Barcode Scanner — Sell Item</h2>
          <Card hoverEffect={false} className="space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-safety-50 text-safety-600 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>
            <p className="text-xs text-center text-slate-500">
              In production, this activates your device camera for live barcode scanning via <strong>html5-qrcode</strong>. 
              For now, manually type a barcode to simulate a scan.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScanLookup()}
                placeholder="Type/scan barcode (e.g. 8901234567890)"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-safety-200 focus:border-safety-500 placeholder:text-slate-400"
              />
              <Button variant="safety" icon={QrCode} onClick={handleScanLookup}>
                Sell
              </Button>
            </div>

            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-sm font-medium ${
                  scanResult.found
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {scanResult.found ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 inline mr-2 text-emerald-600" />
                    <strong>{scanResult.name}</strong> — ₹{scanResult.price} sold!
                    <p className="text-xs mt-1 text-emerald-700">Remaining stock: {scanResult.stockCount - 1} units</p>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5 inline mr-2 text-rose-600" />
                    Barcode not found. Check your product catalog.
                  </>
                )}
              </motion.div>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              Try: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">8901234567890</code> (Umbrella) or <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">8901234567891</code> (Rice)
            </p>
          </Card>
        </section>
      )}
    </div>
  )
}
