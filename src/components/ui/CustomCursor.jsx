import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Happy Cartoon Shopping Bag Illustration SVG
const CartoonShoppingBag = ({ isHovered, isClicking }) => (
  <svg
    width="44"
    height="48"
    viewBox="0 0 44 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_8px_16px_rgba(224,82,54,0.4)]"
  >
    {/* Bag Handles */}
    <path
      d="M15 12V8C15 4.68629 17.6863 2 21 2V2C24.3137 2 27 4.68629 27 8V12"
      stroke="#D97706"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M17 12V9C17 6.79086 18.7909 5 21 5V5C23.2091 5 25 6.79086 25 9V12"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Bag Main Body Gradient */}
    <defs>
      <linearGradient id="bagGrad" x1="0" y1="10" x2="44" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B4A" />
        <stop offset="1" stopColor="#E05236" />
      </linearGradient>
      <linearGradient id="foldGrad" x1="0" y1="10" x2="44" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF856B" />
        <stop offset="1" stopColor="#FF6B4A" />
      </linearGradient>
    </defs>

    {/* Bag Body Shadow & Main Shape */}
    <rect x="4" y="12" width="36" height="34" rx="6" fill="url(#bagGrad)" />

    {/* Folded Top Paper Edge */}
    <path d="M4 12C4 10.8954 4.89543 10 6 10H38C39.1046 10 40 10.8954 40 12V16H4V12Z" fill="url(#foldGrad)" />

    {/* Side Fold Lines */}
    <path d="M8 16L10 44" stroke="#C23B22" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M36 16L34 44" stroke="#C23B22" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

    {/* Cartoon Happy Face */}
    {/* Left Eye */}
    <circle cx="16" cy="24" r="3" fill="#1E293B" />
    <circle cx="15" cy="23" r="1" fill="white" />

    {/* Right Eye */}
    <circle cx="28" cy="24" r="3" fill="#1E293B" />
    <circle cx="27" cy="23" r="1" fill="white" />

    {/* Rosy Cheeks */}
    <ellipse cx="12" cy="28" rx="2.5" ry="1.5" fill="#FF8A9B" opacity="0.8" />
    <ellipse cx="32" cy="28" rx="2.5" ry="1.5" fill="#FF8A9B" opacity="0.8" />

    {/* Happy Smile Mouth */}
    {isHovered ? (
      // Big open joyful mouth on hover!
      <path
        d="M17 29C17 29 19 34 22 34C25 34 27 29 27 29H17Z"
        fill="#1E293B"
      />
    ) : (
      // Friendly smile curve
      <path
        d="M17 29C17 29 19 32 22 32C25 32 27 29 27 29"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    )}

    {/* Star Sparkle on Hover */}
    {isHovered && (
      <path
        d="M38 6L39 8L41 9L39 10L38 12L37 10L35 9L37 8L38 6Z"
        fill="#F59E0B"
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
    // Enable custom happy shopping bag cursor on desktop screens
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
      {/* Happy Cartoon Shopping Bag Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        animate={{
          x: mousePosition.x - 22,
          y: mousePosition.y - 20,
          scale: isClicking ? 0.85 : isHovered ? 1.25 : 1,
          rotate: isHovered ? -12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.1 }}
      >
        <CartoonShoppingBag isHovered={isHovered} isClicking={isClicking} />
      </motion.div>
    </>
  )
}
