import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Enable custom shopping bag cursor on all non-touch devices
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
      {/* Primary Custom Shopping Bag Cursor Icon */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center"
        animate={{
          x: mousePosition.x - 14,
          y: mousePosition.y - 14,
          scale: isClicking ? 0.85 : isHovered ? 1.35 : 1,
          rotate: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.1 }}
      >
        <div className={`p-2 rounded-xl backdrop-blur-md shadow-2xl flex items-center justify-center transition-colors duration-200 ${
          isHovered
            ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white border border-white/40 shadow-[0_0_20px_rgba(224,82,54,0.6)]'
            : 'bg-slate-900/90 text-primary-400 border border-primary-500/40 shadow-[0_0_15px_rgba(224,82,54,0.4)]'
        }`}>
          <ShoppingBag className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Trailing Glowing Halo Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 pointer-events-none z-[99998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? 'rgba(13, 148, 136, 0.8)' : 'rgba(224, 82, 54, 0.4)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, mass: 0.2 }}
      />
    </>
  )
}
