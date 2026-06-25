'use client'
import type { ProjectCategory } from '@/lib/data/projects'

type FilterValue = 'all' | ProjectCategory

interface CategoryFilterProps {
  active: FilterValue
  onChange: (v: FilterValue) => void
}

const tabs: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'aiml', label: 'AI · ML' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'fullstack', label: 'Full-Stack' },
]

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-12">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-5 py-2 rounded-full text-sm transition-all duration-200
            ${active === tab.value
              ? 'bg-accent text-bg font-semibold'
              : 'border border-white/20 text-white/60 hover:border-accent hover:text-accent'
            }`}
          style={active === tab.value ? { backgroundColor: 'var(--accent)', color: '#050510' } : {}}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
