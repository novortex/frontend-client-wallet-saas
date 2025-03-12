enum PaymentStatus {
  PAID = 'PAID',
  WAIT_PAYMENT = 'WAIT_PAYMENT',
  LATE_PAYMENT = 'LATE_PAYMENT',
  CANCELED = 'CANCELED',
}

export type Organization = {
  uuid: string
  name: string
  status: PaymentStatus
  fiatCurrency: string
}
