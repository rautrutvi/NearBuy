import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Multicolored Rainbow Monsoon Umbrella Cursor SVG
const MulticoloredUmbrellaCursor = ({ isHovered, isClicking }) => (
  <svg
    width="52"
    height="54"
    viewBox="0 0 52 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ pointerEvents: 'none' }}
    className="drop-shadow-[0_10px_20px_rgba(168,85,247,0.5)] pointer-events-none select-none"
  >
    <defs>
      {/* Segment Gradients for realistic 3D depth */}
      <linearGradient id="segRed" x1="4" y1="26" x2="16" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7A59" />
        <stop offset="1" stopColor="#E05236" />
      </linearGradient>
      <linearGradient id="segYellow" x1="14" y1="26" x2="22" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="1" stopColor="#EAB308" />
      </linearGradient>
      <linearGradient id="segGreen" x1="22" y1="26" x2="26" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="segCyan" x1="26" y1="26" x2="30" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="segPurple" x1="30" y1="26" x2="38" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C084FC" />
        <stop offset="1" stopColor="#7E22CE" />
      </linearGradient>
      <linearGradient id="segPink" x1="36" y1="26" x2="48" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#DB2777" />
      </linearGradient>
    </defs>

    {/* Silver Tip Top Spike */}
    <path d="M26 2V8" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="26" cy="3" r="2" fill="#F8FAFC" />

    {/* MULTICOLORED RAINBOW CANOPY PANELS */}
    {/* Panel 1: Coral Red (Far Left) */}
    <path
      d="M4 26C4 16 13 8 26 8V26C18.5 24 10 26 4 26Z"
      fill="url(#segRed)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Panel 2: Gold Yellow (Mid Left) */}
    <path
      d="M13 24.5C13 16 18 8 26 8V26C21.5 24.5 17 24.5 13 24.5Z"
      fill="url(#segYellow)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Panel 3: Emerald Green (Center Left) */}
    <path
      d="M20 24.5C20 16 23 8 26 8V26C24 24.5 22 24.5 20 24.5Z"
      fill="url(#segGreen)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Panel 4: Sky Cyan (Center Right) */}
    <path
      d="M26 8C29 8 32 16 32 24.5C30 24.5 28 24.5 26 26V8Z"
      fill="url(#segCyan)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Panel 5: Lavender Purple (Mid Right) */}
    <path
      d="M26 8C34 8 39 16 39 24.5C35 24.5 30.5 24.5 26 26V8Z"
      fill="url(#segPurple)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Panel 6: Magenta Rose (Far Right) */}
    <path
      d="M26 8C39 8 48 16 48 26C42 26 33.5 24 26 26V8Z"
      fill="url(#segPink)"
      stroke="#ffffff"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />

    {/* Scalloped Rim Outline */}
    <path
      d="M4 26Q8.5 23.5 13 24.5Q16.5 25 20 24.5Q23 24 26 26Q29 24 32 24.5Q35.5 25 39 24.5Q43.5 23.5 48 26"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Central Shaft & Wooden J-Hook Handle */}
    <path
      d="M26 26V44C26 48 22 51 18 51C14 51 11 48 11 44"
      stroke="#D97706"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M26 26V44C26 48 22 51 18 51C14 51 11 48 11 44"
      stroke="#F59E0B"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="10 4"
    />

    {/* Dripping Water Droplets from Canopy Edge */}
    <circle cx="8" cy="30" r="1.5" fill="#38BDF8" opacity="0.85" />
    <circle cx="20" cy="28.5" r="1.2" fill="#C084FC" opacity="0.85" />
    <circle cx="33" cy="28.5" r="1.2" fill="#FDE047" opacity="0.85" />
    <circle cx="44" cy="30" r="1.5" fill="#34D399" opacity="0.85" />

    {/* Sparkles on Hover */}
    {isHovered && (
      <>
        <path d="M44 6L45 8L47 9L45 10L44 12L43 10L41 9L43 8L44 6Z" fill="#FDE047" />
        <path d="M6 10L7 11.5L8.5 12.5L7 13.5L6 15L5 13.5L3.5 12.5L5 11.5L6 10Z" fill="#C084FC" />
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
    // Enable custom umbrella cursor on desktop screens
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
      {/* Multicolored Rainbow Monsoon Umbrella Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999]"
        style={{ pointerEvents: 'none' }}
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 18,
          scale: isClicking ? 0.85 : isHovered ? 1.25 : 1,
          rotate: isHovered ? -15 : 0,
        }}
        transition={{ type: 'spring', stiffness: 550, damping: 28, mass: 0.1 }}
      >
        <MulticoloredUmbrellaCursor isHovered={isHovered} isClicking={isClicking} />
      </motion.div>
    </>
  )
}
