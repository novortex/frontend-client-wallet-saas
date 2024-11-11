const columns = [
  {
    accessorKey: 'asset',
    header: 'Asset',
  },
  {
    accessorKey: 'investedAmount',
    header: 'Invested Amount',
  },
]

const data = [
  { asset: 'Bitcoin', investedAmount: 1000 },
  { asset: 'Ethereum', investedAmount: 500 },
  { asset: 'Litecoin', investedAmount: 300 },
]

const walletUuid = 'some-uuid'

export { columns, data, walletUuid }
