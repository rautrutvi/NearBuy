import React from 'react'
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react'

export const StockBadge = ({ count }) => {
  if (count <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        Out of Stock
      </span>
    )
  }

  if (count <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        Only {count} Left!
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)] backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
      {count} in Stock
    </span>
  )
}

export const FloodBadge = ({ level = 'safe', label }) => {
  const configs = {
    safe: {
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: ShieldCheck,
      text: label || 'Normal Safe Zone',
    },
    watch: {
      bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
      text: label || 'Waterlogging Watch',
    },
    alert: {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse',
      icon: ShieldAlert,
      text: label || 'Severe Flood Hazard',
    },
  }

  const config = configs[level] || configs.safe
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${config.bg}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.text}</span>
    </span>
  )
}

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-900 text-slate-300 border-white/10',
    primary: 'bg-primary-950 text-primary-300 border-primary-500/40',
    safety: 'bg-teal-950 text-teal-300 border-teal-500/40',
    success: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-950 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950 text-rose-300 border-rose-500/40',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
