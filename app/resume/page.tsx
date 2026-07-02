'use client'
import Link from 'next/link'
import { PuzzleSlot } from '@/components/easter-eggs/PuzzleSlot'
import { LightsOut } from '@/components/puzzles/LightsOut'
import { PlanetBackground } from '@/components/ui/PlanetBackground'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xs tracking-[0.25em] uppercase text-white/40 mb-4 pb-2 border-b border-white/10">{title}</h2>
      {children}
    </div>
  )
}

function Entry({
  title, subtitle, date, location, bullets
}: {
  title: string; subtitle?: string; date?: string; location?: string; bullets?: string[]
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-white">{title}</p>
          {subtitle && <p className="text-white/50 text-sm">{subtitle}</p>}
          {location && <p className="text-white/35 text-xs">{location}</p>}
        </div>
        {date && <p className="text-white/35 text-xs font-mono shrink-0">{date}</p>}
      </div>
      {bullets && (
        <ul className="mt-2 space-y-1 border-l border-white/10 pl-4">
          {bullets.map((b, i) => (
            <li key={i} className="text-white/55 text-sm leading-relaxed">{b}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-bg text-white relative">
      <PlanetBackground />

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/8">
        <Link href="/" className="text-white/40 hover:text-white text-sm font-mono tracking-widest transition-colors">
          ← portfolio
        </Link>
        <a
          href="/ZohaibE. Resume 2026.pdf"
          download
          className="px-5 py-2 text-sm font-semibold rounded-full border border-white/20 hover:border-accent hover:text-accent transition-colors"
        >
          Download PDF
        </a>
      </div>

      {/* Resume content */}
      <div className="relative z-10 max-w-3xl mx-auto px-8 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3">Zohaib Ehtesham</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 text-sm font-mono">
            <span>+44 7513 376637</span>
            <a href="https://github.com/ZohaibEhtesham" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/zohaib-ehtesham" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="mailto:zohaibehtesham@gmail.com" className="hover:text-accent transition-colors">zohaibehtesham@gmail.com</a>
          </div>
        </div>

        <Section title="Education">
          <Entry
            title="B.Eng. (Honours) Computer Systems Engineering — First Class"
            subtitle="Brunel University of London"
            date="June 2025"
            bullets={['Dissertation: Neural Network Deployment on FPGA for High-Performance Embedded Systems']}
          />
        </Section>

        <Section title="Experience">
          <Entry
            title="Research Assistant"
            subtitle="ELOQUENCE — EU Horizon Project · Brunel University London"
            date="March 2026 – Present"
            bullets={[
              'Building an AI evaluation framework for LLM-based agents, defining metrics for hallucination, robustness, and bias across multilingual conversational datasets using structured test sets and prompt engineering.',
              'Evaluating agentic AI outputs across diverse prompts for trustworthiness and multilingual consistency, identifying failure modes and limitations in real-world dialogue scenarios.',
            ]}
          />
          <Entry
            title="Software Engineer"
            subtitle="Nissan Technical Center Europe"
            date="Aug 2023 – Aug 2024"
            bullets={[
              'Developed a full-stack React.js–FastAPI app to import test cases into TestRail, reducing manual effort by 60%.',
              'Led testing strategy for voice recognition features across infotainment systems, collaborating with global teams (Google Automotive Services, Amazon Alexa) for Qashqai MY2024 release.',
            ]}
          />
          <Entry
            title="Research Intern"
            subtitle="Indian Institute of Science (IISc)"
            date="June 2023 – July 2023"
            bullets={[
              'Awarded the Turing Fellowship to research human-robot collaboration using computer vision & machine learning.',
              'Built a hand gesture recognition model using OpenCV, MediaPipe, and TensorFlow achieving 96.67% accuracy; implemented UR5 robot kinematics in MATLAB and Python.',
            ]}
          />
          <Entry
            title="Summer Student Intern"
            subtitle="Brunel University London"
            date="Aug 2022 – Sep 2022"
            bullets={[
              'Built a loneliness prediction model using Google NLP API and ML, achieving .2 RMSE on the UCLA scale.',
            ]}
          />
        </Section>

        <Section title="Technical Skills">
          <div className="space-y-2 text-sm text-white/60">
            <p><span className="text-white/80 font-medium">Languages & Frameworks: </span>Python, TypeScript, SQL, React.js, Next.js, FastAPI, LangGraph, TensorFlow</p>
            <p><span className="text-white/80 font-medium">Cloud, DevOps & AI/ML: </span>AWS, GCP, Docker, GitHub Actions, sklearn, MongoDB, Neo4j, LangChain, RAG</p>
            <p><span className="text-white/80 font-medium">Certifications: </span>AWS CCP (CLF-C02), BCS Foundation Certificate in the Ethical Build of AI (Ongoing)</p>
          </div>
        </Section>

        <Section title="Projects">
          <Entry
            title="GitOps Task Platform"
            subtitle="React.js, FastAPI, SQLite, Vitest, Pytest, AWS, Docker, GitHub Actions"
            bullets={['Full-stack app with automated unit tests and CI/CD via GitHub Actions. Dockerized backend deployed to AWS ECR; served frontend via S3+CloudFront for fast delivery.']}
          />
          <Entry
            title="Hack the Wallet — Encode AI 1st Prize (500+ participants)"
            subtitle="Next.js, Starknet, HTML, CSS, Web3, Gemini API"
            bullets={['Created an award-winning AI agent game using Gemini API and Starknet (Web3), enabling dynamic NPC interaction via natural language prompts and crypto rewards.']}
          />
          <Entry
            title="MediGraph"
            subtitle="Python, FastAPI, Neo4j, LangChain, Next.js"
            bullets={['Full-stack healthcare intelligence platform using knowledge graph architecture with RAG-based natural language querying. Developed document parsing pipelines and medical dataset analysis.']}
          />
        </Section>

        <Section title="Leadership & Activities">
          <Entry
            title="Tech Lead — Google Developer Students Club Brunel UoL"
            date="Nov 2022 – Apr 2023"
            bullets={['Led workshops teaching Data Structures & Algorithms and organised HackerRank competitions.']}
          />
          <Entry
            title="Course Representative — Brunel University of London"
            date="Oct 2021 – Apr 2023"
            bullets={['Represented student concerns, coordinated with faculty, and took initiatives to enhance course experience.']}
          />
        </Section>

        <Section title="Awards">
          <ul className="space-y-2">
            {[
              '2026 NVIDIA Hack for Impact — Winner',
              '2025 University Prize — Awarded for Highest Overall Grade in Computer Systems Engineering',
              '2025 Encode AI Hackathon — 1st Prize Winner (Main Track) + 2× Bounties',
              '2025 Royal Hackaway V8 — 3rd Place Winner in Environmental Hack',
              '2023 Royal Hackaway V6 — 3rd Place Winner',
              '2021 GDSC Hacxmas Hackathon — Winner (Education Track)',
            ].map((a, i) => (
              <li key={i} className="text-white/55 text-sm flex gap-2">
                <span className="text-accent/60">✦</span>{a}
              </li>
            ))}
          </ul>
        </Section>

        {/* Uranus puzzle */}
        <div className="mt-16">
          <PuzzleSlot planetId="uranus"><LightsOut onSolve={() => {}} /></PuzzleSlot>
        </div>
      </div>
    </div>
  )
}
