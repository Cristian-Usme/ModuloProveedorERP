import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

export function Badge({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <span className={cn('inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200', className)}>{children}</span>
}