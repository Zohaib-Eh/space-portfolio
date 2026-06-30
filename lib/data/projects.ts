export type ProjectCategory = 'aiml' | 'blockchain' | 'robotics' | 'fullstack'

export interface ProjectItem {
  id: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  githubUrl: string
  isHackathonWin: boolean   // true = placed / won a prize
  hackathonLabel?: string   // shown in win badge
  hackathonAffiliate?: string // hackathon name for non-winning entries
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
    isHackathonWin: false,
    hackathonAffiliate: 'HackNation',
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
    description: 'Modular Python-based data processing system with specialized components for data ingestion, graph processing, and impact analysis.',
    category: 'aiml',
    tags: ['Python', 'Graph Processing', 'Data Engineering'],
    githubUrl: 'https://github.com/Zohaib-Eh/Ripple',
    isHackathonWin: false,
  },
  {
    id: 'codaline',
    title: 'Codaline',
    description: 'One-click claymation film studio that transforms photos and story prompts into complete animated short films — AI-directed scenes, character animation, narration, and soundtracks powered by Claude and generative AI.',
    category: 'fullstack',
    tags: ['Next.js', 'FastAPI', 'Claude API', 'SAM2', 'FFmpeg', 'ElevenLabs'],
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
    description: 'Decentralized peer-to-peer car rental platform on Concordium blockchain, using zero-knowledge proofs for identity verification and smart contracts to streamline booking and rental confirmations.',
    category: 'blockchain',
    tags: ['Next.js', 'TypeScript', 'Concordium', 'Smart Contracts', 'ZK-Proofs'],
    githubUrl: 'https://github.com/Zohaib-Eh/Carma',
    isHackathonWin: false,
    hackathonAffiliate: 'Encode AI Hackathon',
  },
  {
    id: 'gofish',
    title: 'GoFish',
    description: 'Polkadot-based decentralized payment platform disrupting the fishing import/export industry — instant, transparent transactions with tokenized payments and stablecoin integration for exporters, importers, and investors.',
    category: 'blockchain',
    tags: ['TypeScript', 'Polkadot', 'Solidity', 'Next.js', 'DeFi'],
    githubUrl: 'https://github.com/Zohaib-Eh/GoFish',
    isHackathonWin: false,
    hackathonAffiliate: 'EasyA Hackathon',
  },
  {
    id: 'llm-ontology',
    title: 'LLM-based Ontology Discovery',
    description: 'AI system that automatically discovers and extracts ontological structures from unstructured text using Large Language Models, generating standardized RDF knowledge representations.',
    category: 'aiml',
    tags: ['Python', 'Jupyter', 'LLM', 'NLP', 'RDF', 'Ontology'],
    githubUrl: 'https://github.com/Zohaib-Eh/LLM-based-Ontology-Discovery',
    isHackathonWin: false,
  },
]
