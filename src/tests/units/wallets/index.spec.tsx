import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { getWalletOrganization } from '@/services/request'
import { useUserStore } from '@/store/user'
import { useToast } from '@/components/ui/use-toast'
import { Clients } from '@/pages/wallets'
import { MemoryRouter } from 'react-router-dom'

// Mock do useUserStore
jest.mock('@/store/user', () => ({
  useUserStore: jest.fn(),
}))

// Mock do useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}))

// Mock da função getWalletOrganization
jest.mock('@/services/request', () => ({
  getWalletOrganization: jest.fn(),
}))

describe('Clients Component', () => {
  const mockToast = jest.fn()

  beforeEach(() => {
    ;(useUserStore as unknown as jest.Mock).mockReturnValue(['mock-uuid'])
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and displays clients', async () => {
    // Arrange (Preparação)
    const mockClients = [
      {
        walletUuid: 'wallet-1',
        infosClient: {
          name: 'Client One',
          email: 'client1@example.com',
          phone: '123-456-7890',
        },
        managerName: 'Manager A',
        lastBalance: new Date(),
        nextBalance: new Date(),
      },
    ]
    ;(getWalletOrganization as jest.Mock).mockResolvedValueOnce(mockClients)

    // Act (Ação)
    render(
      <MemoryRouter>
        <Clients />
      </MemoryRouter>,
    )

    // Assert (Aferição)
    expect(getWalletOrganization).toHaveBeenCalledWith('mock-uuid')
    const clientName = await screen.findByText('Client One')
    expect(clientName).toBeInTheDocument()
  })

  it('displays toast message when fetching clients fails', async () => {
    // Arrange (Preparação)
    ;(getWalletOrganization as jest.Mock).mockResolvedValueOnce(null)

    // Act (Ação)
    render(
      <MemoryRouter>
        <Clients />
      </MemoryRouter>,
    )

    // Assert (Aferição)
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        className: 'bg-red-500 border-0 text-white',
        title: 'Failed get clients :(',
        description: 'Demo Vault !!',
      })
    })
  })

  it('filters clients based on search input', async () => {
    // Arrange (Preparação)
    const mockClients = [
      {
        walletUuid: 'wallet-1',
        infosClient: {
          name: 'Client One',
          email: 'client1@example.com',
          phone: '123-456-7890',
        },
        managerName: 'Manager A',
        lastBalance: new Date(),
        nextBalance: new Date(),
      },
      {
        walletUuid: 'wallet-2',
        infosClient: {
          name: 'Client Two',
          email: 'client2@example.com',
          phone: '098-765-4321',
        },
        managerName: 'Manager B',
        lastBalance: new Date(),
        nextBalance: new Date(),
      },
    ]
    ;(getWalletOrganization as jest.Mock).mockResolvedValueOnce(mockClients)

    // Act (Ação)
    render(
      <MemoryRouter>
        <Clients />
      </MemoryRouter>,
    )
    const searchInput = screen.getByPlaceholderText('Search for ...')
    fireEvent.change(searchInput, { target: { value: 'Client One' } })

    // Assert (Aferição)
    const clientNameOne = await screen.findByText('Client One')
    expect(clientNameOne).toBeInTheDocument()
    expect(screen.queryByText('Client Two')).not.toBeInTheDocument()
  })
})
