'use client'

import { useEffect, useRef } from 'react'

const ORBS = [
  { baseX: 0.12, baseY: 0.20, sx: 0.14, sy: 0.09, speedX: 0.0008, speedY: 0.0006, radius: 0.70, alpha: 0.13 },
  { baseX: 0.85, baseY: 0.60, sx: 0.11, sy: 0.13, speedX: -0.0006, speedY: 0.0007, radius: 0.60, alpha: 0.10 },
  { baseX: 0.48, baseY: 0.88, sx: 0.09, sy: 0.07, speedX: 0.0005, speedY: -0.0007, radius: 0.55, alpha: 0.08 },
  { baseX: 0.60, baseY: 0.30, sx: 0.12, sy: 0.10, speedX: 0.0007, speedY: 0.0005,  radius: 0.50, alpha: 0.10 },
]

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let frame = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      frame++
      // ~20fps effective — movement is imperceptibly slow, no need for 60fps
      if (frame % 3 !== 0) { animId = requestAnimationFrame(draw); return }

      const W = canvas.width
      const H = canvas.height

      // Base background
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)

      // Orbs
      ORBS.forEach(orb => {
        const x = (orb.baseX + Math.sin(frame * orb.speedX) * orb.sx) * W
        const y = (orb.baseY + Math.cos(frame * orb.speedY) * orb.sy) * H
        const r = orb.radius * Math.max(W, H)

        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,    `rgba(189, 164, 26, ${orb.alpha})`)
        g.addColorStop(0.30, `rgba(189, 164, 26, ${orb.alpha * 0.6})`)
        g.addColorStop(0.65, `rgba(189, 164, 26, ${orb.alpha * 0.15})`)
        g.addColorStop(1,    'rgba(189, 164, 26, 0)')

        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
