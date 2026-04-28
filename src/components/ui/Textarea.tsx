import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('glass-input min-h-[120px] resize-none', className)} {...props} />
}