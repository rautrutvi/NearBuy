import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export const CyberCard = ({
  children,
  className = '',
  glowColor = 'primary', // 'primary' | 'teal' | 'amber' | 'violet'
  tag = 'SYS.OK',
  onClick,
}) => {
  const ref = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 180 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const glowGradients = {
    primary: 'from-primary-500 via-amber-500 to-primary-600',
    teal: 'from-safety-400 via-emerald-400 to-teal-600',
    amber: 'from-amber-400 via-orange-500 to-red-500',
    violet: 'from-violet-500 via-purple-400 to-indigo-600',
  }

  const tagColors = {
    primary: 'text-primary-400 border-primary-500/30 bg-primary-950/50',
    teal: 'text-safety-400 border-safety-500/30 bg-safety-950/50',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-950/50',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-950/50',
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group rounded-3xl p-[1.5px] transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Animated glowing border gradient */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${glowGradients[glowColor] || glowGradients.primary} opacity-30 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-500 animate-pulse-subtle`}
      />

      {/* Outer border mask */}
      <div className={`relative h-full w-full bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 overflow-hidden shadow-2xl flex flex-col justify-between`}>
        {/* Top-right cyber HUD tag */}
        {tag && (
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${tagColors[glowColor] || tagColors.primary}`}>
              [{tag}]
            </span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary-400 transition-colors" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-safety-400 transition-colors" />
            </div>
          </div>
        )}

        {/* Futuristic corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-500/50 rounded-tl-xl group-hover:border-primary-400 transition-colors" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-safety-500/50 rounded-tr-xl group-hover:border-safety-400 transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-safety-500/50 rounded-bl-xl group-hover:border-safety-400 transition-colors" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-500/50 rounded-br-xl group-hover:border-primary-400 transition-colors" />

        {/* Content elevated in 3D */}
        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
