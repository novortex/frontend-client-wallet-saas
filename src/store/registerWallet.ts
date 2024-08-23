import { create } from 'zustand'

type RegisterWallet = {
  performanceFee: number
  benchmark: string
  riskProfile: string
  initialFee: number
  investedAmount: number
  contract: boolean
  manager: string

  firstModal: (value: {
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
