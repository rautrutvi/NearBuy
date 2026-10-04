import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
    <div className="fixed inset-0 pointer-events-none select-none z-[99999]">
      
      {/* Soft Ambient Glow Ring Behind Cursor */}
      <motion.div
        className="absolute rounded-full border border-dashed pointer-events-none"
        style={{
          left: mousePosition.x - 26,
          top: mousePosition.y - 26,
          width: 52,
          height: 52,
        }}
        animate={{
          rotate: 360,
          scale: isClicking ? 0.75 : isHovered ? 1.35 : 1,
          borderColor: isHovered ? '#C084FC' : '#FF5E36',
          boxShadow: isHovered
            ? '0 0 25px rgba(192, 132, 252, 0.5), inset 0 0 15px rgba(168, 85, 247, 0.3)'
            : '0 0 15px rgba(255, 94, 54, 0.3)',
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 8, ease: 'linear' },
          scale: { type: 'spring', stiffness: 450, damping: 25 },
        }}
      />

      {/* Photorealistic Colorful 3D Shopping Bag Image Cursor (Fixed Natural Colors) */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 42,
          height: 42,
        }}
        animate={{
          scale: isClicking ? 0.82 : isHovered ? 1.28 : 1,
          rotate: isHovered ? -12 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 26,
          mass: 0.1,
        }}
      >
        <img
          src="/images/item_bag.png"
          alt="3D Shopping Bag Cursor"
          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_10px_20px_rgba(255,94,54,0.45)]"
        />
      </motion.div>
    </div>
  )
}
