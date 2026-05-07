/*
  EJEMPLOS DE USO - Componentes Reutilizables
  
  Este archivo muestra cómo utilizar los nuevos componentes profesionales
  para construir formas, tablas y alertas en el ERP.
*/

import { useState } from 'react';
import FormField from './FormField';
import DataTable from './DataTable';
import AlertCard from './AlertCard';

/* ═══════════════════════════════════════════════════════
   1. EJEMPLO: CREAR PROVEEDOR CON FORMFIELD
   ═══════════════════════════════════════════════════════ */

export function ExampleSupplierForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    leadTime: '',
    city: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Nombre requerido';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido';
    }
    if (!form.phone.match(/^[\d\s+()-]{7,}$/)) {
      newErrors.phone = 'Teléfono inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Formulario válido:', form);
      // Enviar al backend
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2 style={{ color: '#f1f5f9' }}>Crear Nuevo Proveedor</h2>

      <FormField
        label="Nombre del Proveedor"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="TechSupply Global"
        required={true}
        hint="Nombre comercial oficial"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="contacto@empresa.com"
        required={true}
      />

      <FormField
        label="Teléfono"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="+57 4 123 4567"
        required={true}
      />

      <FormField
        label="Lead Time (días)"
        name="leadTime"
        type="number"
        value={form.leadTime}
        onChange={handleChange}
        placeholder="14"
        hint="Días promedio de entrega"
      />

      <FormField
        label="Ciudad"
        name="city"
        type="select"
        value={form.city}
        onChange={handleChange}
        options={[
          { value: 'bogota', label: 'Bogotá' },
          { value: 'medellin', label: 'Medellín' },
          { value: 'cali', label: 'Cali' }
        ]}
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: 'none',
          borderRadius: 9,
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          marginTop: 16
        }}
      >
        ✓ Registrar Proveedor
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2. EJEMPLO: LISTAR PRODUCTOS CON DATATABLE
   ═══════════════════════════════════════════════════════ */

export function ExampleProductTable() {
  const products = [
    { id: 1, name: 'iPhone 15 Pro', sku: 'APL-IP15P', stock: 15, status: 'crítico', supplier: 'TechSupply' },
    { id: 2, name: 'Samsung S24', sku: 'SAM-S24', stock: 25, status: 'ok', supplier: 'TechSupply' },
    { id: 3, name: 'AirPods Pro', sku: 'APL-AP2', stock: 8, status: 'bajo', supplier: 'AccesParts' },
  ];

  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    { key: 'name', label: 'Producto', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true, width: 130 },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 600 }}>{val} un</span>
    },
    {
      key: 'status',
      label: 'Estado',
      render: (val) => {
        const colors = {
          crítico: '#ef4444',
          bajo: '#f59e0b',
          ok: '#22c55e'
        };
        return (
          <span style={{
            background: `${colors[val]}20`,
            color: colors[val],
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11
          }}>
            {val.toUpperCase()}
          </span>
        );
      }
    },
    { key: 'supplier', label: 'Proveedor' },
  ];

  const actions = [
    { label: 'Editar', onClick: (row) => alert(`Editar: ${row.name}`), icon: '✎', color: '#a5b4fc' },
    { label: 'Eliminar', onClick: (row) => alert(`Eliminar: ${row.name}`), icon: '🗑', color: '#fca5a5' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#f1f5f9' }}>Inventario de Productos</h2>
      <p style={{ color: '#475569', marginBottom: 20 }}>
        Seleccionados: {selectedRows.length}
      </p>
      <DataTable
        columns={columns}
        data={products}
        actions={actions}
        searchable={true}
        paginated={true}
        itemsPerPage={5}
        selectable={true}
        onSelectionChange={setSelectedRows}
        onRowClick={(row) => console.log('Row clicked:', row)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. EJEMPLO: ALERTAS CON ALERTCARD
   ═══════════════════════════════════════════════════════ */

export function ExampleAlerts() {
  const [alerts, setAlerts] = useState({
    critical: true,
    warning: true,
    success: true
  });

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 style={{ color: '#f1f5f9' }}>Ejemplos de Alertas</h2>

      {alerts.critical && (
        <AlertCard
          type="error"
          title="Stock Crítico"
          message="iPhone 15 Pro tiene solo 3 días de inventario. Se recomienda crear una orden de compra urgentemente."
          icon="🚨"
          onClose={() => setAlerts(prev => ({ ...prev, critical: false }))}
          actions={[
            { label: 'Crear OC', onClick: () => alert('Crear orden'), variant: 'primary' },
            { label: 'Descartar', onClick: () => setAlerts(prev => ({ ...prev, critical: false })) }
          ]}
        />
      )}

      {alerts.warning && (
        <AlertCard
          type="warning"
          title="Acción Requerida"
          message="Hay 3 órdenes de compra pendientes de aprobación desde hace más de 2 días."
          icon="⚠"
          onClose={() => setAlerts(prev => ({ ...prev, warning: false }))}
          actions={[
            { label: 'Ver Órdenes', onClick: () => alert('Ver órdenes'), variant: 'primary' }
          ]}
        />
      )}

      {alerts.success && (
        <AlertCard
          type="success"
          title="Éxito"
          message="Orden OC-2024-089 fue entregada correctamente el 2024-04-30."
          onClose={() => setAlerts(prev => ({ ...prev, success: false }))}
        />
      )}

      <AlertCard
        type="info"
        title="Información"
        message="El próximo corte de inventario será el 2024-05-15. Asegúrate de actualizar los datos antes de esa fecha."
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. EJEMPLO: FORMULARIO COMPLEJO (Producto)
   ═══════════════════════════════════════════════════════ */

export function ExampleProductForm() {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Electrónicos',
    stock: '',
    minStock: '',
    maxStock: '',
    unitCost: '',
    salePrice: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Nombre requerido';
    if (!form.sku) newErrors.sku = 'SKU requerido';
    if (!form.stock) newErrors.stock = 'Stock requerido';
    if (Number(form.minStock) >= Number(form.maxStock)) {
      newErrors.maxStock = 'Máximo debe ser > Mínimo';
    }
    if (!form.unitCost || Number(form.unitCost) <= 0) {
      newErrors.unitCost = 'Costo inválido';
    }
    if (!form.salePrice || Number(form.salePrice) <= 0) {
      newErrors.salePrice = 'Precio inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const margin = (((Number(form.salePrice) - Number(form.unitCost)) / Number(form.salePrice)) * 100).toFixed(1);
    console.log('Producto válido. Margen de ganancia:', margin + '%');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2 style={{ color: '#f1f5f9' }}>Agregar Nuevo Producto</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormField
          label="Nombre del Producto"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required={true}
          placeholder="iPhone 15 Pro"
        />

        <FormField
          label="SKU"
          name="sku"
          type="text"
          value={form.sku}
          onChange={handleChange}
          error={errors.sku}
          required={true}
          placeholder="APL-IP15P-128"
          hint="Identificador único del producto"
        />

        <FormField
          label="Categoría"
          name="category"
          type="select"
          value={form.category}
          onChange={handleChange}
          options={['Electrónicos', 'Accesorios', 'Hogar', 'Ropa', 'Otros']}
        />

        <FormField
          label="Stock Actual"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          error={errors.stock}
          required={true}
          placeholder="50"
        />

        <FormField
          label="Stock Mínimo"
          name="minStock"
          type="number"
          value={form.minStock}
          onChange={handleChange}
          required={true}
          placeholder="20"
        />

        <FormField
          label="Stock Máximo"
          name="maxStock"
          type="number"
          value={form.maxStock}
          onChange={handleChange}
          error={errors.maxStock}
          required={true}
          placeholder="150"
        />

        <FormField
          label="Costo Unitario"
          name="unitCost"
          type="number"
          value={form.unitCost}
          onChange={handleChange}
          error={errors.unitCost}
          required={true}
          placeholder="3200000"
          hint="COP"
        />

        <FormField
          label="Precio de Venta"
          name="salePrice"
          type="number"
          value={form.salePrice}
          onChange={handleChange}
          error={errors.salePrice}
          required={true}
          placeholder="4680000"
          hint="COP"
        />
      </div>

      <FormField
        label="Descripción"
        name="description"
        type="textarea"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción detallada del producto..."
      />

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg,#34d399,#10b981)',
          border: 'none',
          borderRadius: 9,
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          marginTop: 20
        }}
      >
        ✓ Agregar Producto
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Exportar todos los ejemplos
   ═══════════════════════════════════════════════════════ */

export default {
  ExampleSupplierForm,
  ExampleProductTable,
  ExampleAlerts,
  ExampleProductForm
};
