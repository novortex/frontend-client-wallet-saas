import { create } from 'zustand'

type ManagerBenchmarkOrganization = {
  managers: { name: string; uuid: string }[]
  benchs: { name: string; cuid: string }[]
  exchanges: { name: string; uuid: string }[]
  setManagers: (
    value: { name: string; uuid: string }[]
  ) => void
  setBenchs: (
    value: { name: string; cuid: string }[]
  ) => void
  setExchanges: (
    value: { name: string; uuid: string }[]
  ) => void
}

export const useManagerOrganization =
  create<ManagerBenchmarkOrganization>()(
    (set) => ({
      managers: [],
      benchs: [],
      exchanges: [],
      setManagers(value) {
        set({
          managers: value,
        })
      },
      setBenchs(value) {
        set({
          benchs: value,
        })
      },
      setExchanges(value) {
        set({
          exchanges: value,
        })
      },
    })
  )
