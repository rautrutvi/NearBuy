import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Store, Umbrella, Package, AlertTriangle } from 'lucide-react'

const TICKER_ITEMS = [
  { text: 'MONSOON FLOOD RADAR ACTIVE', icon: ShieldCheck, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { text: '30-MIN FREE PICKUP RESERVATION', icon: Package, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { text: '48 VERIFIED LOCAL SHOPS ONLINE', icon: Store, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { text: 'LIVE BARCODE SCAN TO SELL', icon: Zap, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { text: 'RAINCOATS & UMBRELLAS IN STOCK', icon: Umbrella, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { text: 'COMMUNITY FLOOD ALERTS VERIFIED', icon: AlertTriangle, color: 'text-orange-700 bg-orange-50 border-orange-200' },
]

export const MarqueeTicker = () => {
  return (
    <div className="relative w-full overflow-hidden py-4 bg-white/90 backdrop-blur-md border-y border-slate-200 shadow-soft z-20">
      {/* Side gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="flex items-center gap-6 whitespace-nowrap w-max"
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold border ${item.color} shadow-sm hover:scale-105 transition-transform cursor-pointer`}
            >
              <Icon className="w-4 h-4 animate-pulse" />
              <span>{item.text}</span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
