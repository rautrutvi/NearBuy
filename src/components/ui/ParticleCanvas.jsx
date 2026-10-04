import React, { useEffect, useRef } from 'react'

export const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Interactive mouse state & click pulses
    const mouse = { x: width / 2, y: height / 2, pulses: [] }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleClick = (e) => {
      mouse.pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 120,
        alpha: 0.7,
        color: '#E05236',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    // Vibrant Store Network Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 32)
    const nodes = []

    const palette = [
      '#E05236', // Terracotta
      '#0D9488', // Teal
      '#F59E0B', // Amber
      '#8B5CF6', // Purple
      '#3B82F6', // Blue
    ]

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 2.5,
        pulseRadius: 0,
        maxPulse: Math.random() * 30 + 20,
        color: palette[i % palette.length],
        pulseSpeed: Math.random() * 0.25 + 0.15,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // A. Soft, subtle clean grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
      ctx.lineWidth = 1
      const gridSize = 80

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // B. Click interactive pulse waves
      for (let i = mouse.pulses.length - 1; i >= 0; i--) {
        const p = mouse.pulses[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.strokeStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.lineWidth = 1.8
        ctx.stroke()
        ctx.globalAlpha = 1.0

        p.radius += 1.8
        p.alpha -= 0.016

        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          mouse.pulses.splice(i, 1)
        }
      }

      // C. Render Store Nodes & Connecting Lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1

        // Pulsing rings
        n.pulseRadius += n.pulseSpeed
        if (n.pulseRadius > n.maxPulse) {
          n.pulseRadius = 0
        }

        const auraAlpha = Math.max(0, 1 - n.pulseRadius / n.maxPulse) * 0.25

        ctx.save()
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = n.color
        ctx.globalAlpha = auraAlpha
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()

        // Core Pin
        ctx.save()
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = 0.85
        ctx.shadowBlur = 8
        ctx.shadowColor = n.color
        ctx.fill()
        ctx.restore()

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dx = n.x - n2.x
          const dy = n.y - n2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.strokeStyle = n.color
            ctx.globalAlpha = (1 - dist / 130) * 0.15
            ctx.lineWidth = 0.8
            ctx.stroke()
            ctx.restore()
          }
        }

        // Connect to mouse cursor
        if (mouse.x && mouse.y) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = n.color
            ctx.globalAlpha = (1 - dist / 150) * 0.3
            ctx.lineWidth = 1
            ctx.setLineDash([3, 3])
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
