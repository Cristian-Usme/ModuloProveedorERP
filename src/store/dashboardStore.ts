import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultWidgets } from '@/modules/dashboard/widgetCatalog'
import type { DashboardWidget, CustomWidgetDraft } from '@/types/erp'

type DashboardState = {
  widgets: DashboardWidget[]
  customWidgets: Array<DashboardWidget & { value: string }>
  hiddenWidgetIds: string[]
  searchQuery: string
  selectedRange: 'Hoy' | 'Semana' | 'Mes' | 'Año'
  setSearchQuery: (value: string) => void
  setSelectedRange: (value: 'Hoy' | 'Semana' | 'Mes' | 'Año') => void
  toggleWidget: (widgetId: string) => void
  addCustomWidget: (draft: CustomWidgetDraft) => void
  removeCustomWidget: (widgetId: string) => void
  resetLayout: () => void
}

const defaultWidgetIds = defaultWidgets.map((widget) => widget.id)

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      customWidgets: [],
      hiddenWidgetIds: [],
      searchQuery: '',
      selectedRange: 'Mes',
      setSearchQuery: (value) => set({ searchQuery: value }),
      setSelectedRange: (value) => set({ selectedRange: value }),
      toggleWidget: (widgetId) =>
        set((state) => ({
          hiddenWidgetIds: state.hiddenWidgetIds.includes(widgetId)
            ? state.hiddenWidgetIds.filter((id) => id !== widgetId)
            : [...state.hiddenWidgetIds, widgetId],
        })),
      addCustomWidget: (draft) =>
        set((state) => ({
          customWidgets: [
            ...state.customWidgets,
            {
              id: `custom-${crypto.randomUUID()}`,
              title: draft.title,
              subtitle: draft.subtitle,
              kind: 'custom',
              size: draft.size,
              accent: draft.accent,
              value: draft.value,
            },
          ],
        })),
      removeCustomWidget: (widgetId) =>
        set((state) => ({
          customWidgets: state.customWidgets.filter((widget) => widget.id !== widgetId),
        })),
      resetLayout: () =>
        set({
          hiddenWidgetIds: [],
          customWidgets: [],
          widgets: defaultWidgets,
        }),
    }),
    {
      name: 'erp-dashboard-layout',
      partialize: (state) => ({
        hiddenWidgetIds: state.hiddenWidgetIds,
        customWidgets: state.customWidgets,
        selectedRange: state.selectedRange,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.widgets = defaultWidgets.filter((widget) => defaultWidgetIds.includes(widget.id))
      },
    },
  ),
)