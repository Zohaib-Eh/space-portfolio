'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  'Software Engineer',
  'AI Researcher',
  'Hackathon Winner',
  'Systems Engineer',
]

export function RotatingText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % items.length), 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="inline-block overflow-hidden h-[1.2em] relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="block accent"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
