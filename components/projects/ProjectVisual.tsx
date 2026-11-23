import type { ProjectSnippet } from '@/lib/data/projects'

export function SnippetFrame({
  snippet,
  scroll = false,
}: {
  snippet: ProjectSnippet
  scroll?: boolean
}) {
  return (
    <div className="w-full h-full bg-[#07070f] flex flex-col text-left">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="ml-2 text-[10px] font-mono text-white/40 truncate">{snippet.filename}</span>
      </div>
      <pre
        className={`m-0 px-3 py-2 font-mono text-[11px] leading-relaxed text-white/75 whitespace-pre ${
          scroll ? 'overflow-auto' : 'overflow-hidden'
        }`}
      >
        {snippet.code}
      </pre>
    </div>
  )
}

export function StackFrame({ tags }: { tags: string[] }) {
  return (
    <div className="w-full h-full flex flex-col justify-end p-4 pt-10 bg-gradient-to-br from-white/[0.07] to-transparent text-left">
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map(tag => (
          <span
            key={tag}
            className="text-[11px] font-mono text-white/65 border border-white/10 rounded-full px-2.5 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
