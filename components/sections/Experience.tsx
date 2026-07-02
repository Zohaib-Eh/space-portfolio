'use client'
import { NeuralNetwork } from '@/components/experience/NeuralNetwork'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import { BinaryToggle } from '@/components/puzzles/BinaryToggle'

export function Experience() {
  return (
    <section id="experience" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Career</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Experience & Awards
        </h2>
        <NeuralNetwork />
        <div className="mt-12">
          <PuzzleSlot planetId="mars"><BinaryToggle onSolve={() => {}} /></PuzzleSlot>
        </div>
      </div>
    </section>
  )
}
