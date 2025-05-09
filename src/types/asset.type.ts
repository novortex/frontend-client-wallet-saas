export type TAsset = {
  profitLossPercentage: number | null
  averagePrice: number
  currentAmount: number
  uuid: string
  name: string
  icon: string
  quantityAsset: number
  price: number
  currentAllocation: number
  idealAllocation: number
  idealAmountInMoney: number
  buyOrSell: number
}

export type AssetsOrganizationForSelectedResponse = {
  uuid: string
  name: string
  icon: string
}

export type BenchmarksProps = {
  benchmarkType: string
  cuid: string
  name: string
}

export type AllocationByAsset = {
  name: string
  total: number
}[]
