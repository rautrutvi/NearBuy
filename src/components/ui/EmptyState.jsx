import React from 'react'
import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { Button } from './Button'

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
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-surface-50/50 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4 shadow-soft">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 font-display mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
