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
  media?: string[]          // paths under /public — images or videos
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
    media: [
      '/projects/Hack%20The%20Wallet/HTW1.png',
      '/projects/Hack%20The%20Wallet/HTW2.png',
    ],
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
    media: ['/projects/Medigraph/MG1.mp4'],
  },
  {
    id: 'todo-gitops',
    title: 'GitOps Task Platform',
    description: 'Full-stack app with automated unit tests and CI/CD via GitHub Actions. Dockerized backend deployed to AWS ECR; frontend via S3 + CloudFront.',
    category: 'fullstack',
    tags: ['React.js', 'FastAPI', 'Docker', 'AWS', 'GitHub Actions'],
    githubUrl: 'https://github.com/Zohaib-Eh/todo-gitops',
    isHackathonWin: false,
    media: ['/projects/GitOps%20Driven%20Task%20Managment/GitOps1.png'],
  },
  {
    id: 'hri',
    title: 'Human-Robot Interaction',
    description: 'Hand gesture recognition model achieving 96.67% accuracy using OpenCV, MediaPipe, and TensorFlow. UR5 robot kinematics in MATLAB and Python. Turing Fellowship research at IISc.',
    category: 'robotics',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'MATLAB'],
    githubUrl: 'https://github.com/Zohaib-Eh/HRI',
    isHackathonWin: false,
    media: ['/projects/Human%20Robot%20Interaction/HRI1.jpeg'],
  },
  {
    id: 'stella',
    title: 'Stella',
    description: 'Real-time disruption early-warning platform for London small businesses — GPU-accelerated road-graph BFS (RAPIDS cuGraph) computes an access-health score from live TfL feeds, JamCam vision analysis via NVIDIA Nemotron VLM, and deprivation-weighted city-scale mapping across ~25k high-street businesses.',
    category: 'aiml',
    tags: ['Python', 'FastAPI', 'RAPIDS cuGraph', 'NVIDIA Nemotron', 'TfL API', 'Leaflet.js', 'vLLM'],
    githubUrl: 'https://github.com/Zohaib-Eh/Stella-Access-Health',
    isHackathonWin: true,
    hackathonLabel: 'Hack for Impact London — Winner',
    hackathonAffiliate: 'Hack for Impact London — NVIDIA',
    media: ['/projects/Stella/STLA1.mp4'],
  },
  {
    id: 'codaline',
    title: 'Codaline',
    description: 'One-click claymation film studio that transforms photos and story prompts into complete animated short films — AI-directed scenes, character animation, narration, and soundtracks powered by Claude and generative AI.',
    category: 'fullstack',
    tags: ['Next.js', 'FastAPI', 'Claude API', 'SAM2', 'FFmpeg', 'ElevenLabs'],
    githubUrl: 'https://github.com/Zohaib-Eh/Codaline',
    isHackathonWin: false,
    media: [
      '/projects/Codaline/CD1.png',
      '/projects/Codaline/CD2.mp4',
    ],
  },
  {
    id: 'wayfarerr',
    title: 'WayFarer',
    description: 'AI-driven city wallet that predicts your needs based on real-time context — weather, location — to serve dynamic local deals.',
    category: 'aiml',
    tags: ['Dart', 'Flutter', 'AI'],
    githubUrl: 'https://github.com/Zohaib-Eh/WayFarer',
    isHackathonWin: false,
    media: ['/projects/Wayfarer/WF1.png'],
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
    media: ['/projects/Carma/CM1.mp4'],
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
    media: ['/projects/GoFish/GF1.png'],
  },
  {
    id: 'llm-ontology',
    title: 'LLM-based Ontology Discovery',
    description: 'AI system that automatically discovers and extracts ontological structures from unstructured text using Large Language Models, generating standardized RDF knowledge representations.',
    category: 'aiml',
    tags: ['Python', 'Jupyter', 'LLM', 'NLP', 'RDF', 'Ontology'],
    githubUrl: 'https://github.com/Zohaib-Eh/LLM-based-Ontology-Discovery',
    isHackathonWin: false,
    media: ['/projects/LLM-based%20Ontology%20Discovery/OntDisc1.png'],
  },
]
