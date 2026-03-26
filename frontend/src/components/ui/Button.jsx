export default function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  const variants = { primary: 'btn-primary', secondary: 'btn-secondary', danger: 'btn-danger' }
  const sizes    = { sm: 'text-xs px-3 py-1.5', md: '', lg: 'text-base px-6 py-3' }
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Cargando...
        </span>
      ) : children}
    </button>
  )
}
