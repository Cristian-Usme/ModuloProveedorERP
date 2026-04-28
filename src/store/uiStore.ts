import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UiState = {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  dashboardManagerOpen: boolean
  setSidebarCollapsed: (value: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (value: boolean) => void
  toggleDashboardManager: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      dashboardManagerOpen: false,
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileMenuOpen: (value) => set({ mobileMenuOpen: value }),
      toggleDashboardManager: () => set((state) => ({ dashboardManagerOpen: !state.dashboardManagerOpen })),
    }),
    { name: 'erp-ui-state' },
  ),
)