import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('glass-input', className)} {...props}>
      {children}
    </select>
  )
}