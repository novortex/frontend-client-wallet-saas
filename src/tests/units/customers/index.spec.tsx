import { render, waitFor } from '@testing-library/react'
import { Customers } from '@/pages/customers'
import {
  getAllCustomersOrganization,
  getAllManagersOnOrganization,
  getAllBenchmark,
  getAllExchange,
} from '@/services/request'
import { useUserStore } from '@/store/user'
import { useToast } from '@/components/ui/use-toast'
import { MemoryRouter } from 'react-router-dom'

jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(),
}))

jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}))

jest.mock('@/services/request', () => ({
  getAllCustomersOrganization: jest.fn(),
  getAllManagersOnOrganization: jest.fn(),
  getAllBenchmark: jest.fn(),
  getAllExchange: jest.fn(),
}))

describe('Customers Component', () => {
  const mockToast = jest.fn()

  beforeEach(() => {
    ;(useUserStore as unknown as jest.Mock).mockReturnValue(['mock-uuid'])
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('displays toast message when fetching customers fails', async () => {
    // Arrange
    ;(getAllCustomersOrganization as jest.Mock).mockResolvedValueOnce(null)

    // Act
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>,
    )

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        className: 'bg-red-500 border-0 text-white',
        title: 'Failed get assets organization :(',
        description: 'Demo Vault !!',
      })
    })
  })

  it('loads and fetches managers and benchmarks', async () => {
    // Arrange
    const mockManagers = ['Manager A', 'Manager B']
    const mockBenchmarks = ['Benchmark A', 'Benchmark B']
    const mockExchanges = ['Exchange A', 'Exchange B']

    ;(getAllManagersOnOrganization as jest.Mock).mockResolvedValueOnce(
      mockManagers,
    )
    ;(getAllBenchmark as jest.Mock).mockResolvedValueOnce(mockBenchmarks)
    ;(getAllExchange as jest.Mock).mockResolvedValueOnce(mockExchanges)

    // Act
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>,
    )

    // Assert
    await waitFor(() => {
      expect(getAllManagersOnOrganization).toHaveBeenCalledWith('mock-uuid')
      expect(getAllBenchmark).toHaveBeenCalledWith('mock-uuid')
      expect(getAllExchange).toHaveBeenCalledWith('mock-uuid')
    })
  })
})
