import type { PropsWithChildren } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings2,
  UserCircle2,
} from 'lucide-react'
import { bottomNavigation, navigationSections } from '@/modules/navigation'
import { useDashboardStore } from '@/store/dashboardStore'
import { useUiStore } from '@/store/uiStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { cn } from '@/utils/cn'

const iconMap: Record<string, typeof LayoutDashboard> = {
  'layout-dashboard': LayoutDashboard,
  activity: Activity,
  'calendar-days': CalendarDays,
}

function resolveActiveItem(pathname: string) {
  const items = navigationSections.flatMap((section) => section.items)
  return (
    items
      .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
      .sort((left, right) => right.path.length - left.path.length)[0] ?? items[0]
  )
}

function MobileNavIcon({ icon }: { icon: string }) {
  const Icon = iconMap[icon] ?? LayoutDashboard
  return <Icon className="h-4 w-4" />
}

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const activeItem = resolveActiveItem(location.pathname)
  const collapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const searchQuery = useDashboardStore((state) => state.searchQuery)
  const setSearchQuery = useDashboardStore((state) => state.setSearchQuery)
  const selectedRange = useDashboardStore((state) => state.selectedRange)
  const setSelectedRange = useDashboardStore((state) => state.setSelectedRange)

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        {!isMobile ? (
          <aside
            className={cn(
              'sticky top-0 hidden h-screen border-r border-white/10 bg-[#08111f]/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col',
              collapsed ? 'w-[96px]' : 'w-[300px]',
            )}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className={cn('space-y-1', collapsed && 'text-center')}>
                <div className="text-xs font-bold uppercase tracking-[0.32em] text-blue-300">Enterprise ERP</div>
                {!collapsed ? <div className="text-lg font-semibold text-white">ModuloProveedorERP</div> : null}
              </div>
              <Button variant="ghost" size="sm" onClick={toggleSidebar} aria-label="Colapsar sidebar">
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>

            <nav className="erp-scrollbar flex-1 space-y-5 overflow-y-auto pr-1">
              {navigationSections.map((section) => (
                <div key={section.label} className="space-y-2">
                  {!collapsed ? <p className="px-3 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">{section.label}</p> : null}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                      const Icon = iconMap[item.icon] ?? LayoutDashboard

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={cn(
                            'group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200',
                            active ? 'bg-blue-500/15 text-white ring-1 ring-blue-400/30' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                            collapsed && 'justify-center px-2',
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed ? (
                            <div className="min-w-0">
                              <div className="font-medium">{item.label}</div>
                              <div className="truncate text-xs text-slate-500 group-hover:text-slate-400">{item.description}</div>
                            </div>
                          ) : null}
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {!collapsed ? (
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Estado</div>
                <div className="mt-2 text-sm text-slate-300">Conexión Firebase lista para autenticación, Firestore y Storage.</div>
              </div>
            ) : null}
          </aside>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071426]/85 px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 xl:flex">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-300">{activeItem.section}</p>
                  <h1 className="truncate text-2xl font-semibold text-white">{activeItem.label}</h1>
                  <p className="truncate text-sm text-slate-400">{activeItem.description}</p>
                </div>
              </div>

              <div className="grid gap-3 xl:flex xl:items-center">
                <div className="relative xl:w-[340px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Buscar ventas, productos, clientes..."
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:flex">
                  <Select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value as typeof selectedRange)}>
                    <option value="Hoy">Hoy</option>
                    <option value="Semana">Semana</option>
                    <option value="Mes">Mes</option>
                    <option value="Año">Año</option>
                  </Select>
                  <Button variant="secondary" className="justify-center">
                    <CalendarDays className="h-4 w-4" />
                    Fechas
                  </Button>
                  <Button variant="secondary" className="justify-center">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                  <Button variant="secondary" className="justify-center">
                    <Settings2 className="h-4 w-4" />
                    Ajustes
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-slate-300 xl:hidden">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-blue-300" />
                <span className="text-sm">Operaciones en vivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" aria-label="Notificaciones">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Mensajes">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Ayuda">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="relative flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>

      {isMobile ? (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#08111f]/95 px-3 py-3 backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-2">
            {bottomNavigation.map((item) => {
              const active = location.pathname === item.path

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition',
                    active ? 'bg-blue-500/15 text-white' : 'text-slate-400',
                  )}
                >
                  <MobileNavIcon icon={item.icon} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </nav>
      ) : null}
    </div>
  )
}