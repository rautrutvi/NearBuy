import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Multicolored Rainbow Glossy Shopping Bag Cursor SVG
const MulticoloredShoppingBagCursor = ({ isHovered, isClicking }) => (
  <svg
    width="50"
    height="54"
    viewBox="0 0 50 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
    className="drop-shadow-[0_10px_20px_rgba(168,85,247,0.5)] pointer-events-none select-none"
  >
    <defs>
      {/* Vibrant Multicolored Rainbow Body Gradient */}
      <linearGradient id="rainbowBagGrad" x1="0" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF5E36" />   {/* Coral Red */}
        <stop offset="25%" stopColor="#F59E0B" />  {/* Amber Gold */}
        <stop offset="50%" stopColor="#10B981" />  {/* Emerald Green */}
        <stop offset="75%" stopColor="#38BDF8" />  {/* Sky Blue */}
        <stop offset="100%" stopColor="#A855F7" /> {/* Electric Purple */}
      </linearGradient>

      {/* Folded Rim Top Gradient */}
      <linearGradient id="rainbowFoldGrad" x1="0" y1="10" x2="50" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF886C" />
        <stop offset="50%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#C084FC" />
      </linearGradient>
    </defs>

    {/* Twisted Rope Handles (Back & Front Arcs) */}
    <path
      d="M17 14V8C17 4.68629 19.6863 2 23 2C26.3137 2 29 4.68629 29 8V14"
      stroke="#F59E0B"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M19 14V9C19 6.79086 20.7909 5 23 5C25.2091 5 27 6.79086 27 9V14"
      stroke="#FEF08A"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Main Bag Body with Multicolored Rainbow Fill */}
    <rect x="5" y="14" width="36" height="34" rx="6" fill="url(#rainbowBagGrad)" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />

    {/* Folded Top Paper Edge */}
    <path d="M5 14C5 12.8954 5.89543 12 7 12H39C40.1046 12 41 12.8954 41 14V18H5V14Z" fill="url(#rainbowFoldGrad)" />

    {/* Vertical Multicolored Decorative Accent Stripes */}
    <rect x="13" y="18" width="3" height="30" fill="#ffffff" fillOpacity="0.25" />
    <rect x="22" y="18" width="3" height="30" fill="#ffffff" fillOpacity="0.35" />
    <rect x="31" y="18" width="3" height="30" fill="#ffffff" fillOpacity="0.25" />

    {/* Happy Cute Face or Nearbuy Badge */}
    <circle cx="16" cy="27" r="2.5" fill="#ffffff" />
    <circle cx="30" cy="27" r="2.5" fill="#ffffff" />

    {/* Joyful Smile Curve */}
    {isHovered ? (
      <path d="M18 32C18 32 20 37 23 37C26 37 28 32 28 32H18Z" fill="#ffffff" />
    ) : (
      <path d="M19 32C19 32 21 34.5 23 34.5C25 34.5 27 32 27 32" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    )}

    {/* Rosy Cheeks */}
    <ellipse cx="12" cy="31" rx="2" ry="1.2" fill="#FEF08A" opacity="0.9" />
    <ellipse cx="34" cy="31" rx="2" ry="1.2" fill="#FEF08A" opacity="0.9" />

    {/* Sparkles on Hover */}
    {isHovered && (
      <>
        <path d="M42 6L43 8L45 9L43 10L42 12L41 10L39 9L41 8L42 6Z" fill="#FDE047" />
        <path d="M6 8L7 9.5L8.5 10.5L7 11.5L6 13L5 11.5L3.5 10.5L5 9.5L6 8Z" fill="#C084FC" />
      </>
    )}
  </svg>
)

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Enable custom shopping bag cursor on desktop screens
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
    <>
      {/* Multicolored Rainbow Glossy Shopping Bag Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999]"
        style={{ pointerEvents: 'none' }}
        animate={{
          x: mousePosition.x - 22,
          y: mousePosition.y - 18,
          scale: isClicking ? 0.85 : isHovered ? 1.25 : 1,
          rotate: isHovered ? -12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 550, damping: 28, mass: 0.1 }}
      >
        <MulticoloredShoppingBagCursor isHovered={isHovered} isClicking={isClicking} />
      </motion.div>
    </>
  )
}
