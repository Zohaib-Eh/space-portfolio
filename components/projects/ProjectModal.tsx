'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProjectItem } from '@/lib/data/projects'

interface ProjectModalProps {
  project: ProjectItem | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              w-full max-w-lg bg-bg border border-white/10 rounded-2xl p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl"
            >
              ×
            </button>
            {project.isHackathonWin && project.hackathonLabel && (
              <p className="text-amber-300 text-xs tracking-widest uppercase mb-2 font-semibold">
                🏆 {project.hackathonLabel}
              </p>
            )}
            {!project.isHackathonWin && project.hackathonAffiliate && (
              <p className="text-white/35 text-xs tracking-widest uppercase mb-2">
                ◈ {project.hackathonAffiliate}
              </p>
            )}
            <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            <p className="text-white/60 mb-6 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs border border-white/20 rounded-full px-3 py-1 text-white/50">
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 rounded-full px-5 py-2 text-sm hover:border-accent hover:text-accent transition-colors"
            >
              View on GitHub →
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
