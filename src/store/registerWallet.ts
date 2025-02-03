import { create } from 'zustand'

type RegisterWallet = {
  currency: string
  performanceFee: number
  benchmark: string
  riskProfile: string
  initialFee: number
  investedAmount: number
  contract: boolean
  manager: string

  firstModal: (value: {
    currency: string
    performanceFee: number
    benchmark: string
    riskProfile: string
    initialFee: number
    investedAmount: number
    contract: boolean
    manager: string
  }) => void
}

export const useRegisterWallet = create<RegisterWallet>()((set) => ({
  currency: '',
  performanceFee: 0,
  benchmark: '',
  riskProfile: '',
  initialFee: 0,
  investedAmount: 0,
  contract: false,
  manager: '',
  initialFeeIsPaid: false,
  emailAccount: '',
  passwordEmail: '',
  passwordAccount: '',

  firstModal(value) {
    set({
      currency: value.currency,
      performanceFee: value.performanceFee,
      benchmark: value.benchmark,
      riskProfile: value.riskProfile,
      initialFee: value.initialFee,
      investedAmount: value.investedAmount,
      contract: value.contract,
      manager: value.manager,
    })
  },
}))
