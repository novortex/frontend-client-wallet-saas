import { create } from 'zustand'

type RegisterCustomer = {
  name: string
  email: string
  cpf: string | null
  phone: string | null
  exchange: string
  initialFeeIsPaid: boolean
  emailAccount: string
  passwordEmail: string
  passwordAccount: string

  firstModal: (value: {
    name: string
    email: string
    cpf: string | null
    phone: string | null
  }) => void

  secondModal: (value: {
    exchange: string
    initialFeeIsPaid: boolean
    emailAccount: string
    passwordEmail: string
    passwordAccount: string
  }) => void
}

export const useRegisterCustomer = create<RegisterCustomer>()((set) => ({
  name: '',
  email: '',
  cpf: null,
  phone: null,
  exchange: '',
  initialFeeIsPaid: false,
  emailAccount: '',
  passwordEmail: '',
  passwordAccount: '',
  firstModal(value) {
    set({
      name: value.name,
      email: value.email,
      cpf: value.cpf,
      phone: value.phone,
    })
  },

  secondModal(value) {
    set({
      exchange: value.exchange,
      initialFeeIsPaid: value.initialFeeIsPaid,
      emailAccount: value.emailAccount,
      passwordEmail: value.passwordEmail,
      passwordAccount: value.passwordAccount,
    })
  },
}))
