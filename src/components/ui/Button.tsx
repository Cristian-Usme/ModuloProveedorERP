import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: 'sm' | 'md' | 'lg'
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-950/40',
  secondary: 'bg-white/8 text-slate-100 hover:bg-white/12 border border-white/10',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
}

const sizeClasses = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
}

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}