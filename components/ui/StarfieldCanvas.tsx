'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  baseOpacity: number   // resting brightness
  twinkleSpeed: number  // how fast it pulses
  twinklePhase: number  // offset so stars don't all pulse together
  twinkleAmp: number    // how much it varies (some stars barely twinkle, some a lot)
}

function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => {
    const base = Math.random() * 0.6 + 0.15
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.6 + 0.2,
      speed: Math.random() * 0.15 + 0.05,
      opacity: base,
      baseOpacity: base,
      twinkleSpeed: Math.random() * 0.8 + 0.2,   // 0.2–1.0 cycles/sec
      twinklePhase: Math.random() * Math.PI * 2,  // random start offset
      twinkleAmp: Math.random() * 0.35,            // 0–0.35 amplitude
    }
  })
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let lastTime = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = createStars(prefersReduced ? 40 : 140, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    const draw = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05) // seconds, capped
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        if (!prefersReduced) {
          // Update twinkle phase
          star.twinklePhase += star.twinkleSpeed * dt * Math.PI * 2
          // Sinusoidal brightness — base ± amp
          star.opacity = Math.max(0.05,
            star.baseOpacity + Math.sin(star.twinklePhase) * star.twinkleAmp
          )
          // Drift downward
          star.y += star.speed * 0.1
          if (star.y > canvas.height) {
            star.y = 0
            star.x = Math.random() * canvas.width
          }
        }

        const dx = (mouseRef.current.x - canvas.width / 2) * 0.002 * star.speed
        const dy = (mouseRef.current.y - canvas.height / 2) * 0.002 * star.speed

        // Bright stars get a subtle glow
        if (star.opacity > 0.65 && star.radius > 1.0) {
          ctx.beginPath()
          ctx.arc(star.x + dx, star.y + dy, star.radius * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,220,255,${star.opacity * 0.08})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(star.x + dx, star.y + dy, star.radius, 0, Math.PI * 2)
        // Slight colour variation: cold-white to warm-white to bluish
        const hue = star.twinklePhase % (Math.PI * 2) < Math.PI ? 220 : 40
        ctx.fillStyle = star.radius > 1.2
          ? `hsla(${hue},30%,100%,${star.opacity})`
          : `rgba(255,255,255,${star.opacity})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
