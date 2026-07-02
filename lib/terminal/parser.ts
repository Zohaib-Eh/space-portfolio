import { terminalData } from '@/lib/data/terminal'
import { filesystem } from './filesystem'

const HELP = `available commands:
  ls              list files
  cd <dir>        change directory
  cat <file>      read a file
  ssh github      open GitHub
  ssh linkedin    open LinkedIn
  clear           clear terminal
  exit / close    close terminal

✦ puzzles are hidden throughout the site
  solve them to unlock planet themes — start exploring`

export function parseCommand(input: string, cwd: string[]): string {
  const trimmed = input.trim()
  const [cmd, ...args] = trimmed.split(' ')
  const arg = args.join(' ')
  const dir = cwd[cwd.length - 1] ?? 'root'

  switch (cmd) {
    case 'help':
      return HELP

    case 'ls': {
      const files = filesystem[dir as keyof typeof filesystem] ?? filesystem.root
      return files.join('  ')
    }

    case 'cd': {
      const rawTarget = arg.trim()
      if (rawTarget === '..' || rawTarget === '../') return 'cd: moved up'
      if (rawTarget === '' || rawTarget === '~') return 'cd: moved to ~'
      const target = rawTarget.replace(/\//g, '')
      if (filesystem[target as keyof typeof filesystem]) return `cd: now in ${target}/`
      return `cd: ${arg}: No such file or directory`
    }

    case 'cat': {
      if (arg === 'about.txt') return terminalData.about
      if (arg === 'skills.txt') return terminalData.skills
      if (arg === 'awards.txt') return terminalData.awards
      if (arg === 'contact.txt') return terminalData.contact
      if (arg === 'secret.txt') return terminalData.secret
      // Job files
      const jobKey = arg.replace('.txt', '') as keyof typeof terminalData.jobs
      if (terminalData.jobs[jobKey]) return terminalData.jobs[jobKey]
      // Project files
      const projKey = arg.replace('.txt', '') as keyof typeof terminalData.projectDetails
      if (terminalData.projectDetails[projKey]) return terminalData.projectDetails[projKey]
      return `cat: ${arg}: No such file or directory`
    }

    case 'ssh': {
      if (arg === 'github') {
        if (typeof window !== 'undefined') window.open('https://github.com/Zohaib-Eh', '_blank')
        return 'Opening GitHub...'
      }
      if (arg === 'linkedin') {
        if (typeof window !== 'undefined') window.open('https://www.linkedin.com/in/zohaib-ehtesham', '_blank')
        return 'Opening LinkedIn...'
      }
      return `ssh: ${arg}: connection refused`
    }

    case 'whoami':
      return 'zohaib — software engineer, ai researcher, hackathon winner'

    case 'pwd':
      return cwd.length > 0 ? `~/${cwd.join('/')}` : '~'

    case '':
      return ''

    default:
      return `${cmd}: command not found. Type "help" for available commands.`
  }
}
