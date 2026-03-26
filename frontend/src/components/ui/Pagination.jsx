export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">Página {page + 1} de {totalPages}</p>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 0} className="btn-secondary text-xs">Anterior</button>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} className="btn-secondary text-xs">Siguiente</button>
      </div>
    </div>
  )
}
