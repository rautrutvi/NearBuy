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

    // Track mouse for interactive radar ripple ring
    const mouse = { x: width / 2, y: height / 2, ripples: [] }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleClick = (e) => {
      mouse.ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 160,
        alpha: 0.8,
        color: '#0D9488', // Safety Teal
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    // 1. Monsoon Raindrops
    const raindropCount = 50
    const raindrops = []
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 18 + 10,
        speed: Math.random() * 4 + 3,
        opacity: Math.random() * 0.25 + 0.1,
      })
    }

    // 2. Shop Location Radar Nodes (Hyperlocal store pins)
    const nodeCount = 18
    const shopNodes = []
    const nodeTypes = [
      { color: '#0D9488', label: 'SAFE SHOP' }, // Teal
      { color: '#F59E0B', label: 'WATCH ZONE' }, // Amber
      { color: '#E05236', label: 'FLOOD ALERT' }, // Terracotta / Red
    ]

    for (let i = 0; i < nodeCount; i++) {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      shopNodes.push({
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
        radius: Math.random() * 2.5 + 3.5,
        pulseRadius: 0,
        maxPulse: Math.random() * 45 + 30,
        color: type.color,
        pulseSpeed: Math.random() * 0.4 + 0.2,
      })
    }

    // 3. Central Animated Radar Sweeper Beam
    let sweepAngle = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // A. Dark City Map Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.lineWidth = 1
      const gridSize = 75

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

      // B. Draw Monsoon Raindrops falling downwards
      ctx.lineWidth = 1.2
      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i]
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x - 2, drop.y + drop.length)
        ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity})` // Light sky blue rain streak
        ctx.stroke()

        drop.y += drop.speed
        drop.x -= 0.5 // Slanted wind effect

        // Reset raindrop when it reaches bottom
        if (drop.y > height) {
          drop.y = -20
          drop.x = Math.random() * width
          // Spawn a small water ripple at splash location
          if (Math.random() > 0.6) {
            mouse.ripples.push({
              x: drop.x,
              y: height - 10,
              radius: 2,
              maxRadius: 35,
              alpha: 0.4,
              color: '#38BDF8',
            })
          }
        }
      }

      // C. Render Interactive Mouse Radar Ripples
      for (let i = mouse.ripples.length - 1; i >= 0; i--) {
        const r = mouse.ripples[i]
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = r.color
        ctx.globalAlpha = r.alpha
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1.0

        r.radius += 1.2
        r.alpha -= 0.012

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          mouse.ripples.splice(i, 1)
        }
      }

      // D. Draw Shop Location Radar Nodes & Pulsing Waves
      for (let i = 0; i < shopNodes.length; i++) {
        const node = shopNodes[i]

        // Animate radar pulse expanding from shop
        node.pulseRadius += node.pulseSpeed
        if (node.pulseRadius > node.maxPulse) {
          node.pulseRadius = 0
        }

        const pulseAlpha = Math.max(0, 1 - node.pulseRadius / node.maxPulse) * 0.4

        // Radar wave circle around shop pin
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = node.color
        ctx.globalAlpha = pulseAlpha
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()

        // Shop Pin Core
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.shadowBlur = 10
        ctx.shadowColor = node.color
        ctx.fill()
        ctx.restore()

        // Connect shop nodes near cursor
        if (mouse.x && mouse.y) {
          const dx = mouse.x - node.x
          const dy = mouse.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = node.color
            ctx.globalAlpha = (1 - dist / 160) * 0.35
            ctx.lineWidth = 1
            ctx.setLineDash([4, 4])
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      // E. Rotating Radar Radar Beam Sweep Effect (Originating from center)
      sweepAngle += 0.008
      const cx = width / 2
      const cy = height / 2
      const sweepRadius = Math.max(width, height) * 0.8

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, sweepRadius, sweepAngle, sweepAngle + 0.3)
      ctx.closePath()

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, sweepRadius)
      grad.addColorStop(0, 'rgba(13, 148, 136, 0.08)')
      grad.addColorStop(1, 'rgba(13, 148, 136, 0)')
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

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
      style={{ opacity: 0.9 }}
    />
  )
}
