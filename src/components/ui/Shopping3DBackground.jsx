import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const Shopping3DBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  // Spring physics for smooth, organic 3D parallax drift
  const springXFast = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springYFast = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const springXSlow = useSpring(mouseX, { stiffness: 25, damping: 30 })
  const springYSlow = useSpring(mouseY, { stiffness: 25, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2)
      mouseX.set(x * 25)
      mouseY.set(y * 25)
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. ATMOSPHERIC 3D BOUTIQUE STREET WALLPAPER BASE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out scale-105"
        style={{
          backgroundImage: `url('/images/shopping_3d_backdrop.jpg')`,
          opacity: 0.38,
        }}
      />

      {/* 2. CINEMATIC GRADIENT LIGHTING & VIGNETTE (Preserves high readability for text) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06060c]/85 via-[#06060c]/60 to-[#06060c]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06060c_80%)]" />

      {/* 3. DYNAMIC INTERACTIVE CURSOR SPOTLIGHT */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          left: cursorPos.x - 300,
          top: cursorPos.y - 300,
          background: 'radial-gradient(circle, rgba(224,82,54,0.14) 0%, rgba(13,148,136,0.07) 45%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 4. REAL FLOATING 3D SHOPPING OBJECTS (Photorealistic Renders) */}
      
      {/* ITEM 1: Photorealistic Glossy Coral Shopping Bag (Top-Left) */}
      <motion.div
        style={{ x: springXFast, y: springYFast }}
        animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
        className="absolute top-20 left-[2%] lg:left-[4%] w-36 h-36 md:w-48 md:h-48 z-10"
      >
        <img
          src="/images/item_bag.jpg"
          alt="3D Shopping Bag"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_35px_rgba(224,82,54,0.4)] opacity-90 hover:opacity-100"
        />
      </motion.div>

      {/* ITEM 2: Photorealistic 3D Golden Gift Box (Top-Right) */}
      <motion.div
        style={{ x: springXSlow, y: springYSlow }}
        animate={{ y: [16, -16, 16], rotate: [6, -4, 6] }}
        transition={{ repeat: Infinity, duration: 7.2, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-24 right-[2%] lg:right-[5%] w-36 h-36 md:w-44 md:h-44 z-10"
      >
        <img
          src="/images/item_gift.jpg"
          alt="3D Gift Box"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_35px_rgba(245,158,11,0.4)] opacity-85"
        />
      </motion.div>

      {/* ITEM 3: Photorealistic 3D Chrome Shopping Cart (Mid-Left Floating) */}
      <motion.div
        style={{ x: springXSlow, y: springYSlow }}
        animate={{ y: [-18, 18, -18], rotate: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[45%] -left-4 lg:left-[2%] w-44 h-44 md:w-56 md:h-56 z-10"
      >
        <img
          src="/images/item_cart.jpg"
          alt="3D Shopping Cart"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_25px_40px_rgba(13,148,136,0.35)] opacity-85"
        />
      </motion.div>

      {/* ITEM 4: Photorealistic 3D Monsoon Umbrella (Mid-Right Floating) */}
      <motion.div
        style={{ x: springXFast, y: springYFast }}
        animate={{ y: [14, -14, 14], rotate: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 7.8, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-[42%] right-[1%] lg:right-[4%] w-40 h-40 md:w-52 md:h-52 z-10"
      >
        <img
          src="/images/item_umbrella.jpg"
          alt="3D Monsoon Umbrella"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_20px_35px_rgba(224,82,54,0.4)] opacity-85"
        />
      </motion.div>

      {/* ITEM 5: Secondary Floating Gift Box (Lower-Right) */}
      <motion.div
        style={{ x: springXFast, y: springYFast }}
        animate={{ y: [-12, 12, -12], rotate: [-8, 6, -8] }}
        transition={{ repeat: Infinity, duration: 6.8, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-24 right-[8%] lg:right-[12%] w-28 h-28 md:w-36 md:h-36 z-10 hidden sm:block"
      >
        <img
          src="/images/item_gift.jpg"
          alt="3D Gift Box Small"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_15px_30px_rgba(245,158,11,0.35)] opacity-75"
        />
      </motion.div>

      {/* ITEM 6: Secondary Floating Shopping Bag (Lower-Left) */}
      <motion.div
        style={{ x: springXSlow, y: springYSlow }}
        animate={{ y: [15, -15, 15], rotate: [6, -6, 6] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1.2 }}
        className="absolute bottom-28 left-[6%] lg:left-[10%] w-32 h-32 md:w-40 md:h-40 z-10 hidden sm:block"
      >
        <img
          src="/images/item_bag.jpg"
          alt="3D Shopping Bag Small"
          className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_15px_30px_rgba(224,82,54,0.35)] opacity-75"
        />
      </motion.div>

      {/* 5. FLOATING GLASS PROMO PILLS & BADGES */}
      <motion.div
        style={{ x: springXFast, y: springYFast }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Floating 3D Sale Badge 1 */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
          className="absolute top-36 left-[16%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121220]/80 backdrop-blur-xl border border-primary-500/40 shadow-[0_10px_25px_rgba(224,82,54,0.3)] text-xs font-mono font-bold text-primary-300"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping" />
          <span>30-MIN PICKUP</span>
        </motion.div>

        {/* Floating 3D Sale Badge 2 */}
        <motion.div
          animate={{ y: [12, -12, 12], rotate: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-44 right-[18%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f1924]/85 backdrop-blur-xl border border-teal-500/40 shadow-[0_10px_25px_rgba(13,148,136,0.3)] text-xs font-mono font-bold text-teal-300"
        >
          <span>☔</span>
          <span>RADAR SAFE</span>
        </motion.div>

        {/* Shimmering Mist & Sparkles */}
        <div className="absolute inset-0 opacity-35">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/80"
              style={{
                left: `${(i * 21 + 9) % 95}%`,
                top: `${(i * 19 + 7) % 90}%`,
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.7, 1.4, 0.7],
                y: [-10, 10, -10],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.5 + (i % 3),
                delay: (i * 0.4) % 2.5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* 6. GLOWING FLOOR STAGE RIMS (Simulating the 3D studio pedestal on the ground) */}
      <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[950px] h-[280px] border border-teal-500/20 rounded-full opacity-40 [transform:rotateX(78deg)] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[200px] border-2 border-primary-500/25 rounded-full opacity-50 [transform:rotateX(78deg)] shadow-[0_0_70px_rgba(224,82,54,0.35)] pointer-events-none" />
    </div>
  )
}
