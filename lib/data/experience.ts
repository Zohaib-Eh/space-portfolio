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
