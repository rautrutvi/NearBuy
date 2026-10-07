import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Happy Blue Shopping Bag Character SVG (Original Vecteezy-style Happy Blue Character)
const HappyBlueShoppingBagCharacter = ({ isHovered, isClicking }) => (
  <svg
    width="46"
    height="50"
    viewBox="0 0 46 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
    className="pointer-events-none select-none drop-shadow-[0_8px_18px_rgba(37,99,235,0.55)]"
  >
    <defs>
      {/* Vibrant Sky Blue & Electric Royal Blue Bag Body Gradient */}
      <linearGradient id="blueBagBodyGrad" x1="4" y1="12" x2="42" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />   {/* Vibrant Sky Blue */}
        <stop offset="55%" stopColor="#2563EB" />  {/* Royal Blue */}
        <stop offset="100%" stopColor="#1D4ED8" /> {/* Deep Sapphire Blue */}
      </linearGradient>

      {/* Folded Top Paper Edge Gradient */}
      <linearGradient id="blueBagFoldGrad" x1="4" y1="10" x2="42" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>

      {/* Specular Highlight Sheen */}
      <linearGradient id="sheenGrad" x1="8" y1="16" x2="8" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
      </linearGradient>
    </defs>

    {/* Dual Handles (Sunset Orange Rope Arcs) */}
    <path
      d="M16 12V7.5C16 4.46243 18.4624 2 21.5 2C24.5376 2 27 4.46243 27 7.5V12"
      stroke="#FF5E36"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M18 12V8.5C18 6.567 19.567 5 21.5 5C23.433 5 25 6.567 25 8.5V12"
      stroke="#FF7A59"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Main Blue Shopping Bag Body */}
    <rect x="4" y="12" width="35" height="34" rx="7" fill="url(#blueBagBodyGrad)" stroke="#DBEAFE" strokeWidth="1.2" strokeOpacity="0.8" />

    {/* Folded Top Paper Rim */}
    <path d="M4 12C4 10.8954 4.89543 10 6 10H37C38.1046 10 39 10.8954 39 12V16H4V12Z" fill="url(#blueBagFoldGrad)" />

    {/* Front Specular Highlight Sheen */}
    <path d="M8 16V42" stroke="url(#sheenGrad)" strokeWidth="2.5" strokeLinecap="round" />

    {/* Side Fold Crease Lines */}
    <path d="M9 16L11 42" stroke="#1D4ED8" strokeWidth="1.2" opacity="0.4" />
    <path d="M34 16L32 42" stroke="#1D4ED8" strokeWidth="1.2" opacity="0.4" />

    {/* CUTE HAPPY CARTOON FACE */}
    
    {/* Left Eye */}
    <circle cx="15" cy="24" r="3.2" fill="#0F172A" />
    <circle cx="14" cy="23" r="1.2" fill="#FFFFFF" />
    <circle cx="16" cy="25" r="0.6" fill="#FFFFFF" />

    {/* Right Eye */}
    <circle cx="28" cy="24" r="3.2" fill="#0F172A" />
    <circle cx="27" cy="23" r="1.2" fill="#FFFFFF" />
    <circle cx="29" cy="25" r="0.6" fill="#FFFFFF" />

    {/* Rosy Pink Blushing Cheeks */}
    <ellipse cx="11" cy="28" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.85" />
    <ellipse cx="32" cy="28" rx="2.5" ry="1.5" fill="#F472B6" opacity="0.85" />

    {/* Joyful Wide Open Smile Mouth */}
    {isHovered ? (
      // Big open happy mouth with tongue on hover!
      <g>
        <path d="M16 29C16 29 18.5 35 21.5 35C24.5 35 27 29 27 29H16Z" fill="#0F172A" />
        <path d="M19 32.5C19.5 34 21 34.8 21.5 34.8C22 34.8 23.5 34 24 32.5C22.5 32 20.5 32 19 32.5Z" fill="#FB7185" />
      </g>
    ) : (
      // Cute friendly smile curve
      <path
        d="M17 29.5C17 29.5 19 32.5 21.5 32.5C24 32.5 26 29.5 26 29.5"
        stroke="#0F172A"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    )}

    {/* Cute Sunset Orange Sparkle Star when Hovering */}
    {isHovered && (
      <path
        d="M37 6L38.2 8.2L40.5 9.5L38.2 10.8L37 13L35.8 10.8L33.5 9.5L35.8 8.2L37 6Z"
        fill="#FF5E36"
        className="animate-pulse"
      />
    )}
  </svg>
)

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 640) return

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOverInteractive = (e) => {
      const target = e.target
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOverInteractive)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOverInteractive)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 pointer-events-none select-none z-[99999]" style={{ pointerEvents: 'none' }}>
      {/* Happy Blue Shopping Bag Character Cursor */}
      <motion.div
        className="pointer-events-none select-none"
        style={{ pointerEvents: 'none' }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 18,
          scale: isClicking ? 0.85 : isHovered ? 1.25 : 1,
          rotate: isHovered ? -12 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 550,
          damping: 28,
          mass: 0.1,
        }}
      >
        <HappyBlueShoppingBagCharacter isHovered={isHovered} isClicking={isClicking} />
      </motion.div>
    </div>
  )
}
