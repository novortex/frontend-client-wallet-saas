export type AddAssetResponse = {
  addAsset: {
    assetUuid: string
    walletUuid: string
    quantity: number
    targetAllocation: number
  }
}

export type SaveHistoryResponse = {
  saveHistory: {
    assetUuid: string
    createAt: string
    cuid: string
    data: {
      data: string
      icon: string
      asset: string
      quantity: number
      target_allocation: number
    }
    description: string
    historyType: string
    userUuid: string
    walletUuid: string
  }
}

export type UpdateCurrentAmountOfWalletResponse = {
  updateCurrentAmountOfWallet: {
    accountEmail: string | null
    benchmarkCuid: string
    closeDate: string
    contract: boolean
    createAt: string
    currentAmount: number
    emailPassword: string | null
    exchangePassword: string | null
    exchangeUuid: string
    initialFee: number
    initialFeePaid: boolean
    investedAmount: number
    isClosed: boolean
    lastRebalance: string | null
    monthCloseDate: string
    organizationUuid: string
    performanceFee: number
    rebalanceInterval: string | null
    riskProfile: string
    startDate: string
    updateAt: string
    userUuid: string
    uuid: string
  }
}

export type AddAssetFunctionResponse = AddAssetResponse & SaveHistoryResponse & UpdateCurrentAmountOfWalletResponse
