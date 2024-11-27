export type TAsset = {
  cryptoCurrentAmount: string
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
