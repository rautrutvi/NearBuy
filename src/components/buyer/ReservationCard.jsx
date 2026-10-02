import React from 'react'
import { Card } from '../ui/Card'
import { ProgressTracker } from '../ui/ProgressTracker'
import { ShoppingBag, Store, ShieldCheck, QrCode } from 'lucide-react'

export const ReservationCard = ({ reservation }) => {
  return (
    <Card hoverEffect={false} className="border-l-4 border-l-primary-500 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Pickup Code: {reservation.verificationCode}</span>
          <h4 className="text-base font-bold font-display text-slate-900">{reservation.productName}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Store className="w-3.5 h-3.5 text-primary-500" /> {reservation.shopName}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Payable</span>
          <span className="text-lg font-extrabold text-slate-900 font-display">₹{reservation.totalPrice}</span>
        </div>
      </div>

      {/* Animated Step Tracker */}
      <ProgressTracker currentStep={reservation.status} />

      <div className="bg-surface-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Show code at store counter
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border text-slate-900 font-bold">
          {reservation.verificationCode}
        </span>
      </div>
    </Card>
  )
}
