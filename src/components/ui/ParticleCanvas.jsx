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
        radius: 5,
        maxRadius: 150,
        alpha: 0.8,
        color: '#E05236', // Terracotta Primary
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    // Hyperlocal Store Nodes & Floating Inventory Badges
    const storeNodeCount = Math.min(Math.floor((width * height) / 15000), 40)
    const storeNodes = []

    const shopCategories = [
      { name: 'KIRANA', color: '#E05236' },   // Terracotta / Grocery
      { name: 'PHARMACY', color: '#0D9488' }, // Safety Teal / Medical
      { name: 'HARDWARE', color: '#F59E0B' }, // Amber / Tools
      { name: 'ELECTRONICS', color: '#6366F1' }, // Indigo
    ]

    for (let i = 0; i < storeNodeCount; i++) {
      const category = shopCategories[i % shopCategories.length]
      storeNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 3 + 3,
        pulseRadius: 0,
        maxPulse: Math.random() * 35 + 25,
        category: category.name,
        color: category.color,
        pulseSpeed: Math.random() * 0.3 + 0.15,
      })
    }

    // Grid animation offset
    let gridOffset = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // A. Modern Vibrant Hyperlocal Grid Mesh
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
      ctx.lineWidth = 1
      const gridSize = 70
      gridOffset = (gridOffset + 0.15) % gridSize

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // B. Render Interactive Click Inventory Pulses
      for (let i = mouse.pulses.length - 1; i >= 0; i--) {
        const p = mouse.pulses[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.strokeStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.globalAlpha = 1.0

        p.radius += 1.6
        p.alpha -= 0.015

        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          mouse.pulses.splice(i, 1)
        }
      }

      // C. Render Store Inventory Nodes & Constellation Connections
      for (let i = 0; i < storeNodes.length; i++) {
        const node = storeNodes[i]

        node.x += node.vx
        node.y += node.vy

        // Bounce at boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        // Pulsing store aura
        node.pulseRadius += node.pulseSpeed
        if (node.pulseRadius > node.maxPulse) {
          node.pulseRadius = 0
        }

        const auraAlpha = Math.max(0, 1 - node.pulseRadius / node.maxPulse) * 0.3

        // Store Aura Circle
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = node.color
        ctx.globalAlpha = auraAlpha
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()

        // Store Node Core Pin
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.shadowBlur = 12
        ctx.shadowColor = node.color
        ctx.fill()
        ctx.restore()

        // Connect store nodes to each other
        for (let j = i + 1; j < storeNodes.length; j++) {
          const n2 = storeNodes[j]
          const dx = node.x - n2.x
          const dy = node.y - n2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 140) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.strokeStyle = node.color
            ctx.globalAlpha = (1 - dist / 140) * 0.2
            ctx.lineWidth = 0.8
            ctx.stroke()
            ctx.restore()
          }
        }

        // Connect store node to Shopping Bag Cursor
        if (mouse.x && mouse.y) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = node.color
            ctx.globalAlpha = (1 - dist / 180) * 0.4
            ctx.lineWidth = 1.2
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
      style={{ opacity: 0.95 }}
    />
  )
}
