const colors = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  APROBADA:  'bg-green-100 text-green-800',
  RECHAZADA: 'bg-red-100 text-red-800',
  CANCELADA: 'bg-gray-100 text-gray-600',
  ADMIN:     'bg-purple-100 text-purple-800',
  COMPRADOR: 'bg-blue-100 text-blue-800',
  CONSULTA:  'bg-gray-100 text-gray-700',
}

export default function Badge({ label }) {
  const cls = colors[label] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
