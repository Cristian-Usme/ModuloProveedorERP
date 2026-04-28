import { useMemo } from 'react'
import { Plus, RotateCcw, Search, Warehouse } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { DataTable } from '@/components/table/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SectionHeading } from '@/components/common/SectionHeading'
import { masterDataCatalog, masterDataColumns } from '@/modules/masterData/catalog'
import { useDashboardStore } from '@/store/dashboardStore'
import { useMasterDataStore } from '@/store/masterDataStore'
import { cn } from '@/utils/cn'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { InventoryRecord, MasterDataKind, ProductRecord } from '@/types/masterData'

type RecordsPageProps = {
  kind: MasterDataKind
}

function buildSchema(kind: MasterDataKind) {
  const config = masterDataCatalog[kind]
  const shape = Object.fromEntries(
    config.fields.map((field) => {
      if (field.type === 'number') {
        return [field.name, z.coerce.number().min(0)]
      }

      return [field.name, z.string().min(1)]
    }),
  )

  return z.object(shape)
}

function renderStat(label: string, value: string, tone = 'text-white') {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={cn('mt-2 text-2xl font-semibold', tone)}>{value}</div>
    </div>
  )
}

export default function RecordsPage({ kind }: RecordsPageProps) {
  const config = masterDataCatalog[kind]
  const schema = useMemo(() => buildSchema(kind), [kind])
  const searchQuery = useDashboardStore((state) => state.searchQuery)
  const setSearchQuery = useDashboardStore((state) => state.setSearchQuery)
  const records = useMasterDataStore((state) => state[kind])
  const addRecord = useMasterDataStore((state) => state.addRecord)
  const removeRecord = useMasterDataStore((state) => state.removeRecord)
  const resetKind = useMasterDataStore((state) => state.resetKind)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string | number>>({
    resolver: zodResolver(schema),
    defaultValues: config.defaultValues,
  })

  const submitHandler = (values: Record<string, string | number>) => {
    addRecord(kind, config.buildRecord(values))
    reset(config.defaultValues)
  }

  const filteredRecords = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) {
      return records
    }

    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(normalized))
  }, [records, searchQuery])

  const visibleColumns = masterDataColumns[kind]
  const stockRecords = (kind === 'inventory' || kind === 'products' ? (filteredRecords as Array<ProductRecord | InventoryRecord>) : [])
  const inventoryRecords = kind === 'inventory' ? (filteredRecords as InventoryRecord[]) : []
  const totalStock = stockRecords.reduce((sum, record) => sum + record.stock, 0)
  const lowStock = stockRecords.filter((record) => record.stock <= record.minStock).length

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeading eyebrow={config.eyebrow} title={config.title} description={config.description} />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => resetKind(kind)}>
            <RotateCcw className="h-4 w-4" />
            Restablecer datos
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {renderStat(`${config.collectionLabel} registrados`, formatNumber(records.length))}
        {kind === 'inventory' || kind === 'products' ? renderStat('Stock total', formatNumber(totalStock), 'text-emerald-300') : renderStat('Estado operativo', 'Activo', 'text-emerald-300')}
        {kind === 'inventory' || kind === 'products' ? renderStat('Bajo mínimo', formatNumber(lowStock), 'text-amber-300') : renderStat('Rutas activas', '3', 'text-blue-300')}
        {renderStat('Última actualización', new Date().toLocaleDateString('es-CO'), 'text-slate-200')}
      </div>

      {kind === 'inventory' ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Mapa de bodega</CardTitle>
                <CardDescription>Visualiza dónde está guardado cada SKU y en qué formato se almacena.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['Alta rotación', 'Media', 'Baja', 'Vacío'].map((zone) => {
                  const count = inventoryRecords.filter((record) => record.zone === zone).length
                  return (
                    <div key={zone} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
                        <Warehouse className="h-5 w-5" />
                      </div>
                      <div className="font-semibold text-white">{zone}</div>
                      <div className="text-sm text-slate-400">{formatNumber(count)} ubicaciones</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Lectura rápida</CardTitle>
                <CardDescription>Resumen de stock por ubicación.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventoryRecords.slice(0, 4).map((record) => (
                <div key={record.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{record.productName}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {record.warehouse} · {record.zone} · Rack {record.rack}-{record.shelf}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Badge className={record.status === 'Crítico' ? 'bg-red-500/15 text-red-200' : 'bg-emerald-500/15 text-emerald-200'}>{record.status}</Badge>
                    <span>{formatNumber(record.stock)} {record.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Registrar {config.collectionLabel}</CardTitle>
            <CardDescription>Formulario listo para crear nuevos registros y mantener la operación ordenada.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">{field.label}</label>
                  {field.type === 'select' ? (
                    <Select {...register(field.name)}>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input type={field.type} placeholder={field.placeholder} {...register(field.name)} />
                  )}
                  {errors[field.name] ? <p className="text-xs text-red-300">Campo requerido</p> : null}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => reset(config.defaultValues)}>
                Limpiar
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4" />
                Guardar registro
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle>Listado de {config.collectionLabel}</CardTitle>
            <CardDescription>Consulta rápida con búsqueda global desde la barra superior.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Buscar en ${config.collectionLabel}...`}
              className="pl-10"
            />
          </div>
          <DataTable columns={visibleColumns} data={filteredRecords} />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => removeRecord(kind, filteredRecords[0]?.id ?? '')} disabled={!filteredRecords[0]}>
              Eliminar primero visible
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
