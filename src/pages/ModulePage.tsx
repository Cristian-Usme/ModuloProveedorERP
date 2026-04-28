import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { SectionHeading } from '@/components/common/SectionHeading'
import { navigationSections } from '@/modules/navigation'
import { cn } from '@/utils/cn'

type ModulePageProps = {
  title: string
  subtitle: string
  path: string
}

const keyMetrics = [
  { label: 'Tickets abiertos', value: '24', delta: '+3' },
  { label: 'Procesos hoy', value: '128', delta: '+18' },
  { label: 'Cumplimiento', value: '98.4%', delta: '+0.6%' },
]

export default function ModulePage({ title, subtitle, path }: ModulePageProps) {
  const recommendations = navigationSections.flatMap((section) => section.items).filter((item) => item.path !== path).slice(0, 5)

  return (
    <div className="space-y-8 pb-24">
      <SectionHeading eyebrow="Módulo operativo" title={title} description={subtitle} />

      <div className="grid gap-4 md:grid-cols-3">
        {keyMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="mt-2 text-3xl">{metric.value}</CardTitle>
            <p className="mt-2 text-sm text-emerald-300">{metric.delta}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Vista del módulo</CardTitle>
              <CardDescription>
                Esta sección sirve como base para la expansión por feature flags, permisos y entidades Firestore.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-blue-200">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Arquitectura lista para escalar</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Este módulo ya queda enlazado con el shell enterprise, navegación, autenticación demo y persistencia de layout. Desde aquí puedes conectar colecciones Firestore y reglas por rol.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Permisos por rol', 'Widgets configurables', 'Historial de actividad', 'Integración Firebase'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Atajos</CardTitle>
              <CardDescription>Accesos rápidos a otras áreas del ERP.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn('flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-blue-500/10')}
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
            <Link
              to="/dashboard"
              className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-400/30 hover:bg-blue-500/10"
            >
              Volver al dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}