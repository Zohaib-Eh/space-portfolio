import { experienceNodes } from './experience'
import { projects } from './projects'

// Derive job text directly from experience.ts — edit there, terminal updates automatically
const jobs = Object.fromEntries(
  experienceNodes
    .filter(n => n.type === 'job')
    .map(n => [
      n.id,
      [
        `${n.title} — ${n.subtitle}`,
        n.period ?? '',
        ...(n.bullets ?? []).map(b => `• ${b}`),
      ]
        .filter(Boolean)
        .join('\n'),
    ])
)

// Derive project text directly from projects.ts — edit there, terminal updates automatically
const projectDetails = Object.fromEntries(
  projects.map(p => [
    p.id,
    [
      p.isHackathonWin ? `${p.title} — ${p.hackathonLabel}` : p.title,
      `Stack: ${p.tags.join(', ')}`,
      p.description,
    ].join('\n'),
  ])
)

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

  // IDs shown when user runs "ls" in experience/ and projects/
  experience: experienceNodes.filter(n => n.type === 'job').map(n => n.id),
  projects: projects.map(p => p.id),

  jobs,
  projectDetails,
}
