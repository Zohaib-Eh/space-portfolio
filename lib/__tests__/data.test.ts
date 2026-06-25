import { describe, it, expect } from 'vitest'
import { experienceNodes } from '../data/experience'
import { projects } from '../data/projects'
import { skillIcons } from '../data/skills'
import { planets } from '../data/planets'

describe('experience data', () => {
  it('has at least one job node and one award node', () => {
    const jobs = experienceNodes.filter(n => n.type === 'job')
    const awards = experienceNodes.filter(n => n.type === 'award')
    expect(jobs.length).toBeGreaterThan(0)
    expect(awards.length).toBeGreaterThan(0)
  })
  it('every node has required fields', () => {
    experienceNodes.forEach(n => {
      expect(n).toHaveProperty('id')
      expect(n).toHaveProperty('type')
      expect(n).toHaveProperty('title')
      expect(n).toHaveProperty('year')
    })
  })
})

describe('projects data', () => {
  it('every project has a category', () => {
    projects.forEach(p => {
      expect(['aiml', 'blockchain', 'robotics', 'fullstack']).toContain(p.category)
    })
  })
})

describe('planets data', () => {
  it('has exactly 6 planets', () => {
    expect(planets).toHaveLength(6)
  })
  it('planet ids match the allowed type', () => {
    const allowed = ['mercury', 'venus', 'mars', 'jupiter', 'neptune', 'saturn']
    planets.forEach(p => expect(allowed).toContain(p.id))
  })
})

describe('skills data', () => {
  it('every skill has a name and cluster', () => {
    skillIcons.forEach(s => {
      expect(s).toHaveProperty('name')
      expect(s).toHaveProperty('cluster')
    })
  })
})
