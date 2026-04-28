import type { PropsWithChildren, ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

type ModalProps = PropsWithChildren<{
  open: boolean
  title: string
  description?: string
  onClose: () => void
  footer?: ReactNode
}>

export function Modal({ open, title, description, onClose, footer, children }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-[1.75rem] border-white/12 p-6 shadow-glass">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  )
}