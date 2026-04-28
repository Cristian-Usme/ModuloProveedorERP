import { useMemo, useState } from 'react'
import { BrainCircuit, Plus, RefreshCw, ShieldAlert } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { SectionHeading } from '@/components/common/SectionHeading'
import { StatCard } from '@/components/common/StatCard'
import { navigationSections } from '@/modules/navigation'
import {
  aiQuickQuestions,
  alerts,
  cashFlow,
  categoryData,
  inventoryRows,
  recentActivities,
  salesTrend,
  topProducts,
  warehouseZones,
} from '@/modules/dashboard/mockData'
import { defaultWidgets } from '@/modules/dashboard/widgetCatalog'
import { useDashboardStore } from '@/store/dashboardStore'
import { cn } from '@/utils/cn'
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/format'
import type { CustomWidgetDraft, DashboardWidget } from '@/types/erp'

const widgetFormSchema = z.object({
  title: z.string().min(3, 'Ingresa un título de al menos 3 caracteres'),
  subtitle: z.string().min(3, 'Describe el widget en una frase'),
  value: z.string().min(1, 'Agrega un valor visible'),
  accent: z.string().min(1, 'Selecciona un color'),
  size: z.enum(['sm', 'md', 'lg', 'xl']),
})

type WidgetFormValues = z.infer<typeof widgetFormSchema>
type RenderableWidget = DashboardWidget & { value?: string }

const widgetSpans: Record<DashboardWidget['size'], string> = {
  sm: 'col-span-12 sm:col-span-6 xl:col-span-3',
  md: 'col-span-12 xl:col-span-6',
  lg: 'col-span-12 xl:col-span-8',
  xl: 'col-span-12',
}

const alertToneClasses: Record<string, string> = {
  danger: 'border-red-500/20 bg-red-500/10 text-red-200',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  info: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
}

const accentOptions = [
  { label: 'Azul premium', value: 'from-blue-500 to-cyan-400' },
  { label: 'Verde operativo', value: 'from-emerald-500 to-teal-400' },
  { label: 'Ámbar alerta', value: 'from-amber-500 to-orange-400' },
  { label: 'Violeta analítica', value: 'from-violet-500 to-fuchsia-400' },
  { label: 'Rojo riesgo', value: 'from-rose-500 to-red-400' },
]

function WidgetShell({ widget, children }: { widget: RenderableWidget; children: React.ReactNode }) {
  const toggleWidget = useDashboardStore((state) => state.toggleWidget)
  return (
    <Card className={cn('relative overflow-hidden p-0', widgetSpans[widget.size])}>
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', widget.accent)} />
      <CardHeader className="items-start p-5 pb-3">
        <div className="space-y-1">
          <CardTitle>{widget.title}</CardTitle>
          <CardDescription>{widget.subtitle}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => toggleWidget(widget.id)}>
          Ocultar
        </Button>
      </CardHeader>
      <CardContent className="p-5 pt-0">{children}</CardContent>
    </Card>
  )
}

function CustomWidgetForm({ onSubmit }: { onSubmit: (draft: CustomWidgetDraft) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      value: '',
      accent: accentOptions[0].value,
      size: 'md',
    },
  })

  const submitHandler = (values: WidgetFormValues) => {
    onSubmit(values)
    reset({
      title: '',
      subtitle: '',
      value: '',
      accent: accentOptions[0].value,
      size: 'md',
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Input placeholder="Título de la tarjeta" {...register('title')} />
          {errors.title ? <p className="text-xs text-red-300">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Select {...register('size')}>
            <option value="sm">Pequeña</option>
            <option value="md">Mediana</option>
            <option value="lg">Grande</option>
            <option value="xl">XL</option>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Textarea placeholder="Descripción corta" {...register('subtitle')} />
        {errors.subtitle ? <p className="text-xs text-red-300">{errors.subtitle.message}</p> : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Input placeholder="Valor principal" {...register('value')} />
          {errors.value ? <p className="text-xs text-red-300">{errors.value.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Select {...register('accent')}>
            {accentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4" />
        Agregar tarjeta personalizada
      </Button>
    </form>
  )
}

function WidgetCardContent({ widget }: { widget: RenderableWidget }) {
  switch (widget.kind) {
    case 'kpis':
      return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Ventas totales', value: formatCurrency(324000), delta: '+12.4%' },
            { label: 'Ganancia neta', value: formatCurrency(118000), delta: '+8.7%' },
            { label: 'Órdenes', value: formatNumber(428), delta: '+6.1%' },
            { label: 'Stock crítico', value: formatNumber(12), delta: '-4.2%' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
              <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
              <div className="mt-2 text-sm text-emerald-300">{metric.delta}</div>
            </div>
          ))}
        </div>
      )
    case 'salesTrend':
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#08111f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
              <Line type="monotone" dataKey="ventas" stroke="#60a5fa" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="ganancias" stroke="#22c55e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    case 'categoryDonut':
      return (
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#60a5fa', '#22c55e', '#f59e0b', '#a855f7'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#08111f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: ['#60a5fa', '#22c55e', '#f59e0b', '#a855f7'][index % 4] }} />
                  <span>{item.name}</span>
                </div>
                <span className="text-sm text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )
    case 'alerts':
      return (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.title} className={cn('rounded-2xl border px-4 py-3', alertToneClasses[alert.tone])}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{alert.title}</div>
                  <div className="text-sm text-slate-300">{alert.detail}</div>
                </div>
                <ShieldAlert className="h-4 w-4 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )
    case 'activity':
      return (
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{activity.title}</div>
                  <div className="text-sm text-slate-400">{activity.detail}</div>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      )
    case 'inventory':
      return (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <div className="overflow-x-auto erp-scrollbar">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Mínimo</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inventoryRows.map((row) => (
                  <tr key={row.product} className="bg-transparent hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{row.product}</td>
                    <td className="px-4 py-3 text-slate-300">{row.category}</td>
                    <td className="px-4 py-3">{row.stock}</td>
                    <td className="px-4 py-3 text-slate-300">{row.min}</td>
                    <td className="px-4 py-3">
                      <Badge className={row.state === 'Crítico' ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-200'}>{row.state}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    case 'topProducts':
      return (
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={product.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">#{index + 1}</div>
                  <div>
                    <div className="font-semibold text-white">{product.name}</div>
                    <div className="text-sm text-slate-400">{formatNumber(product.sales)} ventas</div>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-300">{formatCurrency(product.revenue)}</div>
              </div>
            </div>
          ))}
        </div>
      )
    case 'cashFlow':
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.14)" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#08111f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }} />
              <Area type="monotone" dataKey="net" stroke="#22c55e" fill="rgba(34,197,94,0.18)" />
              <Area type="monotone" dataKey="entry" stroke="#60a5fa" fill="rgba(96,165,250,0.12)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    case 'warehouseMap':
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {warehouseZones.map((zone) => (
            <div key={zone.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
              <div className={cn('mx-auto mb-3 h-14 w-14 rounded-2xl', zone.className)} />
              <div className="font-semibold text-white">{zone.label}</div>
              <div className="text-sm text-slate-400">{zone.value} ubicaciones</div>
            </div>
          ))}
        </div>
      )
    case 'modules':
      return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {navigationSections.flatMap((section) => section.items).slice(0, 6).map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-400/30 hover:bg-blue-500/10"
            >
              <div className="font-semibold text-white">{item.label}</div>
              <div className="mt-1 text-sm text-slate-400">{item.description}</div>
            </a>
          ))}
        </div>
      )
    case 'ai':
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {aiQuickQuestions.map((question) => (
              <button
                key={question}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
              >
                {question}
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-cyan-500/5 p-5">
            <div className="flex items-center gap-3 text-blue-200">
              <BrainCircuit className="h-5 w-5" />
              <div className="font-semibold">Predicción de demanda</div>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              El modelo detecta crecimiento sostenido en kits hidráulicos y riesgo de ruptura en tornillería industrial. Recomienda reorden automático hoy.
            </p>
            <div className="mt-4 text-sm text-slate-400">Riesgo financiero moderado. Margen operativo estimado: {formatPercentage(8.7)}.</div>
          </div>
        </div>
      )
    case 'custom':
      return (
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-5">
          <div className="text-4xl font-semibold text-white">{widget.value ?? widget.subtitle}</div>
          <div className="mt-2 text-sm text-slate-300">{widget.title}</div>
        </div>
      )
    default:
      return null
  }
}

export default function DashboardPage() {
  const [managerOpen, setManagerOpen] = useState(false)
  const widgets = useDashboardStore((state) => state.widgets)
  const customWidgets = useDashboardStore((state) => state.customWidgets)
  const hiddenWidgetIds = useDashboardStore((state) => state.hiddenWidgetIds)
  const resetLayout = useDashboardStore((state) => state.resetLayout)
  const addCustomWidget = useDashboardStore((state) => state.addCustomWidget)
  const toggleWidget = useDashboardStore((state) => state.toggleWidget)

  const visibleWidgets = useMemo(() => [...widgets, ...customWidgets].filter((widget) => !hiddenWidgetIds.includes(widget.id)), [widgets, customWidgets, hiddenWidgetIds])

  const kpiCards = useMemo(
    () => [
      { title: 'Ventas Totales', value: formatCurrency(324000), delta: '+12.4%', helper: 'Comparado con el periodo anterior', icon: 'V' },
      { title: 'Ganancia Neta', value: formatCurrency(118000), delta: '+8.7%', helper: 'Margen consolidado del mes', icon: 'G' },
      { title: 'Órdenes', value: formatNumber(428), delta: '+6.1%', helper: 'Pedidos procesados', icon: 'O' },
      { title: 'Productos', value: formatNumber(1248), delta: '+3.4%', helper: 'SKUs activos', icon: 'P' },
      { title: 'Stock Crítico', value: formatNumber(12), delta: '-4.2%', helper: 'Alertas por debajo del mínimo', icon: 'S' },
    ],
    [],
  )

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeading
          eyebrow="Panel ejecutivo"
          title="Dashboard industrial premium"
          description="Widget cards reordenadas automáticamente para adaptarse a la pantalla, con opción de ocultar o agregar nuevas tarjetas sin romper la grilla."
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setManagerOpen(true)}>
            <Plus className="h-4 w-4" />
            Agregar tarjeta
          </Button>
          <Button variant="secondary" onClick={resetLayout}>
            <RefreshCw className="h-4 w-4" />
            Restablecer layout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {kpiCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Gestión de tarjetas</div>
            <p className="text-sm text-slate-400">Oculta o muestra widgets para ajustar el layout al foco de trabajo de cada usuario.</p>
          </div>
          <Badge className="bg-blue-500/15 text-blue-200">{visibleWidgets.length} visibles</Badge>
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          {defaultWidgets.map((widget) => {
            const hidden = hiddenWidgetIds.includes(widget.id)

            return (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={cn(
                  'rounded-3xl border px-4 py-3 text-left transition',
                  hidden ? 'border-white/10 bg-white/5 text-slate-400' : 'border-blue-400/30 bg-blue-500/10 text-white',
                )}
              >
                <div className="font-semibold">{widget.title}</div>
                <div className="mt-1 text-xs text-slate-400">{hidden ? 'Oculta' : 'Visible'}</div>
              </button>
            )
          })}
        </div>
        {customWidgets.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Tarjetas personalizadas</div>
            <div className="grid gap-3 xl:grid-cols-3">
              {customWidgets.map((widget) => (
                <div key={widget.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{widget.title}</div>
                  <div className="mt-1 text-sm text-slate-400">{widget.subtitle}</div>
                  <Button variant="ghost" size="sm" className="mt-4" onClick={() => toggleWidget(widget.id)}>
                    Alternar visibilidad
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-6">
        {visibleWidgets.map((widget) => (
          <WidgetShell key={widget.id} widget={widget as RenderableWidget}>
            <WidgetCardContent widget={widget as RenderableWidget} />
          </WidgetShell>
        ))}
      </div>

      <Modal
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
        title="Agregar tarjeta personalizada"
        description="Crea una tarjeta nueva y se acomodará automáticamente dentro de la grilla responsiva."
      >
        <CustomWidgetForm
          onSubmit={(draft) => {
            addCustomWidget(draft)
            setManagerOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}