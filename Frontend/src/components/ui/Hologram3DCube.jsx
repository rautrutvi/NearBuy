import React, { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { Store, ShieldCheck, Zap, Radio, Sparkles } from 'lucide-react'

export const Hologram3DCube = ({ size = 160 }) => {
  const containerRef = useRef(null)
  const half = size / 2

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.4
    const y = (e.clientY - (rect.top + rect.height / 2)) * -0.4
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const faces = [
    { label: 'NEARBUY CORE', icon: Store, transform: `translateZ(${half}px)`, color: 'border-primary-500/50 bg-primary-950/40 text-primary-400' },
    { label: '30-MIN HOLD', icon: Zap, transform: `rotateY(180deg) translateZ(${half}px)`, color: 'border-amber-500/50 bg-amber-950/40 text-amber-400' },
    { label: 'RADAR GRID', icon: Radio, transform: `rotateY(-90deg) translateZ(${half}px)`, color: 'border-teal-500/50 bg-teal-950/40 text-teal-400' },
    { label: 'VERIFIED SHOPS', icon: ShieldCheck, transform: `rotateY(90deg) translateZ(${half}px)`, color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400' },
    { label: 'LIVE STOCK', icon: Sparkles, transform: `rotateX(90deg) translateZ(${half}px)`, color: 'border-violet-500/50 bg-violet-950/40 text-violet-400' },
    { label: 'SECURE FLOW', icon: ShieldCheck, transform: `rotateX(-90deg) translateZ(${half}px)`, color: 'border-sky-500/50 bg-sky-950/40 text-sky-400' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center p-8 select-none"
      style={{ perspective: 1000 }}
    >
      {/* Ambient Floor Glow */}
      <div
        className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-primary-500/20 via-teal-500/20 to-amber-500/20 blur-2xl pointer-events-none"
        style={{ transform: 'rotateX(80deg) translateZ(-60px)' }}
      />

      {/* 3D Rotating Isometric Hologram Stage */}
      <motion.div
        animate={{
          rotateY: [0, 360],
          rotateX: [20, 35, 20],
        }}
        transition={{
          rotateY: { repeat: Infinity, duration: 22, ease: 'linear' },
          rotateX: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
        }}
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          x: springX,
          y: springY,
        }}
        className="relative"
      >
        {faces.map((face, idx) => {
          const Icon = face.icon
          return (
            <div
              key={idx}
              style={{
                width: size,
                height: size,
                transform: face.transform,
              }}
              className={`absolute inset-0 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center shadow-2xl transition-colors ${face.color}`}
            >
              {/* Corner Sci-Fi Crosshairs */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-current opacity-70" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-current opacity-70" />
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-current opacity-70" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-current opacity-70" />

              <Icon className="w-8 h-8 mb-2 drop-shadow-[0_0_8px_currentColor]" />
              <span className="text-[10px] font-mono font-bold tracking-widest leading-tight uppercase">
                {face.label}
              </span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
