'use client'
import { PhysicsIcons } from '@/components/skills/PhysicsIcons'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'

export function Skills() {
  return (
    <section id="skills" className="relative z-10 py-32">
      {/* Header stays centered */}
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Skills-teroids</h2>
      </div>

      {/* Asteroid field spans full viewport width */}
      <PhysicsIcons />

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <PuzzleSlot planetId="jupiter" />
      </div>
    </section>
  )
}
