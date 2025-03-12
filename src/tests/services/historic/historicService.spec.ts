import { instance } from '@/config/api'
import { getWalletHistoric } from '@/services/historicService.ts'

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
  },
}))

describe('getWalletHistoric', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch wallet historic successfully', async () => {
    const mockData = [
      { date: '2024-02-01', action: 'deposit', amount: 100 },
      { date: '2024-02-02', action: 'withdrawal', amount: 50 },
    ]

    ;(instance.get as jest.Mock).mockResolvedValue({ data: mockData })

    const result = await getWalletHistoric('wallet-123')

    expect(result).toEqual(mockData)
    expect(instance.get).toHaveBeenCalledWith('historic/wallet-123')
  })

  it('should throw an error when fetching wallet historic fails', async () => {
    ;(instance.get as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch historic'),
    )

    await expect(getWalletHistoric('wallet-123')).rejects.toThrow(
      'Failed to fetch wallet historic',
    )
  })
})
