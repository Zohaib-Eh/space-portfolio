export type SkillCluster = 'aiml' | 'backend' | 'frontend' | 'devops'

export interface SkillIcon {
  name: string
  cluster: SkillCluster
  iconUrl: string
  bg: string
}

const DI = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`

const SI = (slug: string, color = 'ffffff') =>
  `https://cdn.simpleicons.org/${slug}/${color}`

export const skillIcons: SkillIcon[] = [
  // AI / ML
  { name: 'Python',       cluster: 'aiml',     iconUrl: DI('python'),                         bg: '#3776AB' },
  { name: 'TensorFlow',   cluster: 'aiml',     iconUrl: DI('tensorflow'),                     bg: '#FF6F00' },
  { name: 'LangChain',    cluster: 'aiml',     iconUrl: SI('langchain'),                      bg: '#1C3C3C' },
  { name: 'scikit-learn', cluster: 'aiml',     iconUrl: DI('scikitlearn'),                    bg: '#D4560A' },
  // Backend
  { name: 'FastAPI',      cluster: 'backend',  iconUrl: DI('fastapi'),                        bg: '#059669' },
  { name: 'Node.js',      cluster: 'backend',  iconUrl: DI('nodejs'),                         bg: '#215732' },
  { name: 'PostgreSQL',   cluster: 'backend',  iconUrl: DI('postgresql'),                     bg: '#336791' },
  { name: 'MongoDB',      cluster: 'backend',  iconUrl: DI('mongodb'),                        bg: '#116149' },
  { name: 'Neo4j',        cluster: 'backend',  iconUrl: SI('neo4j','4581C4'),                 bg: '#1a2a4a' },
  // Frontend
  { name: 'React',        cluster: 'frontend', iconUrl: DI('react'),                          bg: '#1A2332' },
  { name: 'Next.js',      cluster: 'frontend', iconUrl: SI('nextdotjs'),                      bg: '#111111' },
  { name: 'TypeScript',   cluster: 'frontend', iconUrl: DI('typescript'),                     bg: '#3178C6' },
  // DevOps / Cloud
  { name: 'AWS',          cluster: 'devops',   iconUrl: DI('amazonwebservices','plain-wordmark'), bg: '#232F3E' },
  { name: 'Docker',       cluster: 'devops',   iconUrl: DI('docker'),                         bg: '#1D63ED' },
  { name: 'Git',          cluster: 'devops',   iconUrl: DI('git'),                            bg: '#B73000' },
  { name: 'GH Actions',   cluster: 'devops',   iconUrl: SI('githubactions'),                  bg: '#1a3a6a' },
  { name: 'GCP',          cluster: 'devops',   iconUrl: DI('googlecloud'),                    bg: '#1A73E8' },
]
