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
