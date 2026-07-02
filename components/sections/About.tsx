'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import { CaesarCipher } from '@/components/puzzles/CaesarCipher'

export function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="relative z-10 py-32 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">About</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          Building things that<br />
          <span className="accent">shouldn&apos;t exist yet.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 text-white/70 text-lg leading-relaxed">
          <div>
            <p className="mb-4">
              I&apos;m a Software Engineer and AI Researcher with a First Class BEng in Computer Systems Engineering from Brunel University London. My work spans the intersection of AI/ML, full-stack engineering, and systems design.
            </p>
            <p>
              Awarded the <span className="text-white font-medium">Turing Fellowship</span> to research human-robot collaboration at IISc Bangalore, and currently a Research Assistant on the <span className="text-white font-medium">EU Horizon ELOQUENCE Project</span> — building evaluation frameworks for LLM-based agents.
            </p>
          </div>
          <div>
            <p className="mb-4">
              I&apos;ve won <span className="text-white font-medium">6 hackathons</span> including the NVIDIA Hack for Impact and Encode AI 1st Prize (500+ participants). I build fast, ship often, and care deeply about the quality of what I make.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/Zohaib-Eh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-white/20 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/zohaib-ehtesham"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm border border-white/20 rounded-full px-4 py-2 hover:border-accent hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <PuzzleSlot planetId="venus"><CaesarCipher onSolve={() => {}} /></PuzzleSlot>
        </div>
      </motion.div>
    </section>
  )
}
