'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { skillIcons } from '@/lib/data/skills'

// On mobile, skip Matter.js and render a static grid
function StaticIcons() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {skillIcons.map(skill => (
        <div key={skill.name} className="flex flex-col items-center gap-1 w-16">
          <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
          <span className="text-[10px] text-white/40 text-center">{skill.name}</span>
        </div>
      ))}
    </div>
  )
}

export function PhysicsIcons() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true })
  const [isMobile, setIsMobile] = useState(false)
  const engineRef = useRef<any>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!inView || isMobile || !containerRef.current) return

    let runner: any

    const init = async () => {
      const Matter = await import('matter-js')
      const { Engine, Runner, Bodies, Body, Events, World } = Matter

      const container = containerRef.current!
      const W = container.offsetWidth
      const H = container.offsetHeight

      const engine = Engine.create({ gravity: { x: 0, y: 0 } })
      engineRef.current = engine

      const bodies = skillIcons.map((skill, i) => {
        const cols = 6
        const x = (i % cols) * (W / cols) + W / cols / 2
        const y = Math.floor(i / cols) * 80 + 60
        const body = Bodies.circle(x, y, 28, {
          restitution: 0.6,
          friction: 0.1,
          label: skill.name,
        })
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        })
        return body
      })

      World.add(engine.world, bodies)

      // Mouse repulsion on mousemove
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        bodies.forEach(body => {
          const dx = body.position.x - mx
          const dy = body.position.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const force = 0.005 * (1 - dist / 120)
            Body.applyForce(body, body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            })
          }
        })
      }
      container.addEventListener('mousemove', onMouseMove)

      // Keep bodies within bounds
      runner = Runner.create()
      Runner.run(runner, engine)

      Events.on(engine, 'afterUpdate', () => {
        bodies.forEach(body => {
          const { x, y } = body.position
          let vx = body.velocity.x
          let vy = body.velocity.y
          if (x < 28 || x > W - 28) vx *= -1
          if (y < 28 || y > H - 28) vy *= -1
          Body.setVelocity(body, { x: vx * 0.98, y: vy * 0.98 })
          Body.setPosition(body, {
            x: Math.max(28, Math.min(W - 28, x)),
            y: Math.max(28, Math.min(H - 28, y)),
          })
        })
        // Update DOM elements by reading body positions
        if (containerRef.current) {
          bodies.forEach((body, i) => {
            const el = containerRef.current!.querySelector(`[data-body="${i}"]`) as HTMLElement
            if (el) {
              el.style.transform = `translate(${body.position.x - 28}px, ${body.position.y - 28}px)`
            }
          })
        }
      })

      return () => {
        container.removeEventListener('mousemove', onMouseMove)
        Runner.stop(runner)
        Engine.clear(engine)
      }
    }

    const cleanup = init()
    return () => {
      cleanup.then(fn => fn?.())
    }
  }, [inView, isMobile])

  if (isMobile) return <StaticIcons />

  return (
    <div ref={containerRef} className="relative w-full h-[400px] overflow-hidden">
      {skillIcons.map((skill, i) => (
        <div
          key={skill.name}
          data-body={i}
          className="absolute w-14 h-14 flex flex-col items-center gap-1 pointer-events-none"
          style={{ transform: `translate(${(i % 6) * 100 + 20}px, ${Math.floor(i / 6) * 80 + 20}px)` }}
        >
          <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
          <span className="text-[9px] text-white/30 text-center whitespace-nowrap">{skill.name}</span>
        </div>
      ))}
    </div>
  )
}
