import React from 'react'
import { motion } from 'framer-motion'

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.08)' } : {}}
      onClick={onClick}
      className={`rounded-2xl border ${
        glass ? 'glass-panel' : 'bg-white border-slate-100 shadow-soft'
      } p-5 transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
