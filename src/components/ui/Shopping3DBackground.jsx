import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const Shopping3DBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  // Smooth multi-depth spring physics for full-screen 3D parallax drift
  const springFastX = useSpring(mouseX, { stiffness: 45, damping: 20 })
  const springFastY = useSpring(mouseY, { stiffness: 45, damping: 20 })

  const springMidX = useSpring(mouseX, { stiffness: 30, damping: 25 })
  const springMidY = useSpring(mouseY, { stiffness: 30, damping: 25 })

  const springSlowX = useSpring(mouseX, { stiffness: 18, damping: 30 })
  const springSlowY = useSpring(mouseY, { stiffness: 18, damping: 30 })

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
          opacity: 0.32,
        }}
      />

      {/* 2. CINEMATIC GRADIENT LIGHTING & VIGNETTE (Keeps central text crisp and readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080614]/88 via-[#080614]/65 to-[#080614]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080614_80%)]" />

      {/* 3. DYNAMIC INTERACTIVE CURSOR SPOTLIGHT */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          left: cursorPos.x - 325,
          top: cursorPos.y - 325,
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(255,94,54,0.10) 45%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* 4. AMBIENT PURPLE, LAVENDER & ORANGE GLOW SPOTLIGHTS */}
      <div className="absolute top-10 left-[12%] w-[550px] h-[400px] bg-purple-600/22 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[500px] h-[450px] bg-primary-500/18 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-[22%] w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* 5. FULL-SCREEN 3D FLOATING SHOPPING OBJECTS (100% True Transparent PNGs Distributed Across Entire Screen) */}
      
      {/* NODE 1: Coral Shopping Bag (Top-Left Outer) */}
      <motion.div
        style={{ x: springFastX, y: springFastY }}
        animate={{ y: [-15, 15, -15], rotate: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
        className="absolute top-16 left-[2%] lg:left-[3%] w-36 h-36 md:w-48 md:h-48 z-10 pointer-events-none"
      >
        <img
          src="/images/item_bag.png"
          alt="3D Shopping Bag"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>

      {/* NODE 2: Purple Luxury Bag (Top-Center-Left) */}
      <motion.div
        style={{ x: springSlowX, y: springSlowY }}
        animate={{ y: [12, -12, 12], rotate: [4, -6, 4] }}
        transition={{ repeat: Infinity, duration: 7.8, ease: 'easeInOut', delay: 0.4 }}
        className="absolute top-10 left-[26%] md:left-[30%] w-24 h-24 md:w-32 md:h-32 z-1 pointer-events-none opacity-60 filter blur-[0.5px]"
      >
        <img
          src="/images/item_purple_bag.png"
          alt="3D Purple Bag"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.75)]"
        />
      </motion.div>

      {/* NODE 3: Golden Satin Gift Box (Top-Center-Right) */}
      <motion.div
        style={{ x: springMidX, y: springMidY }}
        animate={{ y: [-14, 14, -14], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut', delay: 1.1 }}
        className="absolute top-12 right-[24%] md:right-[28%] w-28 h-28 md:w-36 md:h-36 z-2 pointer-events-none opacity-70"
      >
        <img
          src="/images/item_gift.png"
          alt="3D Gift Box"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        />
      </motion.div>

      {/* NODE 4: Red Monsoon Umbrella (Top-Right Outer) */}
      <motion.div
        style={{ x: springFastX, y: springFastY }}
        animate={{ y: [16, -16, 16], rotate: [7, -7, 7] }}
        transition={{ repeat: Infinity, duration: 7.2, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-20 right-[2%] lg:right-[4%] w-36 h-36 md:w-48 md:h-48 z-10 pointer-events-none"
      >
        <img
          src="/images/item_umbrella.png"
          alt="3D Monsoon Umbrella"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>

      {/* NODE 5: Chrome Supermarket Shopping Cart (Mid-Left Outer) */}
      <motion.div
        style={{ x: springMidX, y: springMidY }}
        animate={{ y: [-18, 18, -18], rotate: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[42%] -left-3 lg:left-[2%] w-44 h-44 md:w-56 md:h-56 z-10 pointer-events-none"
      >
        <img
          src="/images/item_cart.png"
          alt="3D Shopping Cart"
          className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.9)]"
        />
      </motion.div>

      {/* NODE 6: Cardboard Delivery Box (Mid-Center-Left) */}
      <motion.div
        style={{ x: springSlowX, y: springSlowY }}
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 6.9, ease: 'easeInOut', delay: 1.8 }}
        className="absolute top-[38%] left-[20%] md:left-[22%] w-24 h-24 md:w-32 md:h-32 z-1 pointer-events-none opacity-55 filter blur-[0.5px]"
      >
        <img
          src="/images/item_box.png"
          alt="3D Delivery Box"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
        />
      </motion.div>

      {/* NODE 7: Rupee Golden Coins Stack (Mid-Center-Right) */}
      <motion.div
        style={{ x: springSlowX, y: springSlowY }}
        animate={{ y: [-12, 12, -12], rotate: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.9 }}
        className="absolute top-[46%] right-[20%] md:right-[23%] w-24 h-24 md:w-32 md:h-32 z-1 pointer-events-none opacity-60 filter blur-[0.5px]"
      >
        <img
          src="/images/item_coins.png"
          alt="3D Golden Coins"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
        />
      </motion.div>

      {/* NODE 8: Purple Luxury Bag (Mid-Right Outer) */}
      <motion.div
        style={{ x: springFastX, y: springFastY }}
        animate={{ y: [14, -14, 14], rotate: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 7.6, ease: 'easeInOut', delay: 1.4 }}
        className="absolute top-[44%] right-[1%] lg:right-[3%] w-40 h-40 md:w-52 md:h-52 z-10 pointer-events-none"
      >
        <img
          src="/images/item_purple_bag.png"
          alt="3D Purple Bag"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>

      {/* NODE 9: Coral Shopping Bag (Lower-Left Outer) */}
      <motion.div
        style={{ x: springMidX, y: springMidY }}
        animate={{ y: [15, -15, 15], rotate: [6, -6, 6] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1.2 }}
        className="absolute bottom-24 left-[4%] lg:left-[8%] w-32 h-32 md:w-44 md:h-44 z-10 pointer-events-none hidden sm:block"
      >
        <img
          src="/images/item_bag.png"
          alt="3D Shopping Bag"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>

      {/* NODE 10: Cardboard Delivery Parcel Box (Lower-Center-Left) */}
      <motion.div
        style={{ x: springSlowX, y: springSlowY }}
        animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 6.4, ease: 'easeInOut', delay: 2.1 }}
        className="absolute bottom-16 left-[28%] md:left-[32%] w-24 h-24 md:w-32 md:h-32 z-1 pointer-events-none opacity-60 hidden md:block"
      >
        <img
          src="/images/item_box.png"
          alt="3D Delivery Box"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
        />
      </motion.div>

      {/* NODE 11: Rupee Golden Coins Stack (Lower-Center-Right) */}
      <motion.div
        style={{ x: springSlowX, y: springSlowY }}
        animate={{ y: [12, -12, 12], rotate: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 7.1, ease: 'easeInOut', delay: 1.7 }}
        className="absolute bottom-20 right-[28%] md:right-[32%] w-24 h-24 md:w-32 md:h-32 z-1 pointer-events-none opacity-65 hidden md:block"
      >
        <img
          src="/images/item_coins.png"
          alt="3D Coins"
          className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.75)]"
        />
      </motion.div>

      {/* NODE 12: Golden Satin Gift Box (Lower-Right Outer) */}
      <motion.div
        style={{ x: springFastX, y: springFastY }}
        animate={{ y: [-12, 12, -12], rotate: [-8, 6, -8] }}
        transition={{ repeat: Infinity, duration: 6.8, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 right-[5%] lg:right-[9%] w-32 h-32 md:w-44 md:h-44 z-10 pointer-events-none hidden sm:block"
      >
        <img
          src="/images/item_gift.png"
          alt="3D Gift Box"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>

      {/* 6. FLOATING GLASS PROMO PILLS & BADGES */}
      <motion.div
        style={{ x: springFastX, y: springFastY }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Floating 3D Sale Badge 1 */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
          className="absolute top-36 left-[16%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181126]/85 backdrop-blur-xl border border-primary-500/40 shadow-[0_10px_25px_rgba(255,94,54,0.3)] text-xs font-mono font-bold text-primary-300"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping" />
          <span>30-MIN PICKUP</span>
        </motion.div>

        {/* Floating 3D Sale Badge 2 */}
        <motion.div
          animate={{ y: [12, -12, 12], rotate: [4, -4, 4] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-44 right-[18%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#19102b]/85 backdrop-blur-xl border border-purple-500/40 shadow-[0_10px_25px_rgba(168,85,247,0.35)] text-xs font-mono font-bold text-purple-300"
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

      {/* 7. GLOWING FLOOR STAGE RIMS (Purple & Orange Pedestal on Ground) */}
      <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[950px] h-[280px] border border-purple-500/30 rounded-full opacity-40 [transform:rotateX(78deg)] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[200px] border-2 border-primary-500/30 rounded-full opacity-50 [transform:rotateX(78deg)] shadow-[0_0_80px_rgba(168,85,247,0.4)] pointer-events-none" />
    </div>
  )
}
