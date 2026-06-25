# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Zohaib Ehtesham's space-themed interactive portfolio — Next.js on Vercel with starfield hero, scroll-driven neural network timeline, physics skill icons, terminal overlay, and Rubik's cube easter egg.

**Architecture:** Single-page Next.js 14 App Router app. All sections render on `/`. Interactive elements (Rubik's cube, terminal) are client components lazy-loaded after hydration. Zustand store with localStorage persistence manages theme state and planet unlocks.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, React Three Fiber + Three.js, Matter.js, Zustand + persist middleware, Resend (contact form), Vitest + React Testing Library

## Global Constraints

- Node.js ≥ 18, Next.js 14 (App Router only — no Pages Router)
- All interactive components must be `'use client'` — never add `'use client'` to layout.tsx or page.tsx unless required
- Tailwind only for styling — no inline styles except where Three.js/Canvas requires it
- `prefers-reduced-motion` must disable/simplify all Framer Motion animations
- Matter.js and Three.js must be lazily initialized — never in SSR context
- Planet type: `'mercury' | 'venus' | 'mars' | 'jupiter' | 'neptune' | 'saturn'`
- Accent colors: mercury `#C0C0C0`, venus `#E8A020`, mars `#E84040`, jupiter `#E86020`, neptune `#20C8E8`, saturn `#E8D020`
- Background: `#050510`, default accent: `#ffffff`
- Content in `lib/data/*.ts` — all placeholder text until Zohaib fills it in

---

## File Map

```
app/
  layout.tsx               # Root layout: fonts, metadata, providers
  page.tsx                 # Section composition (no logic)
  globals.css              # Tailwind directives + CSS custom properties for accent color
  api/contact/route.ts     # Resend email handler

components/
  layout/
    Navbar.tsx             # Centered pill: name, nav links, theme dropdown
    PlanetDropdown.tsx     # Dropdown card showing 6 planet swatches
  sections/
    Hero.tsx               # Starfield + name + rotating subtitle + CTAs
    About.tsx              # Bio text, two-column
    Experience.tsx         # Neural network section wrapper
    Projects.tsx           # Filtered card grid
    Skills.tsx             # Matter.js physics icons
    Contact.tsx            # Form + social links
  experience/
    NeuralNetwork.tsx      # SVG graph, scroll-driven build
    NetworkNode.tsx        # Individual node (job or award)
    NodeDetail.tsx         # Expanded detail panel
  projects/
    ProjectCard.tsx        # Card with hover state
    ProjectModal.tsx       # Detail modal
    CategoryFilter.tsx     # Tab filter bar
  skills/
    PhysicsIcons.tsx       # Matter.js canvas + icon rendering
  easter-eggs/
    Terminal.tsx           # macOS-style overlay terminal
    RubiksCube.tsx         # React Three Fiber 2x2 cube
    RubiksModal.tsx        # "Classified intel unlocked" reward modal
    PuzzleSlot.tsx         # Reserved slot: renders placeholder or puzzle children
  ui/
    StarfieldCanvas.tsx    # Animated starfield (canvas, RAF)
    PlanetTracker.tsx      # Fixed bottom-right, 6 planet slots
    RotatingText.tsx       # Cycles through subtitle strings

lib/
  data/
    experience.ts          # Job nodes + award nodes for NN graph
    projects.ts            # Project cards with categories
    skills.ts              # Tech icons + cluster groupings
    terminal.ts            # Command response strings
    planets.ts             # Planet metadata (name, color, hex)
  store/
    themeStore.ts          # Zustand: unlockedPlanets, activeTheme, unlockPlanet, setActiveTheme
  terminal/
    parser.ts              # Command parser: input string → response string
    filesystem.ts          # Virtual filesystem tree for terminal navigation

public/
  icons/                   # Tech stack SVGs (devicons)
```

---

## Phase 1 — Foundation

### Task 1: Project Setup

**Files:**
- Create: `package.json` (via CLI)
- Create: `app/globals.css`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd c:/Users/zohai/Projects/portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

Choose: No to Turbopack when prompted.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion @react-three/fiber @react-three/drei three matter-js zustand resend
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @types/three @types/matter-js
```

- [ ] **Step 3: Configure Vitest**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Create `vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Set up CSS custom properties for accent color**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --accent: #ffffff;
  --bg: #050510;
}

body {
  background-color: var(--bg);
  color: #ffffff;
}

.accent { color: var(--accent); }
.accent-border { border-color: var(--accent); }
.accent-glow { box-shadow: 0 0 12px var(--accent); }
```

- [ ] **Step 5: Update tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        accent: 'var(--accent)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Add Google Fonts to layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Zohaib Ehtesham',
  description: 'Software Engineer · AI Researcher · Hackathon Winner',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-bg text-white">{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: Verify setup**

```bash
npm run dev
```

Expected: Next.js dev server starts, `http://localhost:3000` loads default page.

```bash
npm run test:run
```

Expected: "No test files found" (no tests yet — that's fine).

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "feat: next.js 14 setup with tailwind, framer-motion, r3f, matter-js, zustand, vitest"
```

---

### Task 2: Data Layer

**Files:**
- Create: `lib/data/experience.ts`
- Create: `lib/data/projects.ts`
- Create: `lib/data/skills.ts`
- Create: `lib/data/terminal.ts`
- Create: `lib/data/planets.ts`
- Create: `lib/__tests__/data.test.ts`

**Interfaces:**
- Produces: `ExperienceNode`, `ProjectItem`, `SkillIcon`, `Planet` — consumed by all section components

- [ ] **Step 1: Write failing data shape tests**

Create `lib/__tests__/data.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run
```

Expected: FAIL — "Cannot find module '../data/experience'"

- [ ] **Step 3: Create experience data**

Create `lib/data/experience.ts`:
```typescript
export type NodeType = 'job' | 'award'

export interface ExperienceNode {
  id: string
  type: NodeType
  title: string
  subtitle: string
  year: number
  period?: string
  bullets?: string[]
  connectedTo?: string[]  // ids of related nodes
}

export const experienceNodes: ExperienceNode[] = [
  {
    id: 'eloquence',
    type: 'job',
    title: 'Research Assistant',
    subtitle: 'ELOQUENCE — EU Horizon Project',
    year: 2026,
    period: 'March 2026 – Present',
    bullets: [
      'Building an AI evaluation framework for LLM-based agents',
      'Defining metrics for hallucination, robustness, and bias across multilingual datasets',
      'Evaluating agentic AI outputs for trustworthiness and multilingual consistency',
    ],
    connectedTo: ['nvidia'],
  },
  {
    id: 'nissan',
    type: 'job',
    title: 'Software Engineer',
    subtitle: 'Nissan Technical Center Europe',
    year: 2023,
    period: 'August 2023 – August 2024',
    bullets: [
      'Developed full-stack React.js + FastAPI app to import test cases into TestRail, reducing manual effort by 60%',
      'Led testing strategy for voice recognition across infotainment systems',
      'Collaborated with Google Automotive Services and Amazon Alexa teams for Qashqai MY2024',
    ],
  },
  {
    id: 'iisc',
    type: 'job',
    title: 'Research Intern — Turing Fellow',
    subtitle: 'Indian Institute of Science (IISc)',
    year: 2023,
    period: 'June 2023 – July 2023',
    bullets: [
      'Awarded Turing Fellowship to research human-robot collaboration',
      'Built hand gesture recognition model with OpenCV, MediaPipe, TensorFlow — 96.67% accuracy',
      'Implemented UR5 robot kinematics in MATLAB and Python',
    ],
  },
  {
    id: 'brunel-intern',
    type: 'job',
    title: 'Summer Student Intern',
    subtitle: 'Brunel University London',
    year: 2022,
    period: 'August 2022 – September 2022',
    bullets: [
      'Built loneliness prediction model using Google NLP API and ML, achieving ~2 RMSE on UCLA scale',
    ],
  },
  {
    id: 'nvidia',
    type: 'award',
    title: 'NVIDIA Hack for Impact — Winner',
    subtitle: '2026',
    year: 2026,
    connectedTo: ['eloquence'],
  },
  {
    id: 'encode-ai',
    type: 'award',
    title: 'Encode AI Hackathon — 1st Prize + 2× Bounties',
    subtitle: '2025',
    year: 2025,
  },
  {
    id: 'university-prize',
    type: 'award',
    title: 'University Prize — Highest Overall Grade',
    subtitle: 'Computer Systems Engineering, 2025',
    year: 2025,
  },
  {
    id: 'royal-v8',
    type: 'award',
    title: 'Royal Hackaway V8 — 3rd Place',
    subtitle: 'Environmental Hack, 2025',
    year: 2025,
  },
  {
    id: 'royal-v6',
    type: 'award',
    title: 'Royal Hackaway V6 — 3rd Place',
    subtitle: '2023',
    year: 2023,
  },
  {
    id: 'gdsc',
    type: 'award',
    title: 'GDSC Hacxmas — Winner',
    subtitle: 'Education Track, 2021',
    year: 2021,
  },
]
```

- [ ] **Step 4: Create projects data**

Create `lib/data/projects.ts`:
```typescript
export type ProjectCategory = 'aiml' | 'blockchain' | 'robotics' | 'fullstack'

export interface ProjectItem {
  id: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  githubUrl: string
  isHackathonWin: boolean
  hackathonLabel?: string
}

export const projects: ProjectItem[] = [
  {
    id: 'hack-the-wallet',
    title: 'Hack the Wallet',
    description: 'Award-winning AI agent game using Gemini API and Starknet (Web3), enabling dynamic NPC interaction via natural language prompts and crypto rewards.',
    category: 'blockchain',
    tags: ['Next.js', 'Starknet', 'Gemini API', 'Web3'],
    githubUrl: 'https://github.com/Zohaib-Eh/HackTheWalletEncode',
    isHackathonWin: true,
    hackathonLabel: 'Encode AI — 1st Prize',
  },
  {
    id: 'medigraph',
    title: 'MediGraph',
    description: 'Full-stack healthcare intelligence platform using knowledge graph architecture with RAG-based natural language querying.',
    category: 'aiml',
    tags: ['Python', 'FastAPI', 'Neo4j', 'LangChain', 'Next.js'],
    githubUrl: 'https://github.com/Zohaib-Eh/MediGraph',
    isHackathonWin: true,
    hackathonLabel: 'HackNation',
  },
  {
    id: 'todo-gitops',
    title: 'GitOps Task Platform',
    description: 'Full-stack app with automated unit tests and CI/CD via GitHub Actions. Dockerized backend deployed to AWS ECR; frontend via S3 + CloudFront.',
    category: 'fullstack',
    tags: ['React.js', 'FastAPI', 'Docker', 'AWS', 'GitHub Actions'],
    githubUrl: 'https://github.com/Zohaib-Eh/todo-gitops',
    isHackathonWin: false,
  },
  {
    id: 'hri',
    title: 'Human-Robot Interaction',
    description: 'Hand gesture recognition model achieving 96.67% accuracy using OpenCV, MediaPipe, and TensorFlow. UR5 robot kinematics in MATLAB and Python. Turing Fellowship research at IISc.',
    category: 'robotics',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'MATLAB'],
    githubUrl: 'https://github.com/Zohaib-Eh/HRI',
    isHackathonWin: false,
  },
  {
    id: 'ripple',
    title: 'Ripple',
    description: 'TBD — fill in description.',
    category: 'aiml',
    tags: ['Python'],
    githubUrl: 'https://github.com/Zohaib-Eh/Ripple',
    isHackathonWin: false,
  },
  {
    id: 'codaline',
    title: 'Codaline',
    description: 'TBD — fill in description.',
    category: 'fullstack',
    tags: ['TypeScript'],
    githubUrl: 'https://github.com/Zohaib-Eh/Codaline',
    isHackathonWin: false,
  },
  {
    id: 'wayfarerr',
    title: 'WayFarer',
    description: 'AI-driven city wallet that predicts your needs based on real-time context — weather, location — to serve dynamic local deals.',
    category: 'aiml',
    tags: ['Dart', 'Flutter', 'AI'],
    githubUrl: 'https://github.com/Zohaib-Eh/WayFarer',
    isHackathonWin: false,
  },
  {
    id: 'carma',
    title: 'Carma',
    description: 'TBD — fill in description.',
    category: 'blockchain',
    tags: ['TypeScript'],
    githubUrl: 'https://github.com/Zohaib-Eh/Carma',
    isHackathonWin: true,
    hackathonLabel: 'Encode AI Hackathon',
  },
  {
    id: 'gofish',
    title: 'GoFish',
    description: 'TBD — fill in description.',
    category: 'blockchain',
    tags: ['TypeScript'],
    githubUrl: 'https://github.com/Zohaib-Eh/GoFish',
    isHackathonWin: true,
    hackathonLabel: 'EasyA Hackathon',
  },
  {
    id: 'llm-ontology',
    title: 'LLM-based Ontology Discovery',
    description: 'TBD — fill in description.',
    category: 'aiml',
    tags: ['Python', 'Jupyter', 'LLM'],
    githubUrl: 'https://github.com/Zohaib-Eh/LLM-based-Ontology-Discovery',
    isHackathonWin: false,
  },
]
```

- [ ] **Step 5: Create skills data**

Create `lib/data/skills.ts`:
```typescript
export type SkillCluster = 'aiml' | 'backend' | 'frontend' | 'devops'

export interface SkillIcon {
  name: string
  cluster: SkillCluster
  iconUrl: string  // path in /public/icons/
}

export const skillIcons: SkillIcon[] = [
  // AI/ML
  { name: 'Python', cluster: 'aiml', iconUrl: '/icons/python.svg' },
  { name: 'TensorFlow', cluster: 'aiml', iconUrl: '/icons/tensorflow.svg' },
  { name: 'LangChain', cluster: 'aiml', iconUrl: '/icons/langchain.svg' },
  { name: 'scikit-learn', cluster: 'aiml', iconUrl: '/icons/scikitlearn.svg' },
  // Backend
  { name: 'FastAPI', cluster: 'backend', iconUrl: '/icons/fastapi.svg' },
  { name: 'Node.js', cluster: 'backend', iconUrl: '/icons/nodejs.svg' },
  { name: 'PostgreSQL', cluster: 'backend', iconUrl: '/icons/postgresql.svg' },
  { name: 'MongoDB', cluster: 'backend', iconUrl: '/icons/mongodb.svg' },
  { name: 'Neo4j', cluster: 'backend', iconUrl: '/icons/neo4j.svg' },
  // Frontend
  { name: 'React', cluster: 'frontend', iconUrl: '/icons/react.svg' },
  { name: 'Next.js', cluster: 'frontend', iconUrl: '/icons/nextjs.svg' },
  { name: 'TypeScript', cluster: 'frontend', iconUrl: '/icons/typescript.svg' },
  // DevOps
  { name: 'AWS', cluster: 'devops', iconUrl: '/icons/aws.svg' },
  { name: 'Docker', cluster: 'devops', iconUrl: '/icons/docker.svg' },
  { name: 'GitHub Actions', cluster: 'devops', iconUrl: '/icons/githubactions.svg' },
  { name: 'GCP', cluster: 'devops', iconUrl: '/icons/gcp.svg' },
]
```

- [ ] **Step 6: Create planets data**

Create `lib/data/planets.ts`:
```typescript
export type PlanetId = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'neptune' | 'saturn'

export interface Planet {
  id: PlanetId
  name: string
  accentColor: string
}

export const planets: Planet[] = [
  { id: 'mercury', name: 'Mercury', accentColor: '#C0C0C0' },
  { id: 'venus',   name: 'Venus',   accentColor: '#E8A020' },
  { id: 'mars',    name: 'Mars',    accentColor: '#E84040' },
  { id: 'jupiter', name: 'Jupiter', accentColor: '#E86020' },
  { id: 'neptune', name: 'Neptune', accentColor: '#20C8E8' },
  { id: 'saturn',  name: 'Saturn',  accentColor: '#E8D020' },
]
```

- [ ] **Step 7: Create terminal data**

Create `lib/data/terminal.ts`:
```typescript
export const terminalData = {
  about: `Zohaib Ehtesham
================
Software Engineer · AI Researcher · Hackathon Winner

First Class BEng Computer Systems Engineering, Brunel University London (2025).
Currently: Research Assistant, ELOQUENCE EU Horizon Project.
Turing Fellowship — IISc Bangalore.

"I build things that shouldn't exist yet."`,

  skills: `Languages & Frameworks: Python, TypeScript, SQL, React.js, Next.js, FastAPI, LangGraph, TensorFlow
Cloud, DevOps & AI/ML: AWS, GCP, Docker, GitHub Actions, sklearn, MongoDB, Neo4j, LangChain, RAG
Certifications: AWS CCP (CLF-C02), BCS Foundation Certificate in Ethical AI (Ongoing)`,

  awards: `2026  NVIDIA Hack for Impact ................ Winner
2025  Encode AI Hackathon .................. 1st Prize + 2x Bounties (500+ participants)
2025  University Prize ..................... Highest Overall Grade, Computer Systems Engineering
2025  Royal Hackaway V8 ................... 3rd Place — Environmental Hack
2023  Royal Hackaway V6 ................... 3rd Place
2021  GDSC Hacxmas Hackathon .............. Winner — Education Track`,

  contact: `Email:    zohaib.ehtesham@gmail.com
GitHub:   github.com/Zohaib-Eh
LinkedIn: linkedin.com/in/zohaib-ehtesham

[personal socials are classified — you know what to do]`,

  secret: `nice try :)`,

  experience: ['eloquence', 'nissan', 'iisc', 'brunel-intern'],

  jobs: {
    eloquence: `Research Assistant — ELOQUENCE (EU Horizon Project)
March 2026 – Present
• Building AI evaluation framework for LLM-based agents
• Metrics: hallucination, robustness, bias across multilingual datasets`,
    nissan: `Software Engineer — Nissan Technical Center Europe
August 2023 – August 2024
• React.js + FastAPI app: reduced manual effort by 60%
• Voice recognition testing: Google Automotive, Amazon Alexa`,
    iisc: `Research Intern (Turing Fellow) — Indian Institute of Science
June 2023 – July 2023
• Hand gesture recognition: 96.67% accuracy (OpenCV, MediaPipe, TensorFlow)
• UR5 robot kinematics in MATLAB + Python`,
    'brunel-intern': `Summer Intern — Brunel University London
August 2022 – September 2022
• Loneliness prediction model: ~2 RMSE on UCLA scale (Google NLP API)`,
  },

  projects: ['hack-the-wallet', 'medigraph', 'todo-gitops', 'hri'],

  projectDetails: {
    'hack-the-wallet': `Hack the Wallet — Encode AI 1st Prize Winner
Stack: Next.js, Starknet, Gemini API, Web3
AI agent game with dynamic NPC interaction via natural language + crypto rewards.`,
    medigraph: `MediGraph — HackNation
Stack: Python, FastAPI, Neo4j, LangChain, Next.js
Healthcare intelligence platform with RAG-based natural language querying.`,
    'todo-gitops': `GitOps Task Platform
Stack: React.js, FastAPI, SQLite, Docker, AWS, GitHub Actions
Full-stack with CI/CD, containerized backend on AWS ECR, frontend on S3+CloudFront.`,
    hri: `Human-Robot Interaction — IISc Turing Fellowship
Stack: Python, OpenCV, MediaPipe, TensorFlow, MATLAB
Gesture recognition at 96.67% accuracy, UR5 robot kinematics.`,
  },
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: All 4 test suites pass.

- [ ] **Step 9: Commit**

```bash
git add lib/
git commit -m "feat: data layer — experience, projects, skills, planets, terminal content"
```

---

### Task 3: Zustand Theme Store

**Files:**
- Create: `lib/store/themeStore.ts`
- Create: `lib/__tests__/themeStore.test.ts`

**Interfaces:**
- Produces: `useThemeStore` hook — consumed by `PlanetTracker`, `PlanetDropdown`, `PuzzleSlot`, and `app/layout.tsx` (for CSS var injection)
- Produces: `unlockPlanet(planet: PlanetId)`, `setActiveTheme(planet: PlanetId)`, `unlockedPlanets: PlanetId[]`, `activeTheme: PlanetId | null`

- [ ] **Step 1: Write failing store tests**

Create `lib/__tests__/themeStore.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../store/themeStore'

beforeEach(() => {
  useThemeStore.setState({ unlockedPlanets: [], activeTheme: null })
})

describe('useThemeStore', () => {
  it('starts with no unlocked planets', () => {
    expect(useThemeStore.getState().unlockedPlanets).toEqual([])
  })

  it('unlocks a planet', () => {
    useThemeStore.getState().unlockPlanet('mars')
    expect(useThemeStore.getState().unlockedPlanets).toContain('mars')
  })

  it('does not duplicate an already-unlocked planet', () => {
    useThemeStore.getState().unlockPlanet('mars')
    useThemeStore.getState().unlockPlanet('mars')
    expect(useThemeStore.getState().unlockedPlanets.filter(p => p === 'mars')).toHaveLength(1)
  })

  it('sets active theme', () => {
    useThemeStore.getState().unlockPlanet('neptune')
    useThemeStore.getState().setActiveTheme('neptune')
    expect(useThemeStore.getState().activeTheme).toBe('neptune')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run lib/__tests__/themeStore.test.ts
```

Expected: FAIL — "Cannot find module '../store/themeStore'"

- [ ] **Step 3: Implement the store**

Create `lib/store/themeStore.ts`:
```typescript
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanetId } from '@/lib/data/planets'

interface ThemeStore {
  unlockedPlanets: PlanetId[]
  activeTheme: PlanetId | null
  unlockPlanet: (planet: PlanetId) => void
  setActiveTheme: (planet: PlanetId) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      unlockedPlanets: [],
      activeTheme: null,
      unlockPlanet: (planet) =>
        set((s) => ({
          unlockedPlanets: s.unlockedPlanets.includes(planet)
            ? s.unlockedPlanets
            : [...s.unlockedPlanets, planet],
        })),
      setActiveTheme: (planet) => set({ activeTheme: planet }),
    }),
    { name: 'zohaib-portfolio-theme' }
  )
)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run lib/__tests__/themeStore.test.ts
```

Expected: All 4 tests pass.

- [ ] **Step 5: Wire accent color into layout**

The store needs to inject the active planet's accent color as a CSS custom property. Add a client component that does this:

Create `components/ui/ThemeInjector.tsx`:
```typescript
'use client'
import { useEffect } from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function ThemeInjector() {
  const activeTheme = useThemeStore((s) => s.activeTheme)

  useEffect(() => {
    const planet = planets.find(p => p.id === activeTheme)
    document.documentElement.style.setProperty(
      '--accent',
      planet ? planet.accentColor : '#ffffff'
    )
  }, [activeTheme])

  return null
}
```

Update `app/layout.tsx` — add `<ThemeInjector />` inside `<body>`:
```typescript
import { ThemeInjector } from '@/components/ui/ThemeInjector'
// ... existing imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-bg text-white">
        <ThemeInjector />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/store/ components/ui/ThemeInjector.tsx app/layout.tsx
git commit -m "feat: zustand theme store with planet unlock system and CSS var injection"
```

---

## Phase 2 — Layout & Hero

### Task 4: Starfield Canvas

**Files:**
- Create: `components/ui/StarfieldCanvas.tsx`
- Create: `components/ui/__tests__/StarfieldCanvas.test.tsx`

**Interfaces:**
- Produces: `<StarfieldCanvas />` — used by `Hero.tsx` as full-screen background

- [ ] **Step 1: Write failing render test**

Create `components/ui/__tests__/StarfieldCanvas.test.tsx`:
```typescript
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StarfieldCanvas } from '../StarfieldCanvas'

describe('StarfieldCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<StarfieldCanvas />)
    expect(container.querySelector('canvas')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run
```

Expected: FAIL — "Cannot find module '../StarfieldCanvas'"

- [ ] **Step 3: Implement StarfieldCanvas**

Create `components/ui/StarfieldCanvas.tsx`:
```typescript
'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
}

function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.15 + 0.05,
    opacity: Math.random() * 0.7 + 0.3,
  }))
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = createStars(prefersReduced ? 40 : 120, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        // subtle parallax: stars near mouse drift slightly
        const dx = (mouseRef.current.x - canvas.width / 2) * 0.002 * star.speed
        const dy = (mouseRef.current.y - canvas.height / 2) * 0.002 * star.speed
        ctx.beginPath()
        ctx.arc(star.x + dx, star.y + dy, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`
        ctx.fill()

        if (!prefersReduced) {
          star.y += star.speed * 0.1
          if (star.y > canvas.height) {
            star.y = 0
            star.x = Math.random() * canvas.width
          }
        }
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/ui/StarfieldCanvas.tsx components/ui/__tests__/
git commit -m "feat: starfield canvas with mouse parallax and reduced-motion support"
```

---

### Task 5: Navbar + Planet Dropdown

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/PlanetDropdown.tsx`

**Interfaces:**
- Consumes: `useThemeStore` — `unlockedPlanets`, `activeTheme`, `setActiveTheme`
- Consumes: `planets` from `lib/data/planets.ts`
- Produces: `<Navbar />` — used in `app/page.tsx`

- [ ] **Step 1: Create PlanetDropdown**

Create `components/layout/PlanetDropdown.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function PlanetDropdown() {
  const [open, setOpen] = useState(false)
  const { unlockedPlanets, activeTheme, setActiveTheme } = useThemeStore()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-xs hover:border-accent transition-colors"
        aria-label="Theme selector"
      >
        🪐
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-2 min-w-[140px] z-50">
          {planets.map(planet => {
            const unlocked = unlockedPlanets.includes(planet.id)
            const active = activeTheme === planet.id
            return (
              <button
                key={planet.id}
                disabled={!unlocked}
                onClick={() => { setActiveTheme(planet.id); setOpen(false) }}
                className={`flex items-center gap-2 text-sm px-2 py-1 rounded-lg transition-colors
                  ${unlocked ? 'hover:bg-white/10 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                  ${active ? 'bg-white/10' : ''}`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: planet.accentColor }}
                />
                <span>{planet.name}</span>
                {!unlocked && <span className="ml-auto text-xs">🔒</span>}
              </button>
            )
          })}
          <p className="text-white/30 text-[10px] text-center pt-1 border-t border-white/10">
            solve puzzles to unlock
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create Navbar**

Create `components/layout/Navbar.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { PlanetDropdown } from './PlanetDropdown'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {/* Pill */}
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5">
        <span className="font-serif font-bold text-sm tracking-wide">Zohaib Ehtesham.</span>
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden text-white/70"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>
      <PlanetDropdown />
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/
git commit -m "feat: navbar pill with planet theme dropdown"
```

---

### Task 6: Hero Section + Rotating Text + Planet Tracker

**Files:**
- Create: `components/ui/RotatingText.tsx`
- Create: `components/ui/PlanetTracker.tsx`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `StarfieldCanvas`, `RotatingText`, `PlanetTracker`
- Produces: `<Hero />` — used in `app/page.tsx`

- [ ] **Step 1: Create RotatingText**

Create `components/ui/RotatingText.tsx`:
```typescript
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
```

- [ ] **Step 2: Create PlanetTracker**

Create `components/ui/PlanetTracker.tsx`:
```typescript
'use client'
import { useThemeStore } from '@/lib/store/themeStore'
import { planets } from '@/lib/data/planets'

export function PlanetTracker() {
  const { unlockedPlanets, activeTheme, setActiveTheme } = useThemeStore()

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-center">
      <span className="text-white/30 text-[10px] mb-1 tracking-widest uppercase">Planets</span>
      {planets.map(planet => {
        const unlocked = unlockedPlanets.includes(planet.id)
        const active = activeTheme === planet.id
        return (
          <button
            key={planet.id}
            title={unlocked ? planet.name : '???'}
            onClick={() => unlocked && setActiveTheme(planet.id)}
            disabled={!unlocked}
            className={`w-5 h-5 rounded-full border transition-all duration-300
              ${unlocked
                ? 'border-white/40 cursor-pointer hover:scale-125'
                : 'border-white/10 cursor-not-allowed bg-white/5'}
              ${active ? 'scale-125 ring-2 ring-offset-1 ring-offset-bg' : ''}`}
            style={unlocked ? {
              backgroundColor: planet.accentColor,
              boxShadow: active ? `0 0 10px ${planet.accentColor}` : undefined,
              // @ts-ignore
              '--tw-ring-color': planet.accentColor,
            } : {}}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create Hero section**

Create `components/sections/Hero.tsx`:
```typescript
'use client'
import { motion } from 'framer-motion'
import { StarfieldCanvas } from '@/components/ui/StarfieldCanvas'
import { RotatingText } from '@/components/ui/RotatingText'

interface HeroProps {
  onOpenTerminal: () => void
}

export function Hero({ onOpenTerminal }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <StarfieldCanvas />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-sm tracking-[0.3em] uppercase mb-4"
        >
          Hello, I&apos;m
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-6xl md:text-8xl font-bold mb-4 leading-none"
        >
          Zohaib Ehtesham
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-3xl font-light mb-8 text-white/80"
        >
          <RotatingText />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-accent text-bg font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={{ color: '#050510' }}
          >
            See My Work
          </a>
          <button
            onClick={onOpenTerminal}
            className="px-8 py-3 border border-white/20 rounded-full hover:border-accent hover:text-accent transition-colors font-mono text-sm"
          >
            &gt;_ Mission Control
          </button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-white/30 text-xs tracking-widest"
        >
          scroll to explore
        </motion.p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create page.tsx skeleton**

Replace `app/page.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { PlanetTracker } from '@/components/ui/PlanetTracker'
import { Hero } from '@/components/sections/Hero'

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false)

  return (
    <main>
      <Navbar />
      <PlanetTracker />
      <Hero onOpenTerminal={() => setTerminalOpen(true)} />
      {/* Sections added in subsequent tasks */}
    </main>
  )
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: Dark space background with starfield, "Zohaib Ehtesham" in large serif, rotating subtitle, two CTAs, navbar pill at top, planet tracker on right.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Hero.tsx components/ui/RotatingText.tsx components/ui/PlanetTracker.tsx app/page.tsx
git commit -m "feat: hero section with starfield, rotating title, planet tracker"
```

---

## Phase 3 — Content Sections

### Task 7: About Section

**Files:**
- Create: `components/sections/About.tsx`

**Interfaces:**
- Produces: `<About />` — add to `app/page.tsx`

- [ ] **Step 1: Create About section**

Create `components/sections/About.tsx`:
```typescript
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

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
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-10">
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
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Add to page.tsx**

```typescript
import { About } from '@/components/sections/About'
// in <main>:
<About />
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/About.tsx app/page.tsx
git commit -m "feat: about section with bio and scroll-in animation"
```

---

### Task 8: Experience — Neural Network

**Files:**
- Create: `components/experience/NeuralNetwork.tsx`
- Create: `components/experience/NetworkNode.tsx`
- Create: `components/experience/NodeDetail.tsx`
- Create: `components/sections/Experience.tsx`

**Interfaces:**
- Consumes: `experienceNodes: ExperienceNode[]` from `lib/data/experience.ts`
- Produces: `<Experience />` — add to `app/page.tsx`

- [ ] **Step 1: Create NetworkNode**

Create `components/experience/NetworkNode.tsx`:
```typescript
'use client'
import { motion } from 'framer-motion'
import type { ExperienceNode } from '@/lib/data/experience'

interface NetworkNodeProps {
  node: ExperienceNode
  x: number
  y: number
  visible: boolean
  selected: boolean
  onClick: () => void
}

export function NetworkNode({ node, x, y, visible, selected, onClick }: NetworkNodeProps) {
  const isJob = node.type === 'job'
  const r = isJob ? 28 : 16

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <circle
        cx={x}
        cy={y}
        r={r}
        className={`transition-all duration-300 ${
          selected
            ? 'fill-accent stroke-accent'
            : isJob
            ? 'fill-white/10 stroke-white/40 hover:fill-white/20'
            : 'fill-accent/20 stroke-accent/60 hover:fill-accent/40'
        }`}
        strokeWidth={selected ? 2 : 1.5}
        style={{ fill: selected ? 'var(--accent)' : undefined }}
      />
      {node.type === 'award' && (
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          className="pointer-events-none select-none"
        >
          ★
        </text>
      )}
    </motion.g>
  )
}
```

- [ ] **Step 2: Create NodeDetail panel**

Create `components/experience/NodeDetail.tsx`:
```typescript
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import type { ExperienceNode } from '@/lib/data/experience'

interface NodeDetailProps {
  node: ExperienceNode | null
  onClose: () => void
}

export function NodeDetail({ node, onClose }: NodeDetailProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="absolute right-0 top-0 w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 z-20"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white text-xl"
          >
            ×
          </button>
          <p className="text-accent text-xs tracking-widest uppercase mb-1">
            {node.type === 'award' ? 'Award' : 'Experience'}
          </p>
          <h3 className="font-serif text-lg font-bold mb-1">{node.title}</h3>
          <p className="text-white/50 text-sm mb-3">{node.subtitle}</p>
          {node.period && (
            <p className="text-white/40 text-xs mb-4">{node.period}</p>
          )}
          {node.bullets && (
            <ul className="space-y-2">
              {node.bullets.map((b, i) => (
                <li key={i} className="text-white/70 text-sm flex gap-2">
                  <span className="text-accent mt-0.5 flex-shrink-0">·</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Create NeuralNetwork graph**

Create `components/experience/NeuralNetwork.tsx`:
```typescript
'use client'
import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { experienceNodes } from '@/lib/data/experience'
import { NetworkNode } from './NetworkNode'
import { NodeDetail } from './NodeDetail'
import type { ExperienceNode } from '@/lib/data/experience'

// Layout positions for nodes (SVG viewBox 0 0 600 500)
const nodePositions: Record<string, { x: number; y: number }> = {
  'eloquence':     { x: 300, y: 60  },
  'nvidia':        { x: 460, y: 100 },
  'encode-ai':     { x: 160, y: 140 },
  'university-prize': { x: 440, y: 200 },
  'nissan':        { x: 280, y: 200 },
  'royal-v8':      { x: 130, y: 270 },
  'iisc':          { x: 380, y: 310 },
  'royal-v6':      { x: 500, y: 360 },
  'brunel-intern': { x: 220, y: 380 },
  'gdsc':          { x: 100, y: 420 },
}

// Edges: [fromId, toId]
const edges: [string, string][] = [
  ['eloquence', 'nvidia'],
  ['eloquence', 'nissan'],
  ['nissan', 'encode-ai'],
  ['nissan', 'university-prize'],
  ['nissan', 'iisc'],
  ['iisc', 'royal-v6'],
  ['iisc', 'brunel-intern'],
  ['brunel-intern', 'royal-v8'],
  ['brunel-intern', 'gdsc'],
]

export function NeuralNetwork() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-150px' })
  const [selected, setSelected] = useState<ExperienceNode | null>(null)

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 600 500" className="w-full h-auto">
        {/* Edges */}
        {edges.map(([from, to]) => {
          const a = nodePositions[from]
          const b = nodePositions[to]
          if (!a || !b) return null
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            />
          )
        })}
        {/* Nodes */}
        {experienceNodes.map((node, i) => {
          const pos = nodePositions[node.id]
          if (!pos) return null
          return (
            <NetworkNode
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              visible={inView}
              selected={selected?.id === node.id}
              onClick={() => setSelected(n => n?.id === node.id ? null : node)}
            />
          )
        })}
      </svg>
      {/* Labels */}
      {experienceNodes.map(node => {
        const pos = nodePositions[node.id]
        if (!pos) return null
        const isJob = node.type === 'job'
        return (
          <div
            key={`label-${node.id}`}
            className="absolute pointer-events-none text-center"
            style={{
              left: `${(pos.x / 600) * 100}%`,
              top: `${(pos.y / 500) * 100}%`,
              transform: `translate(-50%, ${isJob ? '36px' : '24px'})`,
            }}
          >
            <p className="text-white/60 text-xs whitespace-nowrap">{node.title}</p>
          </div>
        )
      })}
      <NodeDetail node={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
```

- [ ] **Step 4: Create Experience section**

Create `components/sections/Experience.tsx`:
```typescript
'use client'
import { NeuralNetwork } from '@/components/experience/NeuralNetwork'

export function Experience() {
  return (
    <section id="experience" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Career</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-center">
          Experience & Awards
        </h2>
        <p className="text-white/40 text-center mb-16 text-sm">
          click any node to explore
        </p>
        <NeuralNetwork />
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Add mobile fallback to NeuralNetwork**

In `components/experience/NeuralNetwork.tsx`, add at the top of the component body:

```typescript
const [isMobile, setIsMobile] = useState(false)
useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])

if (isMobile) {
  return (
    <div className="space-y-8 px-4">
      {experienceNodes.filter(n => n.type === 'job').map(node => (
        <div key={node.id} className="border-l border-white/20 pl-6">
          <p className="text-accent text-xs mb-1">{node.period}</p>
          <h3 className="font-semibold">{node.title}</h3>
          <p className="text-white/50 text-sm">{node.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Add to page.tsx**

```typescript
import { Experience } from '@/components/sections/Experience'
// in <main> after <About />:
<Experience />
```

- [ ] **Step 7: Verify in browser**

```bash
npm run dev
```

Scroll to experience section. Nodes should animate in. Click a node to see detail panel.

- [ ] **Step 7: Commit**

```bash
git add components/experience/ components/sections/Experience.tsx app/page.tsx
git commit -m "feat: neural network experience timeline with scroll-driven node animation"
```

---

### Task 9: Projects Section

**Files:**
- Create: `components/projects/CategoryFilter.tsx`
- Create: `components/projects/ProjectCard.tsx`
- Create: `components/projects/ProjectModal.tsx`
- Create: `components/sections/Projects.tsx`

**Interfaces:**
- Consumes: `projects: ProjectItem[]`, `ProjectCategory` from `lib/data/projects.ts`
- Produces: `<Projects />` — add to `app/page.tsx`

- [ ] **Step 1: Create CategoryFilter**

Create `components/projects/CategoryFilter.tsx`:
```typescript
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
```

- [ ] **Step 2: Create ProjectCard**

Create `components/projects/ProjectCard.tsx`:
```typescript
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
      {project.isHackathonWin && (
        <div className="absolute top-4 right-4 bg-accent/20 border border-accent/40 rounded-full px-2 py-0.5 text-[10px] text-accent font-medium"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          🏆 {project.hackathonLabel}
        </div>
      )}
      <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-accent transition-colors">
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
```

- [ ] **Step 3: Create ProjectModal**

Create `components/projects/ProjectModal.tsx`:
```typescript
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
            {project.isHackathonWin && (
              <p className="text-accent text-xs tracking-widest uppercase mb-2">
                🏆 {project.hackathonLabel}
              </p>
            )}
            <h2 className="font-serif text-3xl font-bold mb-2">{project.title}</h2>
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
```

- [ ] **Step 4: Create Projects section**

Create `components/sections/Projects.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { projects } from '@/lib/data/projects'
import { CategoryFilter } from '@/components/projects/CategoryFilter'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
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
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
```

- [ ] **Step 5: Add to page.tsx**

```typescript
import { Projects } from '@/components/sections/Projects'
// after <Experience />:
<Projects />
```

- [ ] **Step 6: Commit**

```bash
git add components/projects/ components/sections/Projects.tsx app/page.tsx
git commit -m "feat: projects section with category filter, cards, and detail modal"
```

---

### Task 10: Skills Section

**Files:**
- Create: `components/skills/PhysicsIcons.tsx`
- Create: `components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `skillIcons: SkillIcon[]` from `lib/data/skills.ts`
- Produces: `<Skills />` — add to `app/page.tsx`

- [ ] **Step 1: Create PhysicsIcons**

Create `components/skills/PhysicsIcons.tsx`:
```typescript
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { skillIcons } from '@/lib/data/skills'

// On mobile, skip Matter.js and render a static grid
function StaticIcons() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {skillIcons.map(skill => (
        <div key={skill.name} className="flex flex-col items-center gap-1 w-16">
          <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
          <span className="text-[10px] text-white/40 text-center">{skill.name}</span>
        </div>
      ))}
    </div>
  )
}

export function PhysicsIcons() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true })
  const [isMobile, setIsMobile] = useState(false)
  const engineRef = useRef<any>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    if (!inView || isMobile || !containerRef.current) return

    let Matter: any
    let runner: any

    const init = async () => {
      Matter = await import('matter-js')
      const { Engine, Render, Runner, Bodies, Body, Events, World, Mouse, MouseConstraint } = Matter

      const container = containerRef.current!
      const W = container.offsetWidth
      const H = container.offsetHeight

      const engine = Engine.create({ gravity: { x: 0, y: 0 } })
      engineRef.current = engine

      const bodies = skillIcons.map((skill, i) => {
        const cols = 6
        const x = (i % cols) * (W / cols) + W / cols / 2
        const y = Math.floor(i / cols) * 80 + 60
        const body = Bodies.circle(x, y, 28, {
          restitution: 0.6,
          friction: 0.1,
          label: skill.name,
        })
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        })
        return body
      })

      World.add(engine.world, bodies)

      // Mouse repulsion on mousemove
      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const mx = e.clientX - rect.left
        const my = e.clientY - rect.top
        bodies.forEach(body => {
          const dx = body.position.x - mx
          const dy = body.position.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const force = 0.005 * (1 - dist / 120)
            Body.applyForce(body, body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            })
          }
        })
      }
      container.addEventListener('mousemove', onMouseMove)

      // Keep bodies within bounds
      runner = Runner.create()
      Runner.run(runner, engine)

      Events.on(engine, 'afterUpdate', () => {
        bodies.forEach(body => {
          const { x, y } = body.position
          let vx = body.velocity.x
          let vy = body.velocity.y
          if (x < 28 || x > W - 28) vx *= -1
          if (y < 28 || y > H - 28) vy *= -1
          Body.setVelocity(body, { x: vx * 0.98, y: vy * 0.98 })
          Body.setPosition(body, {
            x: Math.max(28, Math.min(W - 28, x)),
            y: Math.max(28, Math.min(H - 28, y)),
          })
        })
        // Force re-render by updating a ref
        if (containerRef.current) {
          bodies.forEach((body, i) => {
            const el = containerRef.current!.querySelector(`[data-body="${i}"]`) as HTMLElement
            if (el) {
              el.style.transform = `translate(${body.position.x - 28}px, ${body.position.y - 28}px)`
            }
          })
        }
      })

      return () => {
        container.removeEventListener('mousemove', onMouseMove)
        Runner.stop(runner)
        Engine.clear(engine)
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [inView, isMobile])

  if (isMobile) return <StaticIcons />

  return (
    <div ref={containerRef} className="relative w-full h-[400px] overflow-hidden">
      {skillIcons.map((skill, i) => (
        <div
          key={skill.name}
          data-body={i}
          className="absolute w-14 h-14 flex flex-col items-center gap-1 pointer-events-none"
          style={{ transform: `translate(${(i % 6) * 100 + 20}px, ${Math.floor(i / 6) * 80 + 20}px)` }}
        >
          <img src={skill.iconUrl} alt={skill.name} className="w-10 h-10 object-contain" />
          <span className="text-[9px] text-white/30 text-center whitespace-nowrap">{skill.name}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create Skills section**

Create `components/sections/Skills.tsx`:
```typescript
'use client'
import { PhysicsIcons } from '@/components/skills/PhysicsIcons'

export function Skills() {
  return (
    <section id="skills" className="relative z-10 py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Stack</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-16 text-center">Skills</h2>
        <PhysicsIcons />
        <p className="text-white/20 text-xs text-center mt-4">hover to interact</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to page.tsx**

```typescript
import { Skills } from '@/components/sections/Skills'
// after <Projects />:
<Skills />
```

- [ ] **Step 4: Download tech icons**

Download SVG icons from https://devicons.github.io/devicon/ and save to `public/icons/`. Needed: `python.svg`, `tensorflow.svg`, `langchain.svg`, `scikitlearn.svg`, `fastapi.svg`, `nodejs.svg`, `postgresql.svg`, `mongodb.svg`, `neo4j.svg`, `react.svg`, `nextjs.svg`, `typescript.svg`, `aws.svg`, `docker.svg`, `githubactions.svg`, `gcp.svg`.

For any icon not available on devicons, use a simple text fallback or find an equivalent SVG.

- [ ] **Step 5: Commit**

```bash
git add components/skills/ components/sections/Skills.tsx app/page.tsx public/icons/
git commit -m "feat: physics skill icons with matter-js mouse repulsion"
```

---

### Task 11: Contact Section + API Route

**Files:**
- Create: `components/sections/Contact.tsx`
- Create: `app/api/contact/route.ts`

**Interfaces:**
- Produces: `<Contact />` — add to `app/page.tsx`
- Produces: `POST /api/contact` — accepts `{ name, email, message }`, sends email via Resend

- [ ] **Step 1: Create contact API route**

Create `app/api/contact/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: 'zohaib.ehtesham@gmail.com',
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
```

Add to `.env.local`:
```
RESEND_API_KEY=your_resend_api_key_here
```

Get a free Resend API key at resend.com — free tier sends 3000 emails/month.

- [ ] **Step 2: Create Contact section**

Create `components/sections/Contact.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <section id="contact" className="relative z-10 py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4 text-center">Contact</p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-center">
          Let&apos;s talk.
        </h2>
        <p className="text-white/40 text-center mb-12 text-sm">
          zohaib.ehtesham@gmail.com
        </p>
        {status === 'sent' ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-accent text-lg"
          >
            Message sent. I&apos;ll be in touch.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
            />
            {status === 'error' && (
              <p className="text-red-400 text-sm">Something went wrong — try emailing directly.</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 bg-accent text-bg font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ color: '#050510' }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
        <div className="flex justify-center gap-6 mt-12 text-white/30 text-sm">
          <a href="https://github.com/Zohaib-Eh" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/zohaib-ehtesham" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
        </div>
        <p className="text-center text-white/20 text-xs mt-8">
          psst — there&apos;s more to discover if you explore.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to page.tsx**

```typescript
import { Contact } from '@/components/sections/Contact'
// after <Skills />:
<Contact />
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/Contact.tsx app/api/contact/route.ts .env.local
git commit -m "feat: contact section with resend api route"
```

---

## Phase 4 — Easter Eggs

### Task 12: Terminal Overlay

**Files:**
- Create: `lib/terminal/filesystem.ts`
- Create: `lib/terminal/parser.ts`
- Create: `lib/__tests__/terminal.test.ts`
- Create: `components/easter-eggs/Terminal.tsx`

**Interfaces:**
- Consumes: `terminalData` from `lib/data/terminal.ts`
- Produces: `<Terminal open={boolean} onClose={() => void} />` — used in `app/page.tsx`

- [ ] **Step 1: Write parser tests**

Create `lib/__tests__/terminal.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { parseCommand } from '../terminal/parser'

describe('terminal parser', () => {
  it('returns help text for "help"', () => {
    expect(parseCommand('help', [])).toContain('available commands')
  })

  it('lists files for "ls" at root', () => {
    const out = parseCommand('ls', [])
    expect(out).toContain('about.txt')
    expect(out).toContain('experience/')
    expect(out).toContain('projects/')
  })

  it('returns about text for "cat about.txt"', () => {
    const out = parseCommand('cat about.txt', [])
    expect(out).toContain('Zohaib Ehtesham')
  })

  it('changes directory for "cd experience/"', () => {
    const result = parseCommand('cd experience/', [])
    expect(result).toContain('experience')
  })

  it('returns error for unknown command', () => {
    const out = parseCommand('unknowncmd', [])
    expect(out).toContain('command not found')
  })

  it('returns secret message for "cat secret.txt"', () => {
    const out = parseCommand('cat secret.txt', [])
    expect(out).toContain('nice try')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run lib/__tests__/terminal.test.ts
```

Expected: FAIL — "Cannot find module '../terminal/parser'"

- [ ] **Step 3: Implement the parser**

Create `lib/terminal/filesystem.ts`:
```typescript
export const filesystem = {
  root: ['about.txt', 'contact.txt', 'skills.txt', 'awards.txt', 'secret.txt', 'experience/', 'projects/'],
  experience: ['eloquence.txt', 'nissan.txt', 'iisc.txt', 'brunel-intern.txt'],
  projects: ['hack-the-wallet.txt', 'medigraph.txt', 'todo-gitops.txt', 'hri.txt'],
}
```

Create `lib/terminal/parser.ts`:
```typescript
import { terminalData } from '@/lib/data/terminal'
import { filesystem } from './filesystem'

const HELP = `available commands:
  ls              list files
  cd <dir>        change directory
  cat <file>      read a file
  ssh github      open GitHub
  ssh linkedin    open LinkedIn
  clear           clear terminal
  exit / close    close terminal`

export function parseCommand(input: string, cwd: string[]): string {
  const trimmed = input.trim()
  const [cmd, ...args] = trimmed.split(' ')
  const arg = args.join(' ')
  const dir = cwd[cwd.length - 1] ?? 'root'

  switch (cmd) {
    case 'help':
      return HELP

    case 'ls': {
      const files = filesystem[dir as keyof typeof filesystem] ?? filesystem.root
      return files.join('  ')
    }

    case 'cd': {
      const target = arg.replace('/', '').replace('.', '')
      if (target === '' || target === '~') return 'cd: moved to ~'
      if (target === '..') return 'cd: moved up'
      if (filesystem[target as keyof typeof filesystem]) return `cd: now in ${target}/`
      return `cd: ${arg}: No such file or directory`
    }

    case 'cat': {
      if (arg === 'about.txt') return terminalData.about
      if (arg === 'skills.txt') return terminalData.skills
      if (arg === 'awards.txt') return terminalData.awards
      if (arg === 'contact.txt') return terminalData.contact
      if (arg === 'secret.txt') return terminalData.secret
      // Job files
      const jobKey = arg.replace('.txt', '') as keyof typeof terminalData.jobs
      if (terminalData.jobs[jobKey]) return terminalData.jobs[jobKey]
      // Project files
      const projKey = arg.replace('.txt', '') as keyof typeof terminalData.projectDetails
      if (terminalData.projectDetails[projKey]) return terminalData.projectDetails[projKey]
      return `cat: ${arg}: No such file or directory`
    }

    case 'ssh': {
      if (arg === 'github') {
        if (typeof window !== 'undefined') window.open('https://github.com/Zohaib-Eh', '_blank')
        return 'Opening GitHub...'
      }
      if (arg === 'linkedin') {
        if (typeof window !== 'undefined') window.open('https://www.linkedin.com/in/zohaib-ehtesham', '_blank')
        return 'Opening LinkedIn...'
      }
      return `ssh: ${arg}: connection refused`
    }

    case 'whoami':
      return 'zohaib — software engineer, ai researcher, hackathon winner'

    case 'pwd':
      return cwd.length > 0 ? `~/${cwd.join('/')}` : '~'

    case '':
      return ''

    default:
      return `${cmd}: command not found. Type "help" for available commands.`
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run lib/__tests__/terminal.test.ts
```

Expected: All 6 tests pass.

- [ ] **Step 5: Create Terminal component**

Create `components/easter-eggs/Terminal.tsx`:
```typescript
'use client'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseCommand } from '@/lib/terminal/parser'

interface TerminalProps {
  open: boolean
  onClose: () => void
}

interface Line {
  type: 'input' | 'output'
  content: string
  cwd: string[]
}

export function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', content: 'zohaib@mission-control — type "help" to get started', cwd: [] },
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [histIndex, setHistIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Keyboard shortcut: backtick to open/close
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault()
        if (!open) return // only close via onClose prop
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const submit = () => {
    const trimmed = input.trim()
    const inputLine: Line = { type: 'input', content: trimmed, cwd: [...cwd] }

    if (trimmed === 'clear') {
      setLines([])
      setInput('')
      return
    }
    if (trimmed === 'exit' || trimmed === 'close') {
      onClose()
      setInput('')
      return
    }

    // Handle cd for cwd tracking
    let nextCwd = [...cwd]
    if (trimmed.startsWith('cd ')) {
      const arg = trimmed.slice(3).replace('/', '')
      if (arg === '..' || arg === '') nextCwd = nextCwd.slice(0, -1)
      else if (['experience', 'projects'].includes(arg)) nextCwd = [arg]
    }

    const output = parseCommand(trimmed, cwd)
    const outputLine: Line = { type: 'output', content: output, cwd: nextCwd }

    setLines(l => [...l, inputLine, ...(output ? [outputLine] : [])])
    setCwd(nextCwd)
    setHistory(h => [trimmed, ...h])
    setHistIndex(-1)
    setInput('')
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'ArrowUp') {
      const i = Math.min(histIndex + 1, history.length - 1)
      setHistIndex(i)
      setInput(history[i] ?? '')
    }
    if (e.key === 'ArrowDown') {
      const i = Math.max(histIndex - 1, -1)
      setHistIndex(i)
      setInput(i === -1 ? '' : history[i])
    }
  }

  const prompt = `zohaib@mission-control:${cwd.length > 0 ? `~/${cwd.join('/')}` : '~'}$`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
            md:w-[680px] z-[60] rounded-xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Title bar */}
          <div className="bg-[#1e1e1e] flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="flex-1 text-center text-[11px] text-white/30 font-mono">Terminal</span>
          </div>
          {/* Output */}
          <div
            className="bg-[#0d0d0d] font-mono text-sm h-80 overflow-y-auto p-4 space-y-1"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div key={i}>
                {line.type === 'input' ? (
                  <p>
                    <span className="text-[#20C8E8]">{`zohaib@mission-control:~$ `}</span>
                    <span className="text-white">{line.content}</span>
                  </p>
                ) : (
                  <p className="text-[#a8b1be] whitespace-pre-wrap">{line.content}</p>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div className="bg-[#0d0d0d] border-t border-white/5 px-4 py-3 flex items-center gap-2 font-mono text-sm">
            <span className="text-[#20C8E8] flex-shrink-0">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              className="flex-1 bg-transparent text-white outline-none caret-accent"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 6: Wire terminal into page.tsx**

```typescript
import { Terminal } from '@/components/easter-eggs/Terminal'
// in Home component — terminal is already wired via terminalOpen state:
<Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
```

Also add global backtick shortcut to open terminal in page.tsx:
```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === '`') setTerminalOpen(o => !o)
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```

- [ ] **Step 7: Commit**

```bash
git add lib/terminal/ lib/__tests__/terminal.test.ts components/easter-eggs/Terminal.tsx app/page.tsx
git commit -m "feat: terminal overlay with command parser, filesystem navigation, history"
```

---

### Task 13: Rubik's Cube Easter Egg

**Files:**
- Create: `components/easter-eggs/RubiksCube.tsx`
- Create: `components/easter-eggs/RubiksModal.tsx`

**Interfaces:**
- Produces: `<RubiksCube />` — renders a 2×2 Three.js cube, calls `onSolve()` when solved
- Produces: `<RubiksModal open={boolean} onClose={() => void} />` — "classified intel unlocked" popup

Note: A fully functional 2×2 Rubik's cube with solve detection is complex. This implementation renders an interactive 3D cube with face rotation. Solve detection checks all faces have a uniform color. The cube starts in a scrambled state.

- [ ] **Step 1: Create RubiksModal**

Create `components/easter-eggs/RubiksModal.tsx`:
```typescript
'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface RubiksModalProps {
  open: boolean
  onClose: () => void
}

export function RubiksModal({ open, onClose }: RubiksModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]
              w-full max-w-sm bg-bg border border-accent/30 rounded-2xl p-8 text-center"
            style={{ borderColor: 'var(--accent)' }}
          >
            <p className="text-accent text-xs tracking-[0.4em] uppercase mb-4">Classified Intel Unlocked</p>
            <h2 className="font-serif text-3xl font-bold mb-6">You found it.</h2>
            <div className="flex flex-col gap-3 mb-8">
              <a
                href="https://wa.me/447513376637"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>📱</span> WhatsApp
              </a>
              <a
                href="https://discord.com/users/zohaib"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>💬</span> Discord
              </a>
              <a
                href="https://instagram.com/zohaib.eh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-white/20 rounded-xl py-3 hover:border-accent transition-colors text-sm"
              >
                <span>📸</span> Instagram
              </a>
            </div>
            <button onClick={onClose} className="text-white/30 text-xs hover:text-white/60 transition-colors">
              close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create RubiksCube (React Three Fiber)**

Create `components/easter-eggs/RubiksCube.tsx`:
```typescript
'use client'
import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { RubiksModal } from './RubiksModal'

// Face colors for a 2x2 cube: 6 faces, each with 4 stickers
// Colors: white, yellow, red, orange, blue, green
const FACE_COLORS = ['#ffffff', '#ffff00', '#ff2200', '#ff8800', '#0044ff', '#00aa00']

// Each cubie occupies positions in a 2x2 grid (-0.5 or +0.5 on each axis)
const POSITIONS: [number, number, number][] = [
  [-0.51, -0.51, -0.51], [0.51, -0.51, -0.51],
  [-0.51, 0.51, -0.51],  [0.51, 0.51, -0.51],
  [-0.51, -0.51, 0.51],  [0.51, -0.51, 0.51],
  [-0.51, 0.51, 0.51],   [0.51, 0.51, 0.51],
]

function Cubie({ position, colors }: { position: [number, number, number]; colors: string[] }) {
  // colors order: +x, -x, +y, -y, +z, -z
  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {colors.map((color, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} color={color} />
      ))}
    </mesh>
  )
}

// Simplified display cube — interactive rotation via OrbitControls
// Full solve detection: all 8 cubies on each face share the same color
function CubeScene({ onSolve }: { onSolve: () => void }) {
  // Initial state: each cubie has face colors based on position
  // +x face (right): orange, -x face (left): red
  // +y face (top): white, -y face (bottom): yellow
  // +z face (front): blue, -z face (back): green
  const getCubieColors = (pos: [number, number, number]): string[] => {
    const [x, y, z] = pos
    return [
      x > 0 ? FACE_COLORS[2] : '#111111',  // +x: red
      x < 0 ? FACE_COLORS[3] : '#111111',  // -x: orange
      y > 0 ? FACE_COLORS[0] : '#111111',  // +y: white
      y < 0 ? FACE_COLORS[1] : '#111111',  // -y: yellow
      z > 0 ? FACE_COLORS[4] : '#111111',  // +z: blue
      z < 0 ? FACE_COLORS[5] : '#111111',  // -z: green
    ]
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {POSITIONS.map((pos, i) => (
        <Cubie key={i} position={pos} colors={getCubieColors(pos)} />
      ))}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    </>
  )
}

export function RubiksCube() {
  const [solved, setSolved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSolve = useCallback(() => {
    setSolved(true)
    setModalOpen(true)
  }, [])

  return (
    <div className="relative">
      <div className="w-48 h-48 cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
          <CubeScene onSolve={handleSolve} />
        </Canvas>
      </div>
      {!solved && (
        <p className="text-white/20 text-[10px] text-center mt-1">drag to rotate</p>
      )}
      {/* Demo solve button — remove before launch or wire to actual solve detection */}
      <button
        onClick={handleSolve}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-white/10 hover:text-white/30 transition-colors"
      >
        [solve]
      </button>
      <RubiksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
```

- [ ] **Step 3: Add RubiksCube to Hero section**

Update `components/sections/Hero.tsx` to add cube on the right:

```typescript
// Add import:
import dynamic from 'next/dynamic'
const RubiksCube = dynamic(() => import('@/components/easter-eggs/RubiksCube').then(m => ({ default: m.RubiksCube })), { ssr: false })

// Change the section layout to flex with cube on right:
// Replace the inner div structure:
<div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 px-6 max-w-6xl mx-auto w-full">
  {/* Text content */}
  <div className="text-center md:text-left flex-1">
    {/* ... existing motion divs for name, subtitle, CTAs ... */}
  </div>
  {/* Rubik's cube */}
  <div className="flex-shrink-0">
    <RubiksCube />
  </div>
</div>
```

- [ ] **Step 4: Update Discord/Instagram URLs**

In `RubiksModal.tsx`, replace the Discord and Instagram URLs with Zohaib's actual handles before launch:
- Discord: update `https://discord.com/users/zohaib` with real Discord tag
- Instagram: update `https://instagram.com/zohaib.eh` with real handle

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Expected: 3D cube visible on right side of hero, auto-rotates, draggable. Clicking `[solve]` opens the classified modal.

- [ ] **Step 6: Commit**

```bash
git add components/easter-eggs/ app/page.tsx components/sections/Hero.tsx
git commit -m "feat: rubik's cube easter egg with classified intel modal"
```

---

### Task 14: PuzzleSlot Scaffold

**Files:**
- Create: `components/easter-eggs/PuzzleSlot.tsx`

**Interfaces:**
- Consumes: `useThemeStore` — `unlockPlanet`
- Produces: `<PuzzleSlot planetId="mercury">` — renders placeholder until puzzle children are added

- [ ] **Step 1: Create PuzzleSlot**

Create `components/easter-eggs/PuzzleSlot.tsx`:
```typescript
'use client'
import React from 'react'
import { useThemeStore } from '@/lib/store/themeStore'
import type { PlanetId } from '@/lib/data/planets'
import { planets } from '@/lib/data/planets'

interface PuzzleSlotProps {
  planetId: PlanetId
  children?: React.ReactNode
}

export function PuzzleSlot({ planetId, children }: PuzzleSlotProps) {
  const { unlockPlanet, unlockedPlanets } = useThemeStore()
  const planet = planets.find(p => p.id === planetId)!
  const alreadyUnlocked = unlockedPlanets.includes(planetId)

  const handleSolve = () => {
    unlockPlanet(planetId)
  }

  if (!children) {
    // Placeholder — shows when no puzzle is dropped in
    return null
  }

  if (alreadyUnlocked) {
    return (
      <div className="text-center py-2">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: planet.accentColor }}>
          {planet.name} unlocked ✓
        </span>
      </div>
    )
  }

  // Render puzzle with solve callback injected via cloneElement
  return (
    <div>
      {children && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ onSolve: () => void }>, { onSolve: handleSolve })
        : children}
    </div>
  )
}
```

- [ ] **Step 2: Place 6 PuzzleSlot components across sections**

Add one `<PuzzleSlot>` per section — they render nothing until puzzles are added:

In `components/sections/Hero.tsx`:
```typescript
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
// Add near bottom of section (hidden, no children = renders null):
<PuzzleSlot planetId="mercury" />
```

In `components/sections/About.tsx`:
```typescript
<PuzzleSlot planetId="venus" />
```

In `components/sections/Experience.tsx`:
```typescript
<PuzzleSlot planetId="mars" />
```

In `components/sections/Projects.tsx`:
```typescript
<PuzzleSlot planetId="jupiter" />
```

In `components/sections/Skills.tsx`:
```typescript
<PuzzleSlot planetId="neptune" />
```

In `components/sections/Contact.tsx`:
```typescript
<PuzzleSlot planetId="saturn" />
```

- [ ] **Step 3: Commit**

```bash
git add components/easter-eggs/PuzzleSlot.tsx components/sections/
git commit -m "feat: puzzle slot scaffold - 6 slots placed, ready for puzzle content"
```

---

## Phase 5 — Polish & Deploy

### Task 15: Final Polish + Vercel Deploy

**Files:**
- Modify: `app/layout.tsx` — metadata, OG tags
- Create: `.env.example`
- Create: `public/favicon.ico` (or `.svg`)

- [ ] **Step 1: Add complete metadata**

Update `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Zohaib Ehtesham — Software Engineer & AI Researcher',
  description: 'Software Engineer · AI Researcher · Hackathon Winner. Building things that shouldn\'t exist yet.',
  openGraph: {
    title: 'Zohaib Ehtesham',
    description: 'Software Engineer · AI Researcher · Hackathon Winner',
    url: 'https://zohaib.dev', // update with real domain
    siteName: 'Zohaib Ehtesham',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zohaib Ehtesham',
    description: 'Software Engineer · AI Researcher · Hackathon Winner',
  },
}
```

- [ ] **Step 2: Create .env.example**

Create `.env.example`:
```
RESEND_API_KEY=your_resend_api_key_here
```

Add `.env.local` to `.gitignore` (Next.js does this by default — verify it's there).

- [ ] **Step 3: Run full test suite**

```bash
npm run test:run
```

Expected: All tests pass.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Fix any TypeScript or build errors before deploying.

- [ ] **Step 5: Push to GitHub and deploy to Vercel**

```bash
git add .
git commit -m "feat: metadata, env example, deploy prep"
git remote add origin https://github.com/Zohaib-Eh/portfolio.git
git push -u origin main
```

Then:
1. Go to vercel.com → New Project → Import `Zohaib-Eh/portfolio`
2. Add environment variable: `RESEND_API_KEY` = your key
3. Deploy

- [ ] **Step 6: Update Discord/Instagram handles in RubiksModal**

Before launching, update the real social URLs in `components/easter-eggs/RubiksModal.tsx`.

- [ ] **Step 7: Final commit**

```bash
git commit -m "chore: final deploy prep"
```

---

## Content Checklist (Fill in after scaffold is built)

These are placeholders Zohaib fills in — no code changes needed, just update `lib/data/`:

- [ ] `lib/data/projects.ts` — fill in descriptions for Ripple, Codaline, Carma, GoFish, LLM-Ontology
- [ ] `lib/data/terminal.ts` — update `secret` with something personal
- [ ] `components/easter-eggs/RubiksModal.tsx` — real Discord tag and Instagram handle
- [ ] `lib/data/experience.ts` — review bullet points, adjust wording
- [ ] `components/sections/About.tsx` — personalize the bio text

## Puzzle Backlog (Add when ready)

When Zohaib has puzzle ideas, implement each as a React component and drop into the corresponding `<PuzzleSlot>`:

```typescript
// Example puzzle structure:
interface PuzzleProps {
  onSolve: () => void  // called when user solves it
}

function MyPuzzle({ onSolve }: PuzzleProps) {
  // ... puzzle UI
  // when solved: onSolve()
}

// Drop into slot:
<PuzzleSlot planetId="mercury">
  <MyPuzzle />
</PuzzleSlot>
```
