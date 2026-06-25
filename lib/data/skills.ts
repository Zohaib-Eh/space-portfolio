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
