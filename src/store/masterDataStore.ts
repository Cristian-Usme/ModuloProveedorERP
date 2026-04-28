import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { masterDataCatalog } from '@/modules/masterData/catalog'
import type { MasterDataKind, MasterRecordMap } from '@/types/masterData'

type MasterDataState = {
  users: MasterRecordMap['users'][]
  customers: MasterRecordMap['customers'][]
  suppliers: MasterRecordMap['suppliers'][]
  products: MasterRecordMap['products'][]
  inventory: MasterRecordMap['inventory'][]
  addRecord: <K extends MasterDataKind>(kind: K, record: MasterRecordMap[K]) => void
  removeRecord: <K extends MasterDataKind>(kind: K, recordId: string) => void
  resetKind: <K extends MasterDataKind>(kind: K) => void
}

const initialState = {
  users: [],
  customers: [],
  suppliers: [],
  products: [],
  inventory: [],
}

export const useMasterDataStore = create<MasterDataState>()(
  persist(
    (set) => ({
      ...initialState,
      addRecord: (kind, record) =>
        set((state) => ({
          ...state,
          [kind]: [record, ...(state[kind] as MasterRecordMap[typeof kind][])],
        })),
      removeRecord: (kind, recordId) =>
        set((state) => ({
          ...state,
          [kind]: (state[kind] as { id: string }[]).filter((record) => record.id !== recordId),
        })),
      resetKind: (kind) =>
        set(() => ({
          [kind]: initialState[kind],
        }) as Partial<MasterDataState>),
    }),
    { name: 'erp-master-data' },
  ),
)
