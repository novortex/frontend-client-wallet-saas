// types/index.ts

// Define filter options type
export interface FilterOptions {
  status: string[]
  manager: string[]
  startDateFrom: Date | null
  startDateTo: Date | null
  closingDateFrom: Date | null
  closingDateTo: Date | null
  showClosedWallets: boolean
}

// Tipo da carteira
export type WalletClosing = {
  id: string
  clientName: string
  managerName: string
  startDate: string
  closingDate: string | null
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing'
}
