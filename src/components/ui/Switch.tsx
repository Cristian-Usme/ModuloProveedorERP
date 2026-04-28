import { cn } from '@/utils/cn'

type Props = {
  checked: boolean
  onCheckedChange: (value: boolean) => void
  label?: string
}

export function Switch({ checked, onCheckedChange, label }: Props) {
  return (
    <button type="button" onClick={() => onCheckedChange(!checked)} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white/5">
      <span className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition', checked ? 'bg-blue-600' : 'bg-white/15')}>
        <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-1')} />
      </span>
      {label ? <span className="text-sm text-slate-200">{label}</span> : null}
    </button>
  )
}