'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProjectItem } from '@/lib/data/projects'

interface ProjectModalProps {
  project: ProjectItem | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => { setImgIndex(0) }, [project])

  useEffect(() => {
    if (!project) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && project.images) setImgIndex(i => (i + 1) % project.images!.length)
      if (e.key === 'ArrowLeft' && project.images) setImgIndex(i => (i - 1 + project.images!.length) % project.images!.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [project, onClose])

  if (!project) return null

  const images = project.images ?? []

  const modal = (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[151]
              w-full max-w-xl bg-[#0a0a18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Image area */}
            {images.length > 0 && (
              <div className="relative h-56 bg-black overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIndex}
                    src={images[imgIndex]}
                    alt={`${project.title} screenshot ${imgIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover object-top"
                    draggable={false}
                  />
                </AnimatePresence>
                {/* Carousel controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setImgIndex(i => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{ background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-7">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none z-10"
              >
                ✕
              </button>

              {project.isHackathonWin && project.hackathonLabel && (
                <p className="text-amber-300 text-[10px] tracking-[0.25em] uppercase mb-2 font-semibold">
                  🏆 {project.hackathonLabel}
                </p>
              )}
              {!project.isHackathonWin && project.hackathonAffiliate && (
                <p className="text-white/35 text-[10px] tracking-[0.25em] uppercase mb-2">
                  ◈ {project.hackathonAffiliate}
                </p>
              )}

              <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
              <p className="text-white/55 text-sm leading-relaxed mb-5">{project.description}</p>

              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">Technologies Used</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs border border-white/15 rounded-full px-3 py-0.5 text-white/45">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
