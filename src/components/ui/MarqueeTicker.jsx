import React from 'react'
import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Store, Umbrella, Package, Sparkles, AlertTriangle } from 'lucide-react'

const TICKER_ITEMS = [
  { text: 'MONSOON FLOOD RADAR ACTIVE', icon: ShieldCheck, color: 'text-teal-400 bg-teal-950/60 border-teal-500/40' },
  { text: '30-MIN FREE PICKUP RESERVATION', icon: Package, color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
  { text: '48 VERIFIED LOCAL SHOPS ONLINE', icon: Store, color: 'text-sky-400 bg-sky-950/60 border-sky-500/40' },
  { text: 'LIVE BARCODE SCAN TO SELL', icon: Zap, color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' },
  { text: 'RAINCOATS & UMBRELLAS IN STOCK', icon: Umbrella, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
  { text: 'COMMUNITY FLOOD ALERTS VERIFIED', icon: AlertTriangle, color: 'text-orange-400 bg-orange-950/60 border-orange-500/40' },
]

export const MarqueeTicker = () => {
  return (
    <div className="relative w-full overflow-hidden py-4 bg-slate-900 border-y border-white/10 shadow-2xl z-20">
      {/* Side gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
        className="flex items-center gap-6 whitespace-nowrap w-max"
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-bold border ${item.color} shadow-lg backdrop-blur-md hover:scale-105 transition-transform cursor-pointer`}
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
