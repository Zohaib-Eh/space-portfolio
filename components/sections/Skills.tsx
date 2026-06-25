'use client'
import { PhysicsIcons } from '@/components/skills/PhysicsIcons'

export function Skills() {
  return (
    <section id="skills" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Stack</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16 text-center">Skills</h2>
        <PhysicsIcons />
        <p className="text-white/20 text-xs text-center mt-4">hover to interact</p>
      </div>
    </section>
  )
}
