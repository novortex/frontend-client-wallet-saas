// types/index.ts

// Define filter options type
// types/index.ts
export interface FilterOptions {
  status: string[]
  manager: string[]
  startDateFrom: Date | null | undefined
  startDateTo: Date | null | undefined
  closingDateFrom: Date | null | undefined
  closingDateTo: Date | null | undefined
  showClosedWallets: boolean
}

// Tipo da carteira
export type WalletClosing = {
  id: string
  clientName: string
  managerName: string
  startDate: string
  closingDate: string | null
  status: string
}

export type PaginationData = {
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  totalItems: number
  pageSize: number
}
