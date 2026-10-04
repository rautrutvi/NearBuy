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
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 12px 30px -5px rgba(224, 82, 54, 0.2)' } : {}}
      onClick={onClick}
      className={`rounded-2xl border bg-[#0d0d16]/95 border-white/10 text-white backdrop-blur-xl shadow-xl p-5 transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
