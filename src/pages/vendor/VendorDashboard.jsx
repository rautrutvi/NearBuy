import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StockBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ProgressTracker } from '../../components/ui/ProgressTracker'
import { TiltCard3D } from '../../components/ui/TiltCard3D'
import { reservationService } from '../../api/reservationService'
import { productService } from '../../api/productService'
import {
  QrCode, Package, ShieldAlert, X, CheckCircle2,
  Store, TrendingUp, PackageCheck, Clock, ChevronRight, AlertCircle, Sparkles, Terminal
} from 'lucide-react'

const VENDOR_PRODUCTS = [
  { id: 'prod-101', name: 'Heavy Duty Windproof Umbrella (Large)', price: 349, stockCount: 14, barcode: '8901234567890', category: 'Monsoon Essentials' },
  { id: 'prod-102', name: 'Kolam Raw Rice 5kg Pack', price: 320, stockCount: 8, barcode: '8901234567891', category: 'Grocery' },
  { id: 'prod-103', name: 'Waterproof High-Beam LED Torch', price: 299, stockCount: 5, barcode: '8901234567894', category: 'Hardware' },
]

export const VendorDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)
  const [reservations, setReservations] = useState([])
  const [products, setProducts] = useState(VENDOR_PRODUCTS)
  const [activeTab, setActiveTab] = useState('reservations') // 'reservations' | 'inventory' | 'scan'
  const [updatingId, setUpdatingId] = useState(null)
  const [scanInput, setScanInput] = useState('')
  const [scanResult, setScanResult] = useState(null)

  useEffect(() => {
    loadVendorData()
  }, [])

  const loadVendorData = async () => {
    try {
      const [res, prods] = await Promise.all([
        reservationService.getReservations('vendor'),
        productService.getMyProducts(),
      ])
      if (Array.isArray(res) && res.length > 0) setReservations(res)
      if (Array.isArray(prods) && prods.length > 0) setProducts(prods)
    } catch (e) {
      console.warn('Failed to load live vendor data', e?.message)
    }
  }

  const handleUpdateStatus = async (reservationId, newStatus) => {
    setUpdatingId(reservationId)
    await reservationService.updateReservationStatus(reservationId, newStatus)
    await loadVendorData()
    setUpdatingId(null)
  }

  const handleScanLookup = async () => {
    const rawBarcode = scanInput.trim()
    if (!rawBarcode) return

    try {
      // Attempt backend scan-and-sell to decrement live inventory
      const updatedProduct = await productService.scanAndSell(rawBarcode, 1)
      setScanResult({ ...updatedProduct, found: true })
      setProducts((prev) =>
        prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p)
      )
      return
    } catch (e) {
      console.warn('Backend scan-sell attempt failed, falling back to local lookup', e?.message)
    }

    // Local fallback
    const found = products.find((p) => p.barcode === rawBarcode)
    if (found) {
      setScanResult({ ...found, found: true })
      setProducts(products.map((p) => p.id === found.id ? { ...p, stockCount: Math.max(0, p.stockCount - 1) } : p))
    } else {
      setScanResult({ found: false })
    }
  }

  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const readyCount = reservations.filter(r => r.status === 'ready').length
  const completedCount = reservations.filter(r => r.status === 'picked_up').length

  return (
    <div className="min-h-screen bg-transparent text-white px-4 py-8 relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[350px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[350px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* Alert Banner */}
        {accessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-950/70 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-amber-300 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{accessAlert}</span>
            </div>
            <button onClick={() => setAccessAlert(null)} className="text-amber-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Header Banner */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-teal-500/40 via-sky-500/40 to-primary-500/40 shadow-2xl">
          <div className="bg-[#0c0c14]/90 backdrop-blur-xl p-6 rounded-[23px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
                  Merchant Control Center
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-500/40">
                  ✓ VERIFIED SHOP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Live inventory tracking · Customer reservation fulfillment · Barcode checkout terminal
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 shrink-0">
              {[
                { id: 'reservations', label: 'Reservations', icon: PackageCheck, count: pendingCount },
                { id: 'inventory', label: 'Inventory', icon: Package, count: null },
                { id: 'scan', label: 'Scan to Sell', icon: QrCode, count: null },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(13,148,136,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Telemetry Stats Row with 3D Physics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Pending Pickup Orders', value: pendingCount, icon: Clock, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/20', glow: 'amber' },
            { label: 'Ready for Counter Pickup', value: readyCount, icon: PackageCheck, color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-950/20', glow: 'teal' },
            { label: 'Completed Today', value: completedCount, icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20', glow: 'teal' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <TiltCard3D key={stat.label} glowColor={stat.glow} maxTilt={12} scale={1.03} depth={15}>
                <div className={`p-5 rounded-2xl bg-[#0d0d16] border ${stat.border} shadow-xl flex items-center gap-4`}>
                  <div
                    style={{ transform: 'translateZ(15px)' }}
                    className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 border border-white/10 shadow-lg`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div style={{ transform: 'translateZ(10px)' }}>
                    <p className="text-3xl font-extrabold font-display text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      {stat.value}
                    </p>
                    <p className="text-xs font-mono text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </TiltCard3D>
            )
          })}
        </div>

        {/* TAB 1: Incoming Reservations Queue */}
        {activeTab === 'reservations' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-teal-400" /> Incoming Buyer Reservations ({reservations.length})
              </h2>
              <span className="text-xs font-mono text-slate-400">Live Customer Queue</span>
            </div>

            {reservations.length === 0 ? (
              <EmptyState
                icon={PackageCheck}
                title="No reservations yet"
                description="When buyers reserve products from your shop, they will appear here for you to fulfill."
              />
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div key={res.id} className="rounded-2xl p-[1px] bg-gradient-to-r from-teal-500/30 via-white/10 to-primary-500/30">
                    <div className="bg-[#0d0d16] p-6 rounded-[15px] border border-white/10 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-amber-400 mb-1.5">
                            <Terminal className="w-3 h-3" />
                            CODE: <strong>{res.verificationCode}</strong>
                          </div>
                          <h3 className="font-bold text-lg font-display text-white">{res.productName}</h3>
                          <p className="text-xs font-mono text-slate-400 mt-0.5">
                            Quantity: <strong className="text-white">{res.quantity}</strong> · Total Amount: <strong className="text-emerald-400 font-display text-sm">₹{res.totalPrice}</strong>
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {res.status === 'pending' && (
                            <button
                              disabled={updatingId === res.id}
                              onClick={() => handleUpdateStatus(res.id, 'ready')}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(13,148,136,0.4)] hover:scale-105 transition-all flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              {updatingId === res.id ? 'Updating...' : 'Mark Ready'}
                            </button>
                          )}
                          {res.status === 'ready' && (
                            <button
                              disabled={updatingId === res.id}
                              onClick={() => handleUpdateStatus(res.id, 'picked_up')}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(224,82,54,0.4)] hover:scale-105 transition-all flex items-center gap-1.5"
                            >
                              <PackageCheck className="w-4 h-4" />
                              {updatingId === res.id ? 'Updating...' : 'Mark Picked Up'}
                            </button>
                          )}
                          {res.status === 'picked_up' && (
                            <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Completed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <ProgressTracker currentStep={res.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Live Inventory */}
        {activeTab === 'inventory' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" /> Live Inventory Management ({products.length} Products)
              </h2>
              <span className="text-xs font-mono text-slate-400">Real-Time Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {products.map((product) => (
                <TiltCard3D key={product.id} glowColor="teal" maxTilt={10} scale={1.02} depth={15}>
                  <div className="p-5 rounded-2xl bg-[#0d0d16] border border-white/10 flex items-center gap-4 shadow-xl">
                    <div
                      style={{ transform: 'translateZ(15px)' }}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 shrink-0 shadow-md"
                    >
                      <Package className="w-7 h-7" />
                    </div>
                    <div style={{ transform: 'translateZ(10px)' }} className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-base font-display text-white truncate">{product.name}</h3>
                      <p className="text-xs font-mono text-slate-400">₹{product.price} · {product.category}</p>
                      <p className="text-[10px] font-mono text-amber-400/80">BARCODE: {product.barcode}</p>
                    </div>
                    <div style={{ transform: 'translateZ(15px)' }} className="shrink-0">
                      <StockBadge count={product.stockCount} />
                    </div>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: Barcode Scan Terminal */}
        {activeTab === 'scan' && (
          <section className="space-y-4 max-w-xl mx-auto">
            <h2 className="text-lg font-bold font-display text-white text-center">
              Barcode Scanner Checkout Terminal
            </h2>
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-r from-teal-500/40 via-primary-500/40 to-amber-500/40 shadow-2xl">
              <div className="bg-[#0c0c14] p-6 rounded-[22px] border border-white/10 space-y-5 text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center mx-auto animate-pulse">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-display text-white">Scan or Enter Barcode</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Simulate device camera scanning by typing or pasting a product barcode.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScanLookup()}
                    placeholder="e.g. 8901234567890"
                    className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  />
                  <button
                    onClick={handleScanLookup}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(13,148,136,0.4)] hover:scale-105 transition-all"
                  >
                    Lookup &amp; Sell
                  </button>
                </div>

                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border font-mono text-xs text-left ${
                      scanResult.found
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {scanResult.found ? (
                      <div className="space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-sm text-white">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {scanResult.name}
                        </p>
                        <p>Sale logged! Price: ₹{scanResult.price} · Remaining Stock: {scanResult.stockCount - 1} units</p>
                      </div>
                    ) : (
                      <p className="flex items-center gap-1.5 font-bold">
                        <ShieldAlert className="w-4 h-4 text-rose-400" /> Barcode not found in catalog.
                      </p>
                    )}
                  </motion.div>
                )}

                <div className="text-[10px] font-mono text-slate-500">
                  Try test barcode: <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-400">8901234567890</code>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
