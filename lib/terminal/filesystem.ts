import { experienceNodes } from '@/lib/data/experience'
import { projects } from '@/lib/data/projects'

export const filesystem = {
  root: ['about.txt', 'contact.txt', 'skills.txt', 'awards.txt', 'secret.txt', 'experience/', 'projects/'],
  experience: experienceNodes.filter(n => n.type === 'job').map(n => `${n.id}.txt`),
  projects: projects.map(p => `${p.id}.txt`),
}
