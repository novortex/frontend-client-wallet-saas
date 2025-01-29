import { create } from 'zustand'

type SignalStore = {
  signal: boolean
  setSignal: (value: boolean) => void
}

export const useSignalStore =
  create<SignalStore>()((set) => ({
    signal: false,
    setSignal(value) {
      set({
        signal: value,
      })
    },
  }))
