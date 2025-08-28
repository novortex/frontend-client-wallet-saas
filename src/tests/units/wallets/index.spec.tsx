import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardClient from '../../../pages/wallets/card-client'
import { Wallets } from '../../../pages/wallets/index.tsx'
import { getWalletOrganization } from '@/services/wallet/walleInfoService'
import { getWalletsCash } from '@/services/wallet/walletAssetService'

// Mock IntersectionObserver for test environment
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// Mock dos serviços
jest.mock('@/services/wallet/walleInfoService', () => ({
  getWalletOrganization: jest.fn(),
}))

jest.mock('@/services/wallet/walletAssetService', () => ({
  getWalletsCash: jest.fn(),
}))

// Mock robusto do toast que funciona em todos os cenários
const mockToast = jest.fn()

jest.mock('@/components/ui/use-toast', () => ({
  __esModule: true,
  toast: mockToast,
  useToast: jest.fn(() => ({
    toast: mockToast,
  })),
}))

// Mock do useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock dos componentes que não são relevantes para os testes
jest.mock('@/components/custom/switch-theme', () => ({
  SwitchTheme: () => <div data-testid="switch-theme">Switch Theme</div>,
}))

jest.mock('@/components/custom/clientsFilterModal/index', () => ({
  ClientsFilterModal: ({
    handleApplyFilters,
  }: {
    handleApplyFilters: (filters: any) => void
  }) => (
    <button
      data-testid="filter-modal"
      onClick={() => handleApplyFilters({ selectedManagers: ['Test Manager'] })}
    >
      Filters
    </button>
  ),
}))

jest.mock('@/components/custom/loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

// Mock da função formatDate
jest.mock('@/utils', () => ({
  formatDate: (date: string) => {
    const d = new Date(date)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  },
}))

// Mock dados completos para os testes
const mockClients = [
  {
    walletUuid: '1',
    infosClient: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
    managerName: 'Manager One',
    lastBalance: '2023-10-01',
    nextBalance: '2023-11-01',
    hasContract: true,
    riskProfile: 'moderate',
    exchange: 'Binance',
    benchmark: 'BTC',
    assetsUuid: ['asset1', 'asset2'],
    createAt: '2023-01-01',
  },
  {
    walletUuid: '2',
    infosClient: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
    },
    managerName: 'Manager Two',
    lastBalance: '2023-09-01',
    nextBalance: '2023-12-01',
    hasContract: false,
    riskProfile: 'aggressive',
    exchange: 'Coinbase',
    benchmark: 'ETH',
    assetsUuid: ['asset3', 'asset4'],
    createAt: '2023-02-01',
  },
  {
    walletUuid: '3',
    infosClient: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1122334455',
    },
    managerName: 'Manager One',
    lastBalance: '2023-08-01',
    nextBalance: '2023-10-01',
    hasContract: true,
    riskProfile: 'conservative',
    exchange: 'Kraken',
    benchmark: 'USDT',
    assetsUuid: ['asset1', 'asset3'],
    createAt: '2023-03-01',
  },
]

const mockWalletsCash = {
  '1': 5.5,
  '2': 0,
  '3': 12.3,
}

describe('Wallet Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
    ;(getWalletOrganization as jest.Mock).mockResolvedValue(mockClients)
    ;(getWalletsCash as jest.Mock).mockResolvedValue(mockWalletsCash)
  })

  describe('CardClient', () => {
    const defaultProps = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      alerts: 3,
      responsible: 'Manager One',
      lastRebalancing: '01/10/2023',
      nextRebalancing: '01/11/2023',
      walletUuid: '1',
    }

    it('should render the card with correct data', () => {
      render(<CardClient {...defaultProps} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Manager One')).toBeInTheDocument()
      expect(screen.getByText('3 alerts')).toBeInTheDocument()
      expect(screen.getByText('Next rebalancing:')).toBeInTheDocument()
      expect(screen.getByText('Last rebalancing:')).toBeInTheDocument()
      expect(screen.getByText('01/11/2023')).toBeInTheDocument()
      expect(screen.getByText('01/10/2023')).toBeInTheDocument()
    })

    it('should navigate to the correct page on card click', async () => {
      const user = userEvent.setup()
      render(<CardClient {...defaultProps} />)

      const card = screen.getByText('John Doe').closest('div')
      expect(card).toBeInTheDocument()

      if (card) {
        await user.click(card)
        expect(mockNavigate).toHaveBeenCalledWith('/clients/1/infos', {
          state: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
          },
        })
      }
    })

    it('should display the correct alert colors based on alert count', () => {
      const testCases = [
        { alerts: 0, expectedClass: 'bg-muted' },
        { alerts: 2, expectedClass: 'bg-success' },
        { alerts: 5, expectedClass: 'bg-warning' },
        { alerts: 7, expectedClass: 'bg-chart-6' },
        { alerts: 10, expectedClass: 'bg-destructive' },
      ]

      testCases.forEach(({ alerts, expectedClass }) => {
        const { unmount } = render(
          <CardClient {...defaultProps} alerts={alerts} />,
        )

        const alertDiv = screen.getByText(`${alerts} alerts`).parentElement
        expect(alertDiv).toHaveClass(expectedClass)

        unmount()
      })
    })

    it('should show delayed rebalancing warning when next rebalancing is in the past', () => {
      const pastDate = '01/01/2020' // Data no passado
      render(<CardClient {...defaultProps} nextRebalancing={pastDate} />)

      expect(screen.getByText('delayed rebalancing')).toBeInTheDocument()
      expect(screen.getByText('delayed rebalancing')).toHaveClass(
        'text-red-600',
      )
    })
  })

  describe('Clients Component', () => {
    it('should render loading state initially', () => {
      // Mock com delay para simular loading
      ;(getWalletOrganization as jest.Mock).mockImplementation(
        () => new Promise(() => {}), // Promise que nunca resolve
      )

      render(<Wallets />)
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('should render the list of clients after loading', async () => {
      render(<Wallets />)

      // Aguarda o carregamento dos clientes
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
      })

      // Verifica se o contador está correto
      expect(screen.getByText('Showing 3 of 3 wallets')).toBeInTheDocument()
    })

    it('should filter clients based on search term', async () => {
      const user = userEvent.setup()
      render(<Wallets />)

      // Aguarda o carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Busca por "John"
      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, 'John')

      // Verifica se apenas John Doe e Bob Johnson são exibidos
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })

      // Verifica o contador atualizado
      expect(
        screen.getByText('Showing 2 of 2 wallets (3 total)'),
      ).toBeInTheDocument()
    })

    it('should display "No wallets match your current filters" when filters exclude all results', async () => {
      const user = userEvent.setup()
      render(<Wallets />)

      // Aguarda carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Busca por algo que não existe
      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, 'NonExistentName')

      await waitFor(() => {
        expect(
          screen.getByText('No wallets match your current filters'),
        ).toBeInTheDocument()
      })
    })

    it('should show pagination with initial 12 items limit', async () => {
      // Mock com exatamente 15 itens para testar paginação
      const manyClients = Array.from({ length: 15 }, (_, i) => ({
        ...mockClients[0],
        walletUuid: `${i + 1}`,
        infosClient: {
          ...mockClients[0].infosClient,
          name: `Client ${i + 1}`,
          email: `client${i + 1}@example.com`,
        },
      }))

      const manyCash = Array.from({ length: 15 }, (_, i) => ({
        [`${i + 1}`]: 5.5,
      })).reduce((acc, curr) => ({ ...acc, ...curr }), {})

      ;(getWalletOrganization as jest.Mock).mockResolvedValue(manyClients)
      ;(getWalletsCash as jest.Mock).mockResolvedValue(manyCash)

      render(<Wallets />)

      await waitFor(() => {
        expect(screen.getByText('Showing 12 of 15 wallets')).toBeInTheDocument()
      })

      // Verifica que apenas 12 cards únicos são renderizados inicialmente
      await waitFor(() => {
        const clientCards = screen.getAllByText(/^Client \d+$/)
        expect(clientCards).toHaveLength(12)
      })
    })

    it('should apply filters through filter modal', async () => {
      const user = userEvent.setup()
      render(<Wallets />)

      // Aguarda carregamento inicial
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Clica no botão de filtros
      const filterButton = screen.getByTestId('filter-modal')
      await user.click(filterButton)

      // Como o mock aplica filtro por 'Test Manager', nenhum resultado deve aparecer
      await waitFor(() => {
        expect(
          screen.getByText('No wallets match your current filters'),
        ).toBeInTheDocument()
      })
    })

    it('should clear search input correctly', async () => {
      const user = userEvent.setup()
      render(<Wallets />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const searchInput = screen.getByTestId('search-input')

      // Digita algo
      await user.type(searchInput, 'John')
      expect(searchInput).toHaveValue('John')

      // Limpa o campo
      await user.clear(searchInput)
      expect(searchInput).toHaveValue('')

      // Verifica que todos os clientes voltaram a aparecer
      await waitFor(() => {
        expect(screen.getByText('Showing 3 of 3 wallets')).toBeInTheDocument()
      })
    })
  })
})
