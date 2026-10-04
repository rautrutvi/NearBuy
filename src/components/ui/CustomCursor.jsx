import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (window.innerWidth < 640) return

    let particleId = 0

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e
      setMousePosition({ x, y })
      if (!isVisible) setIsVisible(true)

      // Emit animated rainbow sparkle trail on mouse move
      if (Math.random() > 0.4) {
        const colors = ['#FF5E36', '#F59E0B', '#10B981', '#38BDF8', '#A855F7', '#EC4899']
        const newParticle = {
          id: particleId++,
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4,
        }

        setParticles((prev) => [...prev.slice(-12), newParticle])
      }
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

  // Auto clean stale particles
  useEffect(() => {
    if (particles.length === 0) return
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1))
    }, 400)
    return () => clearTimeout(timer)
  }, [particles])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[99999]">
      {/* Animated Floating Rainbow Sparkle Trail */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.2, y: 14 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* Outer Glowing Pulsing Rainbow Aura Ring */}
      <motion.div
        className="absolute rounded-full border-2 border-dashed pointer-events-none"
        style={{
          left: mousePosition.x - 28,
          top: mousePosition.y - 28,
          width: 56,
          height: 56,
        }}
        animate={{
          rotate: 360,
          scale: isClicking ? 0.7 : isHovered ? 1.4 : 1,
          borderColor: isHovered ? '#C084FC' : '#FF5E36',
          boxShadow: isHovered
            ? '0 0 25px rgba(192, 132, 252, 0.6), inset 0 0 15px rgba(168, 85, 247, 0.4)'
            : '0 0 15px rgba(255, 94, 54, 0.4)',
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 6, ease: 'linear' },
          scale: { type: 'spring', stiffness: 450, damping: 25 },
        }}
      />

      {/* Main Photorealistic 3D Shopping Bag Cursor with Live Rainbow Hue Shift */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 44,
          height: 44,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.3 : 1,
          rotate: isHovered ? -14 : [ -4, 4, -4 ],
        }}
        transition={{
          rotate: isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' },
          scale: { type: 'spring', stiffness: 500, damping: 25 },
        }}
      >
        <motion.img
          src="/images/item_bag.png"
          alt="3D Shopping Bag Cursor"
          className="w-full h-full object-contain pointer-events-none"
          animate={{
            filter: [
              'hue-rotate(0deg) drop-shadow(0 0 10px rgba(255, 94, 54, 0.8))',
              'hue-rotate(120deg) drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))',
              'hue-rotate(240deg) drop-shadow(0 0 12px rgba(56, 189, 248, 0.8))',
              'hue-rotate(360deg) drop-shadow(0 0 10px rgba(255, 94, 54, 0.8))',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'linear',
          }}
        />
      </motion.div>
    </div>
  )
}
