import React, { useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export const TiltCard3D = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  depth = 30,
  glowColor = 'primary', // 'primary' | 'teal' | 'amber' | 'violet'
  onClick,
}) => {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for smooth 3D rotation
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Physics springs for natural mechanical inertia
  const rotateX = useSpring(x, { stiffness: 350, damping: 25 })
  const rotateY = useSpring(y, { stiffness: 350, damping: 25 })

  // Glare position
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Normalized coordinates (-1 to 1)
    const normX = (mouseX / width) * 2 - 1
    const normY = (mouseY / height) * 2 - 1

    // Invert Y for proper 3D tilt
    x.set(-normY * maxTilt)
    y.set(normX * maxTilt)

    setGlarePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.25,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  const glowStyles = {
    primary: 'hover:shadow-[0_20px_50px_rgba(224,82,54,0.35)] hover:border-primary-500/50',
    teal: 'hover:shadow-[0_20px_50px_rgba(13,148,136,0.35)] hover:border-teal-500/50',
    amber: 'hover:shadow-[0_20px_50px_rgba(245,158,11,0.35)] hover:border-amber-500/50',
    violet: 'hover:shadow-[0_20px_50px_rgba(139,92,246,0.35)] hover:border-violet-500/50',
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative select-none"
    >
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`relative rounded-3xl transition-shadow duration-300 ${glowStyles[glowColor] || glowStyles.primary} ${className}`}
      >
        {/* Child content with 3D depth */}
        <div style={{ transform: isHovered ? `translateZ(${depth}px)` : 'translateZ(0px)', transition: 'transform 0.25s ease-out' }}>
          {children}
        </div>

        {/* Dynamic 3D Glare sheen effect */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45), transparent 80%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
