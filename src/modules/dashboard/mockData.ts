export const salesTrend = [
  { label: 'Lun', ventas: 12400, ganancias: 7600 },
  { label: 'Mar', ventas: 15100, ganancias: 9200 },
  { label: 'Mié', ventas: 17350, ganancias: 11000 },
  { label: 'Jue', ventas: 16400, ganancias: 10500 },
  { label: 'Vie', ventas: 18700, ganancias: 12150 },
  { label: 'Sáb', ventas: 14200, ganancias: 8700 },
  { label: 'Dom', ventas: 9800, ganancias: 6100 },
]

export const categoryData = [
  { name: 'Materia prima', value: 38 },
  { name: 'Repuestos', value: 22 },
  { name: 'Embalaje', value: 16 },
  { name: 'Producto terminado', value: 24 },
]

export const inventoryRows = [
  { product: 'Acero galvanizado 2mm', category: 'Materia prima', stock: 120, min: 80, state: 'Normal', location: 'Zona A-03' },
  { product: 'Tornillería industrial', category: 'Repuestos', stock: 18, min: 50, state: 'Crítico', location: 'Zona C-01' },
  { product: 'Caja master 40x30', category: 'Embalaje', stock: 420, min: 300, state: 'Normal', location: 'Zona B-02' },
  { product: 'Panel eléctrico serie X', category: 'Producto terminado', stock: 9, min: 15, state: 'Alerta', location: 'Zona D-04' },
]

export const topProducts = [
  { name: 'Empaque premium', sales: 214, revenue: 62400 },
  { name: 'Kit hidráulico', sales: 188, revenue: 58500 },
  { name: 'Módulo logístico', sales: 142, revenue: 51100 },
  { name: 'Sensor industrial', sales: 127, revenue: 46750 },
]

export const cashFlow = [
  { label: 'Ene', entry: 32000, exit: 21200, net: 10800 },
  { label: 'Feb', entry: 29400, exit: 22400, net: 7000 },
  { label: 'Mar', entry: 34800, exit: 23500, net: 11300 },
  { label: 'Abr', entry: 37100, exit: 24800, net: 12300 },
  { label: 'May', entry: 41200, exit: 27100, net: 14100 },
]

export const warehouseZones = [
  { label: 'Alta rotación', value: 12, className: 'bg-emerald-500/70' },
  { label: 'Media', value: 8, className: 'bg-blue-500/70' },
  { label: 'Baja', value: 4, className: 'bg-amber-500/70' },
  { label: 'Vacío', value: 2, className: 'bg-slate-700/80' },
]

export const alerts = [
  { title: 'Stock crítico', detail: 'Tornillería industrial por debajo del mínimo', tone: 'danger' },
  { title: 'Órdenes pendientes', detail: '8 pedidos listos para despacho', tone: 'warning' },
  { title: 'Facturas vencidas', detail: '3 facturas requieren seguimiento', tone: 'danger' },
  { title: 'Mantenimiento próximo', detail: 'Línea de ensamble 02 en 24 horas', tone: 'info' },
]

export const recentActivities = [
  { title: 'Nueva venta', detail: 'Pedido #5401 confirmado para cliente industrial', time: 'Hace 8 min' },
  { title: 'Compra registrada', detail: 'Recepción de 280 unidades en bodega principal', time: 'Hace 21 min' },
  { title: 'Producto agregado', detail: 'Se creó el SKU PANEL-X9 en inventario', time: 'Hace 39 min' },
  { title: 'Pedido despachado', detail: 'Entrega a planta Norte finalizada', time: 'Hace 1 h' },
]

export const aiQuickQuestions = [
  '¿Qué productos debo reordenar?',
  '¿Dónde pierdo dinero?',
  '¿Cómo van mis ventas?',
  'Predicción de demanda',
]