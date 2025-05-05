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

export interface WalletClosing {
  id: string
  clientName: string
  managerName: string
  startDate: string | null
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
