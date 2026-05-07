/*
  AlertCard.jsx - Componente para mostrar alertas profesionales
  Soporta: success, error, warning, info
*/

export default function AlertCard({
  type = 'info', // success, error, warning, info
  title,
  message,
  onClose,
  actions, // array de { label, onClick, variant? }
  icon,
}) {
  const typeConfig = {
    success: {
      bg: 'rgba(34,197,94,.1)',
      border: '#22c55e',
      text: '#86efac',
      icon: '✓',
      color: '#22c55e'
    },
    error: {
      bg: 'rgba(239,68,68,.1)',
      border: '#ef4444',
      text: '#fca5a5',
      icon: '✕',
      color: '#ef4444'
    },
    warning: {
      bg: 'rgba(245,158,11,.1)',
      border: '#f59e0b',
      text: '#fcd34d',
      icon: '⚠',
      color: '#f59e0b'
    },
    info: {
      bg: 'rgba(59,130,246,.1)',
      border: '#3b82f6',
      text: '#93c5fd',
      icon: 'ⓘ',
      color: '#3b82f6'
    }
  };

  const cfg = typeConfig[type];

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        position: 'relative'
      }}
    >
      <div style={{ fontSize: 20, color: cfg.color, flexShrink: 0 }}>
        {icon || cfg.icon}
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontWeight: 600, color: cfg.text, marginBottom: 4, fontSize: 13 }}>
            {title}
          </div>
        )}
        {message && (
          <div style={{ fontSize: 12, color: cfg.text, lineHeight: 1.4 }}>
            {message}
          </div>
        )}

        {actions && (
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  background: action.variant === 'primary' ? cfg.border : 'transparent',
                  color: action.variant === 'primary' ? '#0c1420' : cfg.text,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Syne Mono',monospace"
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: cfg.text,
            cursor: 'pointer',
            fontSize: 18,
            padding: 0,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
