import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type Props = {
  title: string
  value: string
  delta: string
  helper: string
  icon: string
}

export function StatCard({ title, value, delta, helper, icon }: Props) {
  return (
    <Card className="relative overflow-hidden p-0">
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
      <CardHeader className="relative mb-0 items-center p-5 pb-2">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-1 text-3xl">{value}</CardTitle>
        </div>
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
          <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
          {delta}
        </Badge>
      </CardHeader>
      <CardContent className="relative px-5 pb-5">
        <p className="text-sm text-slate-400">{helper}</p>
        <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">{icon}</div>
      </CardContent>
    </Card>
  )
}