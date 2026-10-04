import React from 'react'
import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'

export const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'Nothing found around here',
  description = 'Try searching in a different radius or check back once local shops update their stock.',
  actionLabel = 'Explore Nearby Shops',
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center p-10 text-center rounded-3xl border-2 border-dashed border-white/10 bg-[#0d0d16]/80 text-white ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white font-display mb-1.5">{title}</h3>
      <p className="text-xs font-mono text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(224,82,54,0.4)] hover:scale-105 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
