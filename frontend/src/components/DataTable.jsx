/*
  DataTable.jsx - Componente reutilizable para tablas de datos
  Soporta: sorting, pagination, búsqueda, acciones por fila
*/

import { useState, useMemo } from 'react';

export default function DataTable({
  columns, // array de { key, label, render?, width?, sortable?, align? }
  data,
  onRowClick,
  actions, // array de { label, onClick, icon?, color? }
  searchable = true,
  sortable = true,
  paginated = true,
  itemsPerPage = 10,
  selectable = false,
  onSelectionChange
}) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(new Set());

  // Buscar
  const searchedData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col =>
        String(row[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  // Ordenar
  const sortedData = useMemo(() => {
    if (!sortBy) return searchedData;
    const sorted = [...searchedData].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [searchedData, sortBy, sortDir]);

  // Paginar
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, paginated]);

  const totalPages = paginated ? Math.ceil(sortedData.length / itemsPerPage) : 1;

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const toggleRowSelect = (row) => {
    const newSelected = new Set(selected);
    const rowId = row.id || JSON.stringify(row);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const toggleSelectAll = () => {
    if (selected.size === paginatedData.length) {
      setSelected(new Set());
      onSelectionChange?.([]);
    } else {
      const ids = new Set(paginatedData.map(row => row.id || JSON.stringify(row)));
      setSelected(ids);
      onSelectionChange?.(Array.from(ids));
    }
  };

  const thStyle = {
    padding: "11px 18px",
    textAlign: "left",
    fontSize: 9,
    color: "#475569",
    fontFamily: "'Syne Mono',monospace",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: 400,
    borderBottom: "1px solid rgba(255,255,255,.08)",
    backgroundColor: "rgba(255,255,255,.018)"
  };

  const tdStyle = {
    padding: "13px 18px",
    fontSize: 13,
    borderTop: "1px solid rgba(255,255,255,.035)"
  };

  return (
    <div>
      {searchable && (
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            style={{
              padding: "10px 14px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 9,
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
              width: "100%",
              maxWidth: 300
            }}
          />
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {selectable && (
                <th style={{ ...thStyle, width: 40 }}>
                  <input
                    type="checkbox"
                    checked={selected.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{
                    ...thStyle,
                    width: col.width,
                    cursor: col.sortable && sortable ? "pointer" : "default",
                    color: sortBy === col.key ? "#a5b4fc" : "#475569"
                  }}
                  onClick={() => col.sortable && sortable && handleSort(col.key)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {col.label}
                    {col.sortable && sortable && sortBy === col.key && (
                      <span style={{ fontSize: 10 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th style={{ ...thStyle, width: 120 }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} style={{ ...tdStyle, textAlign: "center", color: "#475569", padding: 20 }}>
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? "pointer" : "default",
                    backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)"
                  }}
                >
                  {selectable && (
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selected.has(row.id || JSON.stringify(row))}
                        onChange={() => toggleRowSelect(row)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} style={{ ...tdStyle, textAlign: col.align || "left" }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            style={{
                              padding: "5px 10px",
                              background: "rgba(255,255,255,.04)",
                              border: "1px solid rgba(255,255,255,.08)",
                              borderRadius: 6,
                              color: action.color || "#94a3b8",
                              cursor: "pointer",
                              fontSize: 11,
                              fontFamily: "'Syne Mono',monospace",
                              whiteSpace: "nowrap"
                            }}
                            title={action.label}
                          >
                            {action.icon ? `${action.icon}` : action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#475569", fontSize: 12 }}>
          <span>
            Página {currentPage + 1} de {totalPages} ({sortedData.length} resultados)
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                padding: "5px 12px",
                background: currentPage === 0 ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 6,
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                opacity: currentPage === 0 ? 0.5 : 1
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "5px 12px",
                background: currentPage === totalPages - 1 ? "rgba(255,255,255,.02)" : "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 6,
                cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages - 1 ? 0.5 : 1
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
