export type ProjectCategory = 'aiml' | 'blockchain' | 'robotics' | 'fullstack'

export interface ProjectSnippet {
  filename: string
  code: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  isHackathonWin: boolean   // true = placed / won a prize
  hackathonLabel?: string   // shown in win badge
  hackathonAffiliate?: string // hackathon name for non-winning entries
  media?: string[]          // paths under /public — images or videos
  snippet?: ProjectSnippet  // shown when the project has no demo media
}

export const projects: ProjectItem[] = [
  {
    id: 'poligraph',
    title: 'PoliGraph',
    description: 'A reasoning engine for transaction-monitoring alerts. It reconciles every alerted pound against the case documents and the institution\'s policy, then returns CLOSE, RFI or ESCALATE. Every sentence of the reason cites the evidence it rests on, and a rerun is byte-identical.',
    category: 'aiml',
    tags: ['Python', 'OWL', 'RDF', 'JavaScript'],
    githubUrl: 'https://github.com/Zohaib-Eh/PoliGraph',
    liveUrl: 'https://poligraph-viewer.vercel.app',
    isHackathonWin: false,
    media: [
      '/projects/PoliGraph/landing.png',
      '/projects/PoliGraph/decision.png',
      '/projects/PoliGraph/graph.png',
    ],
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
    id: 'npcasso',
    title: 'NPCasso',
    description: 'An open-world village game in Luanti where twelve AI villagers remember what you said and what they saw you do. The Python backend holds every rule and memory: villagers witness acts, spread rumours, shift trust and moods, and drive five endings. Mubit sits in front of the model and learns its three jobs — reading intent, speaking as a villager, and reacting to what it sees.',
    category: 'aiml',
    tags: ['Python', 'FastAPI', 'Luanti', 'Mubit', 'LLMs'],
    githubUrl: 'https://github.com/Zohaib-Eh/NPCasso',
    isHackathonWin: false,
    hackathonAffiliate: 'Night Shift London',
    media: [
      '/projects/NPCasso/poster.jpg',
      '/projects/NPCasso/demo.mp4',
    ],
  },
  {
    id: 'bob-ros',
    title: 'Bob ROS',
    description: 'Turns CAD files into simulation-ready robots, with no hand-written URDF or ROS code. OpenCascade reads the STEP file, collision sweeps find the joint limits, and CoACD builds the meshes. Closed-form IK and MoveIt 2 run on ROS 2 Jazzy, simulated in MuJoCo, with a browser interface to program the robot.',
    category: 'robotics',
    tags: ['Python', 'ROS 2', 'MoveIt 2', 'MuJoCo', 'Docker', 'React', 'three.js'],
    githubUrl: 'https://github.com/Zohaib-Eh/Bob-ROS',
    isHackathonWin: false,
    snippet: {
      filename: 'backend/app/ros/program_pkg.py',
      code: `r = Robot()
down = r.tool_down(yaw=0.0)          # jaws close along x
r.release()
r.move_to((0.5, 0.2, 0.15), down)
r.move_line((0.5, 0.2, 0.02), down)  # fingertips at the box
r.grip("box")                        # friction holds it
r.move_line((0.5, 0.2, 0.15), down)
r.move_to((0.4, -0.3, 0.15), down)
r.move_line((0.4, -0.3, 0.025), down)
r.release()
(x, y, z), _ = r.pose("box")         # where it really landed`,
    },
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
    id: 'rentradar',
    title: 'RentRadar',
    description: 'A chat-first UK property assistant that answers rent and investment questions and updates its interface live. A LangGraph agent calls market, listings and valuation tools and streams text and UI updates to Next.js over server-sent events. Rent forecasts use LightGBM quantile regression for P10, P50 and P90 bands, with spatial features and SHAP explanations.',
    category: 'aiml',
    tags: ['Python', 'FastAPI', 'LangGraph', 'LightGBM', 'SHAP', 'Next.js'],
    githubUrl: 'https://github.com/Zohaib-Eh/JARZ-AI',
    isHackathonWin: false,
    hackathonAffiliate: 'Team hackathon',
    media: ['/projects/RentRadar/home.jpg'],
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
    id: 'ripple',
    title: 'Ripple',
    description: 'A real-time cascade engine for London road disruptions, built solo for the Urban Operations track. A closure spreads through the road graph on the GPU, then joins to bus journeys, population, deprivation and nearby businesses, and a local vision model reads the nearest JamCam.',
    category: 'aiml',
    tags: ['Python', 'RAPIDS cuGraph', 'cuDF', 'Streamlit', 'TfL API', 'NVIDIA NIM'],
    githubUrl: 'https://github.com/Zohaib-Eh/Ripple',
    isHackathonWin: false,
    hackathonAffiliate: 'Hack for Impact London',
    snippet: {
      filename: 'graph/cascade.py',
      code: `def run_cascade(G: cugraph.Graph, start_node: int, max_depth: int = 15):
    distances = cugraph.bfs(G, start_vertex=start_node)
    affected = distances[distances["distance"] <= max_depth].copy()
    return affected[["vertex", "distance"]].rename(columns={"vertex": "node"})`,
    },
  },
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
    id: 'encode-spoon',
    title: 'EncodeSpoonAI',
    description: 'An Encode hackathon game on Neo. A SpoonAI graph writes a scenario, takes the player\'s answer and scores it. A NEP-17 game token takes the deposit, pays a bonus for each scenario and cashes out, and the contract keeps the history.',
    category: 'blockchain',
    tags: ['Python', 'SpoonAI', 'Neo', 'NEP-17', 'Jupyter'],
    githubUrl: 'https://github.com/Zohaib-Eh/EncodeSpoonAI',
    isHackathonWin: false,
    hackathonAffiliate: 'Encode SpoonAI Hackathon',
    snippet: {
      filename: 'spoonOS/GameToken.py',
      code: `@public
def start_game(player: UInt160, deposit_amount: int) -> bool:
    assert check_witness(player), 'Player authorization required'
    assert deposit_amount > 0, 'Deposit must be positive'
    game_active_val = get(GAME_ACTIVE_PREFIX + player)
    game_active = game_active_val.to_bool() if game_active_val else False
    assert not game_active, 'Game already active for this player'
    player_balance = balanceOf(player)
    assert player_balance >= deposit_amount, 'Insufficient balance'
    put(GAME_ACTIVE_PREFIX + player, True)
    put(GAME_DEPOSIT_PREFIX + player, deposit_amount)
    put(GAME_EARNINGS_PREFIX + player, 0)
    on_game_started(player, deposit_amount)
    return True`,
    },
  },
  {
    id: 'hypermint',
    title: 'HyperMint',
    description: 'A meme-token launcher. I built the landing page, the create-a-token flow (name, ticker, image and links) and the board of recent tokens on the shared Next.js app.',
    category: 'blockchain',
    tags: ['Next.js', 'TypeScript', 'React'],
    githubUrl: 'https://github.com/Zohaib-Eh/Hypermint',
    isHackathonWin: false,
    media: [
      '/projects/Hypermint/home.jpg',
      '/projects/Hypermint/create.jpg',
    ],
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
    id: 'fpga-nn',
    title: 'Neural Network on FPGA',
    description: 'Dissertation: deployed a neural network onto an FPGA with HLS4ML, using pruning and quantisation to fit the device.',
    category: 'aiml',
    tags: ['HLS4ML', 'FPGA', 'Pruning', 'Quantisation'],
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
    media: ['/projects/Human%20Robot%20Interaction/HRI1.jpeg'],
  },
  {
    id: 'gofish-tank',
    title: 'GoFish Tank Monitor',
    description: 'Third place at Royal Hackaway V6. A fish-tank monitor: a Discord bot runs the feeder servo and the lights, and OpenCV records a short video from the tank camera.',
    category: 'robotics',
    tags: ['Python', 'Discord.py', 'OpenCV', 'Flask'],
    githubUrl: 'https://github.com/Zohaib-Eh/Hack23-GoFish',
    isHackathonWin: true,
    hackathonLabel: 'Royal Hackaway V6 — 3rd Place',
    snippet: {
      filename: 'fishgo.py',
      code: `@bot.command(name="feed", help="moves the servo to feed the fish")
async def feedfish(ctx, freq):
    await ctx.channel.send("feeding time has begun, feeding")
    Servo.feeding_time(int(freq))
    await ctx.channel.send("feeding time has come to an end")

@bot.command(name="light", help="toggles the lights")
async def flashbang(ctx):
    x = Servo.flashbang()
    if x.status_code == 200:
        await ctx.channel.send("flash bang out!")`,
    },
  },
  {
    id: 'loneliness',
    title: 'Loneliness Prediction',
    description: 'Predicted loneliness with an RMSE of 2 on the 1 to 9 UCLA scale. Built an emotion model from scratch, used the Google Cloud Natural Language API for sentiment features, and used unsupervised learning to look for patterns across age groups.',
    category: 'aiml',
    tags: ['Python', 'scikit-learn', 'Google Cloud NLP', 'Jupyter'],
    githubUrl: 'https://github.com/Zohaib-Eh/LSEA',
    isHackathonWin: false,
    snippet: {
      filename: 'pre-processing.ipynb',
      code: `df = pd.read_excel("Whatisloneliness060321.xlsx")
df = df[df["Q9_Loneliness_Meaning_Qual"] != -99]
df = df[df["Q9_Loneliness_Meaning_Qual"].notna()]
df = df[df["UCLA3itemscale"].notna()]
_input = df["Q9_Loneliness_Meaning_Qual"]
_input = _input.apply(lcf.remove_stopwords)
_input = _input.apply(lcf.clean_text)
_target = df["UCLA3itemscale"]`,
    },
  },
  {
    id: 'signly',
    title: 'Signly',
    description: 'A British Sign Language learning website. Led front-end development on a team of four.',
    category: 'fullstack',
    tags: ['Django', 'JavaScript'],
    isHackathonWin: false,
  },
  {
    id: 'home-monitor',
    title: 'Home Monitoring System',
    description: 'Best microcontroller group project. Wrote the full embedded C as a finite state machine, tracking temperature, humidity and intruders, and explained the algorithms to four teammates.',
    category: 'robotics',
    tags: ['C', 'PIC', 'Embedded'],
    isHackathonWin: false,
  },
  {
    id: 'banking-suite',
    title: 'Banking & Supermarket Software',
    description: 'GUI banking and supermarket system across 16 use cases, modelled in UML first. Scored 96.75%, top of the cohort.',
    category: 'fullstack',
    tags: ['Java', 'Swing', 'UML', 'OOP'],
    isHackathonWin: false,
  },
  {
    id: 'object-retriever',
    title: 'Automated Object Retriever',
    description: 'A robot that finds and retrieves objects. Ultrasonic sensors and motors on Arduino, with a pathfinding algorithm designed for the build.',
    category: 'robotics',
    tags: ['Arduino', 'Ultrasonic', 'Motors'],
    isHackathonWin: false,
  },
  {
    id: 'buzzer-labview',
    title: 'Buzzer Game & LabVIEW Conveyor',
    description: 'A Raspberry Pi Pico buzzer game wired from scratch, and a state machine controlling a conveyor belt in LabVIEW.',
    category: 'robotics',
    tags: ['Raspberry Pi Pico', 'LabVIEW'],
    isHackathonWin: false,
  },
]
