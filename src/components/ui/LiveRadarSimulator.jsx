import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StockBadge, FloodBadge } from './Badge'
import { Store, MapPin, QrCode, ShieldAlert, CheckCircle2, Umbrella, Package, Search } from 'lucide-react'

export const LiveRadarSimulator = () => {
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'stock' | 'barcode'

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-r from-primary-500 via-teal-400 to-amber-500 shadow-2xl overflow-hidden max-w-xl mx-auto">
      {/* Outer Card Wrapper */}
      <div className="bg-slate-950/95 backdrop-blur-2xl p-6 rounded-[22px] border border-white/10 text-white space-y-5">

        {/* Card Header with Live Selector */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-200">LIVE INTERACTIVE RADAR</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
            {[
              { id: 'map', label: 'Flood Radar' },
              { id: 'stock', label: 'Live Stock' },
              { id: 'barcode', label: 'Scan to Sell' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">

          {/* TAB 1: Flood Radar View */}
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <div className="relative h-48 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center p-4">
                {/* Simulated Radar Circles */}
                <div className="absolute w-36 h-36 rounded-full border border-teal-500/20 animate-ping" />
                <div className="absolute w-64 h-64 rounded-full border border-teal-500/10" />

                {/* Simulated Shop Pins */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-8 left-12 bg-slate-950/90 border border-emerald-500/50 p-2 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Sharma Kirana (Safe)
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-10 right-10 bg-slate-950/90 border border-amber-500/50 p-2 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Green Medical (Watch)
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-16 right-16 bg-slate-950/90 border border-rose-500/50 p-2 rounded-xl text-[10px] font-mono flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Subhash Underpass (Alert 45cm)
                </motion.div>

                <div className="text-center z-10 pointer-events-none">
                  <MapPin className="w-8 h-8 text-teal-400 mx-auto mb-1 animate-bounce" />
                  <p className="text-xs font-mono font-bold text-white">Interactive OpenStreetMap Radar</p>
                  <p className="text-[10px] text-slate-400">Click shops to check stock &amp; safe detours</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Live Stock View */}
          {activeTab === 'stock' && (
            <motion.div
              key="stock"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-2"
            >
              {[
                { name: 'Windproof Large Umbrella', shop: 'Sharma Kirana', price: 349, count: 14, tag: 'safe' },
                { name: 'Kolam Raw Rice 5kg', shop: 'Green Grocery', price: 320, count: 8, tag: 'watch' },
              ].map((prod) => (
                <div key={prod.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10 text-xs">
                  <div>
                    <h5 className="font-bold text-white font-display">{prod.name}</h5>
                    <p className="text-[10px] text-slate-400">{prod.shop} · ₹{prod.price}</p>
                  </div>
                  <StockBadge count={prod.count} />
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 3: Barcode Scan View */}
          {activeTab === 'barcode' && (
            <motion.div
              key="barcode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-3"
            >
              <QrCode className="w-10 h-10 text-teal-400 mx-auto animate-pulse" />
              <div>
                <p className="text-xs font-mono font-bold text-white">Camera Barcode Scanner</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Scan product barcodes at counter to deduct stock automatically.</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-white/10 text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Barcode 8901234567890 Scanned!
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
