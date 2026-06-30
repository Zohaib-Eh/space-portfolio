'use client'
import { motion } from 'framer-motion'
import type { ProjectItem } from '@/lib/data/projects'

interface ProjectCardProps {
  project: ProjectItem
  onClick: () => void
  index: number
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="relative bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer
        hover:border-accent/40 hover:bg-white/8 transition-all duration-300 group"
    >
      {/* Win badge — gold, trophy */}
      {project.isHackathonWin && project.hackathonLabel && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500/15 border border-amber-400/50 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
          🏆 {project.hackathonLabel}
        </div>
      )}
      {/* Affiliate badge — muted, no trophy */}
      {!project.isHackathonWin && project.hackathonAffiliate && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/5 border border-white/15 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/40">
          ◈ {project.hackathonAffiliate}
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
        {project.title}
      </h3>
      <p className="text-white/50 text-sm mb-4 line-clamp-2">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span key={tag} className="text-[11px] border border-white/15 rounded-full px-2 py-0.5 text-white/40">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
