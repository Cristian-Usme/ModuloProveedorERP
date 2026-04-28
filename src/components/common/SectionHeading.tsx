import { cn } from '@/utils/cn'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, className }: Props) {
  return (
    <div className={cn('space-y-2', className)}>
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-300">{eyebrow}</p> : null}
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-slate-400">{description}</p> : null}
    </div>
  )
}