import { useState } from "react";

/*
  Simple ERP - Productos & Proveedores
  Operacional y directo al punto.
*/

const initProveedores = [
  { id: "P1", nombre: "TechSupply Global", pais: "China", leadTime: 14 },
  { id: "P2", nombre: "AccesParts Co.", pais: "EE.UU", leadTime: 7 },
  { id: "P3", nombre: "HomeTech Industries", pais: "Alemania", leadTime: 21 },
];

const initProductos = [
  { id: "1", nombre: "iPhone 15 Pro", sku: "IP15P", stock: 15, proveedorId: "P1", precio: 4680000 },
  { id: "2", nombre: "Samsung S24", sku: "S24", stock: 25, proveedorId: "P1", precio: 2940000 },
  { id: "3", nombre: "AirPods Pro", sku: "APP2", stock: 8, proveedorId: "P2", precio: 2010000 },
];

export default function SimpleERP() {
  const [productos, setProductos] = useState(initProductos);
  const [proveedores, setProveedores] = useState(initProveedores);
  const [tab, setTab] = useState("productos");
  const [toast, setToast] = useState(null);

  // MODAL STATE
  const [showFormProducto, setShowFormProducto] = useState(false);
  const [showFormProveedor, setShowFormProveedor] = useState(false);
  const [formProd, setFormProd] = useState({ nombre: "", sku: "", stock: "", proveedorId: "", precio: "" });
  const [formProv, setFormProv] = useState({ nombre: "", pais: "", leadTime: "" });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // AGREGAR PRODUCTO
  const agregarProducto = () => {
    if (!formProd.nombre || !formProd.sku || !formProd.proveedorId || !formProd.precio) {
      notify("⚠️ Completa todos los campos");
      return;
    }
    const newProd = {
      id: Date.now().toString(),
      nombre: formProd.nombre,
      sku: formProd.sku,
      stock: Number(formProd.stock) || 0,
      proveedorId: formProd.proveedorId,
      precio: Number(formProd.precio),
    };
    setProductos([...productos, newProd]);
    setFormProd({ nombre: "", sku: "", stock: "", proveedorId: "", precio: "" });
    setShowFormProducto(false);
    notify("✓ Producto agregado");
  };

  // AGREGAR PROVEEDOR
  const agregarProveedor = () => {
    if (!formProv.nombre || !formProv.pais) {
      notify("⚠️ Completa todos los campos");
      return;
    }
    const newProv = {
      id: Date.now().toString(),
      nombre: formProv.nombre,
      pais: formProv.pais,
      leadTime: Number(formProv.leadTime) || 7,
    };
    setProveedores([...proveedores, newProv]);
    setFormProv({ nombre: "", pais: "", leadTime: "" });
    setShowFormProveedor(false);
    notify("✓ Proveedor agregado");
  };

  // ELIMINAR
  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
    notify("✓ Producto eliminado");
  };

  const eliminarProveedor = (id) => {
    if (productos.some(p => p.proveedorId === id)) {
      notify("⚠️ No puedes eliminar un proveedor con productos");
      return;
    }
    setProveedores(proveedores.filter(p => p.id !== id));
    notify("✓ Proveedor eliminado");
  };

  // OBTENER PROVEEDOR POR ID
  const getProveedor = (id) => proveedores.find(p => p.id === id);

  const fmt = (n) => `$${Number(n).toLocaleString("es-CO")}`;
  const dark = "#0f172a";
  const card = "rgba(255,255,255,0.03)";
  const border = "1px solid rgba(255,255,255,0.08)";

  return (
    <div style={{ background: dark, color: "#e2e8f0", minHeight: "100vh", fontFamily: "sans-serif", padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>📦 Mi ERP</h1>
            <p style={{ margin: "5px 0 0", fontSize: 12, color: "#64748b" }}>Productos & Proveedores</p>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: border, paddingBottom: 15 }}>
          <button
            onClick={() => setTab("productos")}
            style={{
              padding: "8px 16px",
              background: tab === "productos" ? "rgba(99,102,241,0.2)" : "transparent",
              border: "none",
              borderRadius: 8,
              color: tab === "productos" ? "#a5b4fc" : "#64748b",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            📦 Productos ({productos.length})
          </button>
          <button
            onClick={() => setTab("proveedores")}
            style={{
              padding: "8px 16px",
              background: tab === "proveedores" ? "rgba(99,102,241,0.2)" : "transparent",
              border: "none",
              borderRadius: 8,
              color: tab === "proveedores" ? "#a5b4fc" : "#64748b",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🏢 Proveedores ({proveedores.length})
          </button>
        </div>

        {/* PRODUCTOS */}
        {tab === "productos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Mis Productos</h2>
              <button
                onClick={() => setShowFormProducto(true)}
                style={{
                  padding: "8px 16px",
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                + Agregar Producto
              </button>
            </div>

            {productos.length === 0 ? (
              <div style={{ background: card, border, borderRadius: 10, padding: 40, textAlign: "center", color: "#64748b" }}>
                No hay productos. Crea uno para empezar.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 15 }}>
                {productos.map(prod => {
                  const prov = getProveedor(prod.proveedorId);
                  return (
                    <div
                      key={prod.id}
                      style={{
                        background: card,
                        border,
                        borderRadius: 10,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{prod.nombre}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>SKU: {prod.sku}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#a5b4fc" }}>
                        Proveedor: <strong>{prov?.nombre || "No asignado"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span>Stock: {prod.stock} un.</span>
                        <span>{fmt(prod.precio)}</span>
                      </div>
                      <button
                        onClick={() => eliminarProducto(prod.id)}
                        style={{
                          padding: "6px 12px",
                          background: "rgba(239,68,68,0.2)",
                          border: "1px solid rgba(239,68,68,0.5)",
                          borderRadius: 6,
                          color: "#fca5a5",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROVEEDORES */}
        {tab === "proveedores" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Mis Proveedores</h2>
              <button
                onClick={() => setShowFormProveedor(true)}
                style={{
                  padding: "8px 16px",
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                + Agregar Proveedor
              </button>
            </div>

            {proveedores.length === 0 ? (
              <div style={{ background: card, border, borderRadius: 10, padding: 40, textAlign: "center", color: "#64748b" }}>
                No hay proveedores. Crea uno para empezar.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 15 }}>
                {proveedores.map(prov => {
                  const prodCount = productos.filter(p => p.proveedorId === prov.id).length;
                  return (
                    <div
                      key={prov.id}
                      style={{
                        background: card,
                        border,
                        borderRadius: 10,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{prov.nombre}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>📍 {prov.pais}</div>
                      </div>
                      <div style={{ fontSize: 13, color: "#86efac" }}>
                        ⏱️ Lead Time: {prov.leadTime} días
                      </div>
                      <div style={{ fontSize: 13, color: "#fcd34d" }}>
                        📦 Productos: {prodCount}
                      </div>
                      <button
                        onClick={() => eliminarProveedor(prov.id)}
                        disabled={prodCount > 0}
                        style={{
                          padding: "6px 12px",
                          background: prodCount > 0 ? "rgba(107,114,128,0.2)" : "rgba(239,68,68,0.2)",
                          border: prodCount > 0 ? "1px solid rgba(107,114,128,0.5)" : "1px solid rgba(239,68,68,0.5)",
                          borderRadius: 6,
                          color: prodCount > 0 ? "#9ca3af" : "#fca5a5",
                          cursor: prodCount > 0 ? "not-allowed" : "pointer",
                          fontSize: 12,
                          opacity: prodCount > 0 ? 0.5 : 1,
                        }}
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: AGREGAR PRODUCTO */}
      {showFormProducto && (
        <div
          onClick={() => setShowFormProducto(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark,
              border,
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Agregar Producto</h3>

            <input
              placeholder="Nombre del producto"
              value={formProd.nombre}
              onChange={e => setFormProd({ ...formProd, nombre: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <input
              placeholder="SKU"
              value={formProd.sku}
              onChange={e => setFormProd({ ...formProd, sku: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <input
              type="number"
              placeholder="Stock"
              value={formProd.stock}
              onChange={e => setFormProd({ ...formProd, stock: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <input
              type="number"
              placeholder="Precio"
              value={formProd.precio}
              onChange={e => setFormProd({ ...formProd, precio: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <select
              value={formProd.proveedorId}
              onChange={e => setFormProd({ ...formProd, proveedorId: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              <option value="">Selecciona proveedor</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={agregarProducto}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ✓ Agregar
              </button>
              <button
                onClick={() => setShowFormProducto(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border,
                  borderRadius: 6,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR PROVEEDOR */}
      {showFormProveedor && (
        <div
          onClick={() => setShowFormProveedor(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark,
              border,
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Agregar Proveedor</h3>

            <input
              placeholder="Nombre del proveedor"
              value={formProv.nombre}
              onChange={e => setFormProv({ ...formProv, nombre: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <input
              placeholder="País"
              value={formProv.pais}
              onChange={e => setFormProv({ ...formProv, pais: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 10,
                fontSize: 13,
              }}
            />

            <input
              type="number"
              placeholder="Lead Time (días)"
              value={formProv.leadTime}
              onChange={e => setFormProv({ ...formProv, leadTime: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "rgba(255,255,255,0.05)",
                border,
                borderRadius: 6,
                color: "#e2e8f0",
                marginBottom: 16,
                fontSize: 13,
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={agregarProveedor}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ✓ Agregar
              </button>
              <button
                onClick={() => setShowFormProveedor(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border,
                  borderRadius: 6,
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: dark,
            border,
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 13,
            zIndex: 2000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
