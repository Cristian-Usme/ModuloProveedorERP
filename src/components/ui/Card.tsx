import type { PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

type Props = PropsWithChildren<{ className?: string }>

export function Card({ className, children }: Props) {
  return <div className={cn('glass-panel rounded-3xl p-5', className)}>{children}</div>
}

export function CardHeader({ className, children }: Props) {
  return <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>{children}</div>
}

export function CardTitle({ className, children }: Props) {
  return <h3 className={cn('text-lg font-semibold text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }: Props) {
  return <p className={cn('text-sm text-slate-400', className)}>{children}</p>
}

export function CardContent({ className, children }: Props) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}