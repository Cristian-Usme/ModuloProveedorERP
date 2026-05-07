/*
  FormField.jsx - Componente reutilizable para campos de formulario
  Soporte para múltiples tipos: text, email, password, number, select, textarea
  Con validación y manejo de errores integrado
*/

export default function FormField({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  options, 
  required = false,
  fullWidth = true,
  disabled = false,
  hint
}) {
  const baseStyle = {
    padding: "10px 14px",
    background: "rgba(255,255,255,.04)",
    border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,.08)",
    borderRadius: 9,
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    width: fullWidth ? "100%" : "auto",
    disabled: disabled ? "opacity: 0.5; cursor: not-allowed;" : "",
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 10, color: "#475569", fontFamily: "'Syne Mono',monospace", display: "block", marginBottom: 5, letterSpacing: 0.8, textTransform: "uppercase" }}>
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={baseStyle}
        >
          <option value="">Seleccionar...</option>
          {options?.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{ ...baseStyle, height: 100, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={baseStyle}
        />
      )}

      {error && (
        <div style={{ fontSize: 9, color: "#ef4444", marginTop: 4, fontFamily: "'Syne Mono',monospace" }}>
          ⚠ {error}
        </div>
      )}

      {hint && !error && (
        <div style={{ fontSize: 9, color: "#475569", marginTop: 4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
