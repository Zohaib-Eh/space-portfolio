'use client'
import { motion } from 'framer-motion'
import type { ProjectItem } from '@/lib/data/projects'

interface ProjectCardProps {
  project: ProjectItem
  onClick: () => void
  index: number
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const thumb = project.images?.[0]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer
        hover:border-accent/40 hover:bg-white/8 transition-all duration-300 group"
    >
      {/* Image or placeholder */}
      <div className="relative h-44 overflow-hidden bg-white/3">
        {thumb ? (
          <img
            src={thumb}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20 select-none">{ }</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        )}
        {/* Badges over image */}
        {project.isHackathonWin && project.hackathonLabel && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-amber-400/50 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
            🏆 {project.hackathonLabel}
          </div>
        )}
        {!project.isHackathonWin && project.hackathonAffiliate && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/50">
            ◈ {project.hackathonAffiliate}
          </div>
        )}
        {/* Multiple images indicator */}
        {project.images && project.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-2 py-0.5 text-[10px] font-mono text-white/50">
            1/{project.images.length}
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold group-hover:text-accent transition-colors leading-snug">
            {project.title}
          </h3>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
        <p className="text-white/45 text-xs leading-relaxed line-clamp-2">{project.description}</p>
      </div>
    </motion.div>
  )
}
