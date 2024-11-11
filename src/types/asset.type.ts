export type TAsset = {
  uuid: string
  name: string
  icon: string
  investedAmount: number
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
