import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const Shopping3DBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  // Smooth spring physics for fluid 3D parallax drift
  const springX = useSpring(mouseX, { stiffness: 45, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 45, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2)
      mouseX.set(x * 20)
      mouseY.set(y * 20)
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. PHOTOREALISTIC 3D SHOPPING BACKDROP LAYER */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out scale-105"
        style={{
          backgroundImage: `url('/images/shopping_3d_backdrop.jpg')`,
          opacity: 0.42,
        }}
      />

      {/* 2. CINEMATIC GRADIENT LIGHTING & VIGNETTE (Keeps text ultra legible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060c]/85 via-[#06060c]/65 to-[#06060c]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06060c_85%)]" />

      {/* 3. DYNAMIC INTERACTIVE CURSOR SPOTLIGHT */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          left: cursorPos.x - 300,
          top: cursorPos.y - 300,
          background: 'radial-gradient(circle, rgba(224,82,54,0.12) 0%, rgba(13,148,136,0.06) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 4. WARM RETAIL & MONSOON AMBIENT GLOWS */}
      <div className="absolute top-10 left-[10%] w-[550px] h-[400px] bg-primary-500/15 rounded-full blur-[140px]" />
      <div className="absolute top-[35%] right-[8%] w-[500px] h-[450px] bg-teal-500/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-10 left-[20%] w-[600px] h-[350px] bg-amber-500/12 rounded-full blur-[160px]" />

      {/* 5. PARALLAX FLOATING 3D INTERACTIVE ELEMENTS */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Floating 3D Sale Badge 1 (Left Upper) */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-28 left-[6%] hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#121220]/80 backdrop-blur-xl border border-primary-500/30 shadow-[0_12px_28px_rgba(224,82,54,0.3)]"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-ping" />
          <span className="font-mono text-xs font-bold text-white tracking-wide">30-MIN PICKUP ACTIVE</span>
        </motion.div>

        {/* Floating 3D Sale Badge 2 (Right Upper) */}
        <motion.div
          animate={{ y: [12, -12, 12], rotate: [5, -3, 5] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-36 right-[7%] hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0f1924]/85 backdrop-blur-xl border border-teal-500/30 shadow-[0_12px_28px_rgba(13,148,136,0.3)]"
        >
          <span className="text-teal-400 font-bold text-sm">☔</span>
          <span className="font-mono text-xs font-bold text-teal-300 tracking-wide">MONSOON RADAR VERIFIED</span>
        </motion.div>

        {/* Floating 3D Discount Tag 3 (Left Lower) */}
        <motion.div
          animate={{ y: [-14, 14, -14], rotate: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-40 left-[8%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#1e130b]/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_10px_24px_rgba(245,158,11,0.25)]"
        >
          <span className="text-amber-400 font-extrabold text-xs">★ 4.9 RATING</span>
          <span className="text-slate-400 text-[10px] font-mono">1,400+ Orders</span>
        </motion.div>

        {/* Floating 3D Badge 4 (Right Lower) */}
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-36 right-[8%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#140f26]/85 backdrop-blur-xl border border-violet-500/30 shadow-[0_10px_24px_rgba(139,92,246,0.25)]"
        >
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-violet-300">LIVE INVENTORY SYNCED</span>
        </motion.div>

        {/* Subtle Shimmering Particles / Rain Mist Sparkles */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
              style={{
                left: `${(i * 19 + 7) % 96}%`,
                top: `${(i * 23 + 11) % 92}%`,
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.5, 0.8],
                y: [-8, 8, -8],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + (i % 4),
                delay: (i * 0.35) % 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* 6. GLOWING FLOOR STAGE RIMS (Simulating the 3D studio pedestal) */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[900px] h-[260px] border border-teal-500/20 rounded-full opacity-40 [transform:rotateX(78deg)] pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[650px] h-[180px] border-2 border-primary-500/25 rounded-full opacity-50 [transform:rotateX(78deg)] shadow-[0_0_60px_rgba(224,82,54,0.3)] pointer-events-none" />
    </div>
  )
}
