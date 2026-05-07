import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={`input-field ${error ? 'border-red-500' : ''}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Input
