'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/data/projects'
import { CategoryFilter } from '@/components/projects/CategoryFilter'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import type { ProjectItem, ProjectCategory } from '@/lib/data/projects'

type FilterValue = 'all' | ProjectCategory

export function Projects() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [selected, setSelected] = useState<ProjectItem | null>(null)

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative z-10 py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Work</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-center">Projects</h2>
        <p className="text-white/40 text-center mb-12 text-sm">click a card to explore</p>
        <CategoryFilter active={filter} onChange={setFilter} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-12">
          <PuzzleSlot planetId="mars" />
        </div>
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
