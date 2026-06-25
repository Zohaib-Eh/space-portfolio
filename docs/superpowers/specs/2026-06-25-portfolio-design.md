---
name: portfolio-design
description: Full design spec for Zohaib Ehtesham's personal portfolio — space-themed, interactive, Next.js on Vercel
metadata:
  type: project
---

# Zohaib Ehtesham Portfolio — Design Spec

**Date:** 2026-06-25  
**Inspired by:** avivashishta.com (interactivity philosophy, not visual copy)  
**Deployment:** Vercel free tier (Next.js only, no separate backend)

---

## 1. Goals

- Primary: Impress hiring managers for software engineering and AI/ML roles
- Secondary: Build a memorable personal brand
- Differentiator: The portfolio itself demonstrates engineering creativity, not just lists it

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | Vercel-native, free tier, API routes for contact form |
| Styling | Tailwind CSS | Speed + consistency |
| Animation | Framer Motion | Scroll animations, transitions, neural network build |
| 3D | React Three Fiber + Three.js | Rubik's cube, planet tracker spheres |
| Physics | Matter.js | Floating skill icons gentle repulsion |
| State | Zustand + localStorage | Persist puzzle progress, unlocked themes across sessions |
| Email | Resend | Contact form via Next.js API route |
| Deployment | Vercel free tier | No FastAPI needed — Next.js API routes cover all backend needs |

---

## 3. Visual Identity

### Theme
- **Default**: Dark space — deep navy/black (`#050510`), subtle animated starfield canvas
- **Feel**: Professional-dramatic, not gimmicky. Space as identity (research, AI, systems engineering), not decoration.

### Typography
- **Hero name**: Bold serif (e.g. Playfair Display or similar) — large, commanding
- **Headings**: Semi-bold sans-serif
- **Body**: Clean sans-serif (Inter or similar)
- **Terminal**: Monospace (JetBrains Mono or Fira Code)

### Color System
- **Default accent**: White/light gray on dark space background
- **Planet unlocks** (added via puzzle system later — slots reserved):

| Planet | Accent Color | Hex |
|--------|-------------|-----|
| Mercury | Silver | `#C0C0C0` |
| Venus | Amber | `#E8A020` |
| Mars | Red | `#E84040` |
| Jupiter | Orange | `#E86020` |
| Neptune | Cyan | `#20C8E8` |
| Saturn | Gold | `#E8D020` |

Theme dropdown in navbar shows planet icons. Locked planets appear dimmed. Solving a puzzle unlocks its planet and adds the color to the active dropdown. Selected color applies as the site-wide accent (links, highlights, glows, hover states).

---

## 4. Page Structure

Single-page scroll. All sections on `/`. Terminal is a floating overlay only — no separate route.

### 4.1 Hero
- Full-screen starfield background (canvas, subtle parallax on mouse move)
- Large bold name: **Zohaib Ehtesham**
- Rotating subtitle cycles through: `Software Engineer` / `AI Researcher` / `Hackathon Winner` / `Systems Engineer`
- Two CTAs:
  - "See My Work" → scrolls to Projects
  - "`>_` Mission Control" → opens terminal overlay
- **Planet Progress Tracker**: fixed bottom-right corner, visible throughout entire scroll. 6 planet slots, all locked on first visit. Persists across sessions via localStorage.
- **Rubik's Cube**: floats visibly on the right side of the hero section — not hidden, but placed as a natural element alongside the hero text. Interactable immediately. Solving it reveals a modal with WhatsApp, Discord, Instagram.

### 4.2 About
- Short punchy bio — 3–4 sentences max
- Highlights woven in naturally: First Class, Brunel; Turing Fellowship (IISc); EU Horizon Project (ELOQUENCE)
- No stat counters
- Layout: text-focused, clean, breathing room

### 4.3 Experience — Neural Network
- Visual: An animated node graph built with Framer Motion (SVG-based, not Three.js — keeps it performant)
- Nodes:
  - **Job nodes** (large circles): ELOQUENCE, Nissan, IISc, Brunel intern
  - **Award nodes** (smaller, glowing): NVIDIA Hack for Impact, Encode AI 1st Prize, Royal Hackaway V8, Royal Hackaway V6, University Prize, GDSC Hacxmas
  - Awards connected to their relevant time period on the graph
- Behavior: Scrolling through the section builds the network node by node — edges draw in, nodes pulse in
- Interaction: Clicking any node expands a detail panel (job description or award detail)
- The fully assembled graph shows the complete career story visually

### 4.4 Projects
- Separate section, distinct from Experience
- **Filtered card grid** — category tabs across the top: All / AI·ML / Blockchain / Robotics / Full-Stack
- Clicking a tab filters visible cards with a smooth Framer Motion layout animation
- Hackathon-winning projects get a badge overlay (trophy icon + award name)
- Card layout: hover reveals tech stack tags + short description
- Click opens a detail modal (description, stack, GitHub link, key outcomes)
- Categories:
  - **AI·ML**: MediGraph, LLM-based-Ontology-Discovery, EncodeSpoonAI, Carma, Ripple, JARZ-AI
  - **Blockchain**: HackTheWallet, GoFish, WayFarer, Carma
  - **Robotics**: HRI (IISc Turing Fellowship)
  - **Full-Stack**: Codaline, todo-gitops, FitFighters
- Content (descriptions, tech stacks, outcomes) to be filled in by Zohaib after scaffolding is built
- `lib/data/projects.ts` contains placeholder entries with the correct structure — swap in real content later

### 4.5 Skills
- Floating tech icons with gentle physics (Matter.js)
- Behavior: icons float in their natural positions, gently repel from the cursor on hover — no explosive physics, no click-to-scatter
- Grouped loosely by cluster (no hard labels):
  - AI/ML: Python, TensorFlow, LangChain, LangGraph, scikit-learn
  - Backend: FastAPI, Node.js, PostgreSQL, MongoDB, Neo4j, Docker
  - Frontend: React, Next.js, TypeScript
  - Cloud/DevOps: AWS, GCP, GitHub Actions
- Icons are dev-icon SVGs or similar (consistent style)

### 4.6 Contact
- Simple form: name, email, message
- Submitted via Next.js API route → Resend → zohaib.ehtesham@gmail.com
- Social links: GitHub (Zohaib-Eh), LinkedIn
- No personal socials here — those are behind the Rubik's cube easter egg
- Clean, minimal — no gimmicks in this section

---

## 5. Persistent UI Elements

### Planet Progress Tracker
- Fixed bottom-right, always visible during scroll
- 6 small planet icons (Mercury through Saturn) in a vertical or arc layout
- Locked state: dimmed, grey silhouette
- Unlocked state: full color, subtle glow, tooltip shows planet name
- Clicking an unlocked planet applies its color theme
- All puzzle slots reserved in code, puzzle logic added later

### Theme Dropdown (Navbar)
- Small planet/color icon in top-right navbar
- Opens a small card dropdown showing 6 planet swatches
- Locked planets: dimmed with lock icon
- Selecting an unlocked planet changes the site accent color globally
- Zustand store holds `{ unlockedPlanets: string[], activeTheme: string }`

### Navbar
- Centered pill navbar: name left of pill, hamburger/links inside, theme dropdown icon right of pill
- Links: About, Experience, Projects, Skills, Contact
- Theme dropdown icon (right side)
- Smooth scroll to sections

---

## 6. Easter Eggs

### Rubik's Cube
- **Location**: Visible in/near Hero section, floating to the side
- **Implementation**: React Three Fiber — interactive 3D cube, drag to rotate faces
- **Solve condition**: All faces solved (standard Rubik's logic, simplified — maybe 2×2 for feasibility)
- **Reward**: Modal appears with WhatsApp, Discord, Instagram — styled as "classified intel unlocked"
- **State**: Persisted in localStorage (don't make them solve it every visit)

### Terminal (`>_` / Mission Control)
- **Trigger**: "Mission Control" CTA in hero, OR `` ` `` keyboard shortcut anywhere on page
- **Style**: macOS-style floating window (traffic light buttons, dark bg, monospace text)
- **Prompt**: `zohaib@mission-control:~$`
- **Supported commands**:
  - `help` — lists available commands
  - `ls` — shows: `about.txt`, `experience/`, `projects/`, `skills.txt`, `awards.txt`, `contact.txt`
  - `cat about.txt` — bio text
  - `cd experience/` + `ls` — lists jobs
  - `cat <job>.txt` — job details
  - `cat awards.txt` — full awards list
  - `cd projects/` + `ls` — lists projects
  - `cat <project>.txt` — project details
  - `cat skills.txt` — skill list grouped by domain
  - `ssh github` — opens GitHub profile
  - `ssh linkedin` — opens LinkedIn
  - `clear` — clears terminal
  - `exit` / `close` — closes window
- **Easter egg within terminal**: `cat secret.txt` returns something fun (TBD — your humor)

### Puzzle System (Reserved — Build Later)
- 6 puzzle slots, one per planet
- Puzzle components will be dropped into designated slot areas across sections
- Each puzzle on solve calls `unlockPlanet(planetId)` from Zustand store
- Planet tracker and dropdown update reactively
- Puzzle UI, logic, and narrative are entirely up to Zohaib — personal/niche humor

---

## 7. Data & Content

All content is static — hardcoded in the Next.js app. No CMS needed.

Content files (TypeScript constants):
- `lib/data/experience.ts` — job history + award nodes for NN graph
- `lib/data/projects.ts` — project cards
- `lib/data/skills.ts` — skill icons + cluster groupings
- `lib/data/terminal.ts` — terminal command responses
- `lib/data/planets.ts` — planet metadata (name, color, unlock state)

---

## 8. Performance & Accessibility

- Starfield canvas: capped at 60fps, reduced particle count on mobile
- Three.js (Rubik's cube): lazy loaded, not in initial bundle
- Matter.js: only initialized when Skills section is in viewport
- Framer Motion: `prefers-reduced-motion` respected — animations disabled/simplified
- Mobile: floating physics icons static on mobile (Matter.js skipped), neural network simplified to a vertical timeline

---

## 9. Out of Scope (This Phase)

- Puzzle content/logic (added later by Zohaib)
- Blog or writing section
- Dark/light toggle (space is always dark)
- CMS or dynamic content
- Analytics

---

## 10. Puzzle Slots — Reserved Architecture

```
PuzzleSlot component accepts:
  - planetId: 'mercury' | 'venus' | 'mars' | 'jupiter' | 'neptune' | 'saturn'
  - children: ReactNode (the actual puzzle UI)
  - onSolve: () => void (called by puzzle when complete — wired to Zustand)

Slot renders a placeholder ("???" or a subtle hint) until puzzle is dropped in.
```

Six `<PuzzleSlot>` components are placed across sections. Puzzle implementations are added later without touching section layout.
