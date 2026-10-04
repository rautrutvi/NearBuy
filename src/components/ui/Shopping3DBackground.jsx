import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Detailed 3D Shopping Bag SVG Model
const Model3DShoppingBag = ({ color = 'coral', className = '', scale = 1 }) => {
  const isTeal = color === 'teal'
  const isGold = color === 'gold'

  const bodyGradientId = `bagBody_${color}`
  const foldGradientId = `bagFold_${color}`
  const sideGradientId = `bagSide_${color}`

  const primaryStart = isTeal ? '#14b8a6' : isGold ? '#f59e0b' : '#ff6b4a'
  const primaryEnd = isTeal ? '#0f766e' : isGold ? '#d97706' : '#e05236'
  const lightTone = isTeal ? '#5eead4' : isGold ? '#fcd34d' : '#ffa085'
  const darkTone = isTeal ? '#042f2e' : isGold ? '#78350f' : '#7c2d12'
  const handleStroke = isTeal ? '#99f6e4' : isGold ? '#fef3c7' : '#fed7aa'

  return (
    <svg
      width={72 * scale}
      height={82 * scale}
      viewBox="0 0 72 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_18px_25px_rgba(0,0,0,0.6)] ${className}`}
    >
      <defs>
        <linearGradient id={bodyGradientId} x1="0" y1="20" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor={lightTone} />
          <stop offset="0.5" stopColor={primaryStart} />
          <stop offset="1" stopColor={primaryEnd} />
        </linearGradient>
        <linearGradient id={sideGradientId} x1="50" y1="20" x2="72" y2="75" gradientUnits="userSpaceOnUse">
          <stop stopColor={primaryEnd} />
          <stop offset="1" stopColor={darkTone} />
        </linearGradient>
        <linearGradient id={foldGradientId} x1="0" y1="18" x2="60" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Bag Rope Handles (Back & Front 3D Arc) */}
      <path
        d="M22 24V12C22 6.47715 26.4772 2 32 2C37.5228 2 42 6.47715 42 12V24"
        stroke={handleStroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M26 24V14C26 10.6863 28.6863 8 32 8C35.3137 8 38 10.6863 38 14V24"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* 3D Isometric Side Panel */}
      <path d="M52 24L66 18V68L52 78V24Z" fill={`url(#${sideGradientId})`} />

      {/* Main Front Bag Face */}
      <path d="M8 24L52 24V78L8 78V24Z" rx="4" fill={`url(#${bodyGradientId})`} />

      {/* Top Folded Rim Highlight */}
      <path d="M8 24H52V30H8V24Z" fill={`url(#${foldGradientId})`} />

      {/* Specular Front Sheen Line */}
      <path d="M14 30L14 72" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />

      {/* Modern Mini Nearbuy Badge on Bag */}
      <rect x="22" y="44" width="16" height="14" rx="3" fill="#ffffff" fillOpacity="0.2" />
      <path d="M26 54V48L34 54V48" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 3D Isometric Shopping Cart SVG Model
const Model3DShoppingCart = ({ scale = 1, className = '' }) => (
  <svg
    width={80 * scale}
    height={76 * scale}
    viewBox="0 0 80 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_20px_30px_rgba(13,148,136,0.35)] ${className}`}
  >
    <defs>
      <linearGradient id="cartMetallic" x1="10" y1="10" x2="70" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2dd4bf" />
        <stop offset="0.5" stopColor="#0d9488" />
        <stop offset="1" stopColor="#115e59" />
      </linearGradient>
      <linearGradient id="cartBasket" x1="15" y1="15" x2="65" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>

    {/* Items Inside Cart: Box & Bag */}
    <rect x="26" y="16" width="18" height="20" rx="3" fill="#ff7a59" transform="rotate(-8 26 16)" />
    <path d="M42 14L54 10V28L42 32V14Z" fill="#fbbf24" />

    {/* Cart Basket Wireframe */}
    <path
      d="M16 16H66L58 44H24L16 16Z"
      fill="url(#cartMetallic)"
      fillOpacity="0.45"
      stroke="#2dd4bf"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M22 26H60" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.7" />
    <path d="M25 35H55" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.7" />
    <path d="M34 16L32 44" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.7" />
    <path d="M46 16L44 44" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.7" />

    {/* Handlebar */}
    <path d="M16 16L10 8H4" stroke="#e0e7ff" strokeWidth="3.5" strokeLinecap="round" />

    {/* Chassis & Wheels */}
    <path d="M24 44L28 56H54L58 44" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="30" cy="62" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
    <circle cx="52" cy="62" r="5" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" />
  </svg>
)

// 3D Gift Box with Satin Ribbon
const Model3DGiftBox = ({ scale = 1, className = '' }) => (
  <svg
    width={64 * scale}
    height={66 * scale}
    viewBox="0 0 64 66"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_16px_25px_rgba(245,158,11,0.4)] ${className}`}
  >
    <defs>
      <linearGradient id="giftBody" x1="8" y1="20" x2="56" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0" y1="0" x2="64" y2="66" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#fef08a" />
        <stop offset="1" stopColor="#eab308" />
      </linearGradient>
    </defs>

    {/* 3D Box Body */}
    <rect x="10" y="24" width="44" height="36" rx="5" fill="url(#giftBody)" />

    {/* Lid */}
    <rect x="7" y="18" width="50" height="10" rx="3" fill="#d97706" stroke="#fbbf24" strokeWidth="1.2" />

    {/* Vertical Ribbon */}
    <rect x="28" y="18" width="8" height="42" fill="url(#ribbonGrad)" />

    {/* Horizontal Ribbon */}
    <rect x="10" y="38" width="44" height="8" fill="url(#ribbonGrad)" />

    {/* 3D Satin Bow on top */}
    <ellipse cx="26" cy="14" rx="7" ry="5" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" transform="rotate(-20 26 14)" />
    <ellipse cx="38" cy="14" rx="7" ry="5" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" transform="rotate(20 38 14)" />
    <circle cx="32" cy="15" r="3.5" fill="#ffffff" />
  </svg>
)

// 3D Monsoon Umbrella
const Model3DUmbrella = ({ scale = 1, className = '' }) => (
  <svg
    width={68 * scale}
    height={68 * scale}
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_15px_22px_rgba(224,82,54,0.45)] ${className}`}
  >
    <defs>
      <linearGradient id="umbrellaCanopy" x1="4" y1="30" x2="64" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff7a59" />
        <stop offset="0.5" stopColor="#e05236" />
        <stop offset="1" stopColor="#991b1b" />
      </linearGradient>
    </defs>
    {/* Silver Tip */}
    <path d="M34 4V10" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
    {/* Canopy Arc */}
    <path
      d="M6 34C6 18.536 18.536 8 34 8C49.464 8 62 18.536 62 34C55 31 49 34 44 31C39 34 33 31 28 34C23 31 17 34 6 34Z"
      fill="url(#umbrellaCanopy)"
    />
    <path d="M34 8Q34 22 34 32" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M34 8Q22 20 18 32" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" />
    <path d="M34 8Q46 20 50 32" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" />
    {/* Shaft & J-Hook Handle */}
    <path d="M34 32V54C34 58.4183 30.4183 62 26 62C21.5817 62 18 58.4183 18 54" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
)

// 3D Discount Tag / Pill
const Model3DDiscountPill = ({ label = '-30%', scale = 1, className = '', color = 'red' }) => (
  <div
    style={{ transform: `scale(${scale})` }}
    className={`px-3 py-1.5 rounded-2xl font-mono font-extrabold text-xs tracking-wider shadow-[0_10px_20px_rgba(0,0,0,0.5)] border flex items-center gap-1.5 select-none ${
      color === 'teal'
        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-teal-300/40 shadow-teal-500/30'
        : color === 'gold'
        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-200/50 shadow-amber-500/30'
        : 'bg-gradient-to-r from-rose-500 to-primary-600 text-white border-rose-300/40 shadow-rose-500/30'
    } ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
    <span>{label}</span>
  </div>
)

// 3D Floating Gold Coin
const Model3DGoldCoin = ({ scale = 1, className = '' }) => (
  <svg
    width={36 * scale}
    height={36 * scale}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_8px_16px_rgba(245,158,11,0.5)] ${className}`}
  >
    <circle cx="18" cy="18" r="16" fill="url(#coinGrad)" stroke="#fef08a" strokeWidth="2" />
    <circle cx="18" cy="18" r="11" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
    <text x="18" y="23" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">₹</text>
    <defs>
      <linearGradient id="coinGrad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
)

export const Shopping3DBackground = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Subtle physics springs for smooth parallax drift
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2)
      mouseX.set(x * 25)
      mouseY.set(y * 25)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 3D Atmospheric Radial Studio Lighting Podiums */}
      <div className="absolute -top-32 left-1/4 w-[750px] h-[550px] bg-gradient-to-br from-primary-500/18 via-amber-500/12 to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-24 w-[650px] h-[650px] bg-gradient-to-bl from-teal-500/18 via-cyan-500/10 to-transparent rounded-full blur-[150px]" />
      <div className="absolute -bottom-32 left-1/6 w-[700px] h-[600px] bg-gradient-to-tr from-violet-600/15 via-primary-600/10 to-transparent rounded-full blur-[160px]" />

      {/* 3D Floor Podium Rings (Like 3D E-Commerce Product Stages) */}
      <div className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-[1000px] h-[340px] border border-teal-500/15 rounded-full opacity-40 [transform:rotateX(75deg)]" />
      <div className="absolute bottom-[-130px] left-1/2 -translate-x-1/2 w-[780px] h-[260px] border border-primary-500/20 rounded-full opacity-50 [transform:rotateX(75deg)]" />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[520px] h-[180px] border-2 border-amber-400/25 rounded-full opacity-60 [transform:rotateX(75deg)] shadow-[0_0_80px_rgba(245,158,11,0.2)]" />

      {/* LAYER 1: Deep Background Isometric Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* LAYER 2: Floating 3D Shopping Elements with Staggered Motion & Parallax */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Item 1: Large Glossy Coral Shopping Bag (Top-Left) */}
        <motion.div
          animate={{ y: [-14, 14, -14], rotate: [-6, 4, -6] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-20 left-[4%] lg:left-[6%] opacity-85 hover:opacity-100"
        >
          <Model3DShoppingBag color="coral" scale={1.25} />
        </motion.div>

        {/* Item 2: Mint/Teal Shopping Bag with 3D Fold (Top-Right) */}
        <motion.div
          animate={{ y: [16, -16, 16], rotate: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-28 right-[5%] lg:right-[8%] opacity-80"
        >
          <Model3DShoppingBag color="teal" scale={1.15} />
        </motion.div>

        {/* Item 3: 3D Shopping Cart with Items (Mid-Left Floating) */}
        <motion.div
          animate={{ y: [-18, 18, -18], rotate: [-4, 6, -4] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[48%] left-[2%] lg:left-[4%] opacity-85"
        >
          <Model3DShoppingCart scale={1.15} />
        </motion.div>

        {/* Item 4: 3D Gift Box with Golden Ribbons (Mid-Right Floating) */}
        <motion.div
          animate={{ y: [14, -14, 14], rotate: [8, -4, 8] }}
          transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[44%] right-[3%] lg:right-[5%] opacity-85"
        >
          <Model3DGiftBox scale={1.2} />
        </motion.div>

        {/* Item 5: 3D Monsoon Umbrella (Floating High Mid-Left) */}
        <motion.div
          animate={{ y: [-12, 12, -12], rotate: [12, -8, 12] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.8 }}
          className="absolute top-36 left-[18%] opacity-75 hidden md:block"
        >
          <Model3DUmbrella scale={1.1} />
        </motion.div>

        {/* Item 6: Golden Shopping Bag (Lower-Right) */}
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [-8, 6, -8] }}
          transition={{ repeat: Infinity, duration: 6.8, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-28 right-[7%] lg:right-[10%] opacity-80"
        >
          <Model3DShoppingBag color="gold" scale={1.2} />
        </motion.div>

        {/* Item 7: 3D Shopping Cart & Boxes (Lower-Left) */}
        <motion.div
          animate={{ y: [15, -15, 15], rotate: [6, -6, 6] }}
          transition={{ repeat: Infinity, duration: 8.5, ease: 'easeInOut', delay: 1.2 }}
          className="absolute bottom-32 left-[5%] lg:left-[8%] opacity-80"
        >
          <Model3DShoppingBag color="coral" scale={0.95} />
        </motion.div>

        {/* Floating 3D Discount Badges */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [-10, 8, -10] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.3 }}
          className="absolute top-48 left-[11%] opacity-90 hidden sm:block"
        >
          <Model3DDiscountPill label="50% OFF" color="gold" scale={1.1} />
        </motion.div>

        <motion.div
          animate={{ y: [12, -12, 12], rotate: [6, -8, 6] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.8 }}
          className="absolute top-44 right-[16%] opacity-90 hidden sm:block"
        >
          <Model3DDiscountPill label="30-MIN HOLD" color="teal" scale={1.05} />
        </motion.div>

        <motion.div
          animate={{ y: [-14, 14, -14], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: 'easeInOut', delay: 2.2 }}
          className="absolute bottom-52 left-[14%] opacity-85 hidden sm:block"
        >
          <Model3DDiscountPill label="LIVE RADAR" color="red" scale={1} />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10], rotate: [8, -6, 8] }}
          transition={{ repeat: Infinity, duration: 5.8, ease: 'easeInOut', delay: 1.1 }}
          className="absolute bottom-44 right-[15%] opacity-85 hidden sm:block"
        >
          <Model3DDiscountPill label="VERIFIED SHOPS" color="teal" scale={1} />
        </motion.div>

        {/* Floating 3D Golden Coins */}
        <motion.div
          animate={{ y: [-16, 16, -16], rotate: [0, 360] }}
          transition={{
            y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' },
            rotate: { repeat: Infinity, duration: 18, ease: 'linear' },
          }}
          className="absolute top-28 left-[28%] opacity-80 hidden lg:block"
        >
          <Model3DGoldCoin scale={1.15} />
        </motion.div>

        <motion.div
          animate={{ y: [14, -14, 14], rotate: [360, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 1 },
            rotate: { repeat: Infinity, duration: 20, ease: 'linear' },
          }}
          className="absolute top-64 right-[25%] opacity-75 hidden lg:block"
        >
          <Model3DGoldCoin scale={0.95} />
        </motion.div>

        <motion.div
          animate={{ y: [-12, 12, -12], rotate: [0, 360] }}
          transition={{
            y: { repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 2 },
            rotate: { repeat: Infinity, duration: 16, ease: 'linear' },
          }}
          className="absolute bottom-60 right-[22%] opacity-80 hidden lg:block"
        >
          <Model3DGoldCoin scale={1.25} />
        </motion.div>

        <motion.div
          animate={{ y: [18, -18, 18], rotate: [360, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 0.6 },
            rotate: { repeat: Infinity, duration: 22, ease: 'linear' },
          }}
          className="absolute bottom-36 left-[22%] opacity-70 hidden lg:block"
        >
          <Model3DGoldCoin scale={1} />
        </motion.div>
      </motion.div>
    </div>
  )
}
