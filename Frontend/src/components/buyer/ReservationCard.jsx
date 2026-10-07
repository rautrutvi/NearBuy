import React from 'react'
import { ProgressTracker } from '../ui/ProgressTracker'
import { ShoppingBag, Store, ShieldCheck, Terminal } from 'lucide-react'

export const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-[#0c0c16] rounded-2xl p-5 border border-white/10 border-l-4 border-l-primary-500 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono text-amber-400 font-bold flex items-center gap-1 mb-1">
            <Terminal className="w-3 h-3" /> VERIFICATION CODE: {reservation.verificationCode}
          </span>
          <h4 className="text-base font-bold font-display text-white">{reservation.productName}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
            <Store className="w-3.5 h-3.5 text-teal-400" /> {reservation.shopName}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 block">Total Payable</span>
          <span className="text-xl font-extrabold text-amber-400 font-display">₹{reservation.totalPrice}</span>
        </div>
      </div>

      {/* Animated Step Tracker */}
      <ProgressTracker currentStep={reservation.status} />

      <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Show code at store counter
        </span>
        <span className="font-mono bg-black/60 px-3 py-1 rounded-lg border border-amber-500/40 text-amber-400 font-bold tracking-widest">
          {reservation.verificationCode}
        </span>
      </div>
    </div>
  )
}
