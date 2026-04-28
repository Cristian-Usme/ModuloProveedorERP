import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/Card'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="max-w-xl text-center">
        <CardTitle className="text-4xl">404</CardTitle>
        <CardDescription className="mt-2 text-base">La ruta solicitada no existe dentro del ERP.</CardDescription>
        <CardContent className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Ir al dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}