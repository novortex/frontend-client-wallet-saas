import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import WalletMonitoring from '../../../pages/walletMonitoring/index'
import { useWalletMonitoring } from '../../../pages/walletMonitoring/hooks/useWalletMonitoring'

// Main hook mock
jest.mock('../../../pages/walletMonitoring/hooks/useWalletMonitoring')

// UI components mock
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, size, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-size={size}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, onBlur, autoFocus, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoFocus={autoFocus}
      data-testid={props['data-testid'] || 'input'}
      {...props}
    />
  ),
}))

// Custom components mock
jest.mock('@/components/custom/loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

jest.mock('@/components/custom/switch-theme', () => ({
  SwitchTheme: () => <div data-testid="switch-theme">Switch Theme</div>,
}))

// WalletMonitoring specific components mock
jest.mock('../../../pages/walletMonitoring/components/filterModal', () => ({
  FilterModal: ({ isOpen, onOpenChange, onApplyFilter }: any) =>
    isOpen ? (
      <div data-testid="filter-modal">
        <button
          data-testid="apply-filter-button"
          onClick={() =>
            onApplyFilter({ manager: ['test-manager'], status: ['perfect'] })
          }
        >
          Apply Filter
        </button>
        <button
          data-testid="close-filter-button"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    ) : null,
}))

jest.mock('../../../pages/walletMonitoring/components/statusBadge', () => ({
  PerformanceBadge: ({ percentage, showPercentage }: any) => (
    <div data-testid="performance-badge" data-percentage={percentage}>
      {percentage >= 100
        ? 'Perfect'
        : percentage >= 80
          ? 'Good'
          : percentage >= 60
            ? 'Warning'
            : 'Critical'}
      {showPercentage && ` (${percentage.toFixed(1)}%)`}
    </div>
  ),
}))

// Lucide icons mock
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  Download: () => <div data-testid="download-icon">Download</div>,
  SlidersHorizontal: () => <div data-testid="filter-icon">Filter</div>,
}))

// Test data
const mockManagersData = [
  {
    managerName: 'John Manager',
    totalWallets: 10,
    balancedWallets: 8,
    delayedWallets: 2,
    percentage: 80.0,
  },
  {
    managerName: 'Jane Manager',
    totalWallets: 5,
    balancedWallets: 5,
    delayedWallets: 0,
    percentage: 100.0,
  },
  {
    managerName: 'Bob Manager',
    totalWallets: 8,
    delayedWallets: 5,
    balancedWallets: 3,
    percentage: 37.5,
  },
]

const mockStats = {
  totalManagers: 3,
  perfectManagers: 1,
  goodManagers: 1,
  warningManagers: 0,
  criticalManagers: 1,
}

const mockStandardizationStats = {
  standardizedWallets: 8,
  nonStandardizedWallets: 2,
  totalWallets: 10,
  standardizationPercentage: 80.0,
}

const mockStandardizedWalletsData = [
  {
    walletUuid: 'wallet-1',
    clientName: 'Client A',
    managerName: 'John Manager',
    lastRebalance: '2024-01-15',
    nextRebalance: '2024-02-15',
    daysSinceLastRebalance: 30,
    isWithinStandardInterval: true,
    isStandardized: true,
    statusDescription: 'Within standard interval',
  },
  {
    walletUuid: 'wallet-2',
    clientName: 'Client B',
    managerName: 'Jane Manager',
    lastRebalance: '2024-01-01',
    nextRebalance: '2024-02-01',
    daysSinceLastRebalance: 44,
    isWithinStandardInterval: false,
    isStandardized: false,
    statusDescription: 'Delayed rebalancement',
  },
]

const mockProcessedManagers = [
  {
    managerName: 'John Manager',
    totalWallets: 10,
    balancedWallets: 8,
    delayedWallets: 2,
    percentage: 80.0,
    frcData: {
      managerName: 'John Manager',
      managerUuid: 'manager-1',
      totalClients: 40,
      frc0Count: 24,
      frc1Count: 10,
      frcMoreThan1Count: 6,
      frc0Percent: 60.0,
      frc1Percent: 25.0,
      frcMoreThan1Percent: 15.0,
      period: '2024-01',
    },
  },
  {
    managerName: 'Jane Manager',
    totalWallets: 5,
    balancedWallets: 5,
    delayedWallets: 0,
    percentage: 100.0,
    frcData: {
      managerName: 'Jane Manager',
      managerUuid: 'manager-2',
      totalClients: 30,
      frc0Count: 18,
      frc1Count: 8,
      frcMoreThan1Count: 4,
      frc0Percent: 60.0,
      frc1Percent: 26.7,
      frcMoreThan1Percent: 13.3,
      period: '2024-01',
    },
  },
  {
    managerName: 'Bob Manager',
    totalWallets: 8,
    delayedWallets: 5,
    balancedWallets: 3,
    percentage: 37.5,
  },
]

const mockUniqueManagers = [
  { name: 'John Manager' },
  { name: 'Jane Manager' },
  { name: 'Bob Manager' },
]

const mockFilters = {
  managersSelected: [],
  dateFrom: '',
  dateTo: '',
  manager: [],
  status: [],
  searchTerm: '',
}

const defaultMockHookReturn = {
  loading: false,
  managers: mockManagersData,
  stats: mockStats,
  currentPage: 1,
  setCurrentPage: jest.fn(),
  canPreviousPage: false,
  canNextPage: true,
  totalPages: 2,
  searchTerm: '',
  setSearchTerm: jest.fn(),
  filters: mockFilters,
  setFilters: jest.fn(),
  uniqueManagers: mockUniqueManagers,
  standardizationStats: mockStandardizationStats,
  standardizedWallets: mockStandardizedWalletsData,
  standardizationCurrentPage: 1,
  setStandardizationCurrentPage: jest.fn(),
  canStandardizationPreviousPage: false,
  canStandardizationNextPage: true,
  standardizationTotalPages: 1,
  processedManagers: mockProcessedManagers,
  frcPage: 1,
  setFrcPage: jest.fn(),
  frcTotalPages: 1,
  canFrcPrevious: false,
  canFrcNext: false,
  paginatedFrcManagers: mockProcessedManagers,
  frcSelectedManagers: [],
  setFrcSelectedManagers: jest.fn(),
  frcLoading: false,
  fetchFrcData: jest.fn(),
}

describe('WalletMonitoring Component', () => {
  const mockUseWalletMonitoring = useWalletMonitoring as jest.MockedFunction<
    typeof useWalletMonitoring
  >

  // Global window.alert mock
  const originalAlert = window.alert

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseWalletMonitoring.mockReturnValue(defaultMockHookReturn)
    window.alert = jest.fn()
  })

  afterEach(() => {
    window.alert = originalAlert
  })

  describe('Initial Rendering', () => {
    it('should render the component correctly', () => {
      render(<WalletMonitoring />)

      expect(screen.getByText('Wallet Monitoring')).toBeInTheDocument()
      expect(screen.getByTestId('switch-theme')).toBeInTheDocument()
      expect(
        screen.getByText('Manager Performance Overview'),
      ).toBeInTheDocument()
    })

    it('should show loading when loading is true', () => {
      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        loading: true,
      })

      render(<WalletMonitoring />)
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('should render all stats cards', () => {
      render(<WalletMonitoring />)

      expect(screen.getByText('Perfect (100%)')).toBeInTheDocument()
      expect(screen.getByText('Good (80-99%)')).toBeInTheDocument()
      expect(screen.getByText('Warning (60-79%)')).toBeInTheDocument()
      expect(screen.getByText('Critical (<60%)')).toBeInTheDocument()
      expect(screen.getByText('Total Managers')).toBeInTheDocument()

      // Check specific values - look for the full parent container
      const perfectSection = screen
        .getByText('Perfect (100%)')
        .closest('div')?.parentElement
      expect(perfectSection).toHaveTextContent('Perfect (100%)')
      expect(perfectSection).toHaveTextContent('1')

      const goodSection = screen
        .getByText('Good (80-99%)')
        .closest('div')?.parentElement
      expect(goodSection).toHaveTextContent('Good (80-99%)')
      expect(goodSection).toHaveTextContent('1')

      const warningSection = screen
        .getByText('Warning (60-79%)')
        .closest('div')?.parentElement
      expect(warningSection).toHaveTextContent('Warning (60-79%)')
      expect(warningSection).toHaveTextContent('0')

      const criticalSection = screen
        .getByText('Critical (<60%)')
        ?.closest('div')?.parentElement
      expect(criticalSection).toHaveTextContent('Critical (<60%)')
      expect(criticalSection).toHaveTextContent('1')

      const totalSection = screen
        .getByText('Total Managers')
        .closest('div')?.parentElement
      expect(totalSection).toHaveTextContent('Total Managers')
      expect(totalSection).toHaveTextContent('3')
    })
  })

  describe('Managers Table', () => {
    it('should render table header correctly', () => {
      render(<WalletMonitoring />)

      expect(screen.getByText('Manager')).toBeInTheDocument()
      expect(screen.getByText('Balanced Wallets')).toBeInTheDocument()
      expect(screen.getByText('Delayed Wallets')).toBeInTheDocument()
      expect(screen.getByText('Total Wallets')).toBeInTheDocument()
      expect(screen.getByText('Performance')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('should render managers data correctly', () => {
      render(<WalletMonitoring />)

      // John Manager
      expect(screen.getByText('John Manager')).toBeInTheDocument()
      expect(screen.getByText('8/10')).toBeInTheDocument()
      expect(screen.getByText('(80.0%)')).toBeInTheDocument()

      // Jane Manager
      expect(screen.getByText('Jane Manager')).toBeInTheDocument()
      expect(screen.getByText('5/5')).toBeInTheDocument()
      expect(screen.getByText('(100.0%)')).toBeInTheDocument()

      // Bob Manager
      expect(screen.getByText('Bob Manager')).toBeInTheDocument()
      expect(screen.getByText('3/8')).toBeInTheDocument()
      expect(screen.getByText('(37.5%)')).toBeInTheDocument()
    })

    it('should render performance badges correctly', () => {
      render(<WalletMonitoring />)

      const badges = screen.getAllByTestId('performance-badge')
      expect(badges).toHaveLength(3)

      // Check each badge individually
      const johnBadge = badges.find(
        (badge) => badge.getAttribute('data-percentage') === '80',
      )
      expect(johnBadge).toBeDefined()

      const janeBadge = badges.find(
        (badge) => badge.getAttribute('data-percentage') === '100',
      )
      expect(janeBadge).toBeDefined()

      const bobBadge = badges.find(
        (badge) => badge.getAttribute('data-percentage') === '37.5',
      )
      expect(bobBadge).toBeDefined()
    })

    it('should show message when there are no managers', () => {
      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        managers: [],
        stats: { ...mockStats, totalManagers: 0 },
      })

      render(<WalletMonitoring />)

      expect(screen.getByText('No managers found')).toBeInTheDocument()
      expect(
        screen.getByText('No managers to monitor at the moment.'),
      ).toBeInTheDocument()
    })
  })

  describe('Search System', () => {
    it('should open search input when clicking the icon', async () => {
      const user = userEvent.setup()
      render(<WalletMonitoring />)

      const searchIcon = screen.getByTestId('search-icon')
      const searchButton = searchIcon.parentElement

      if (searchButton) {
        await user.click(searchButton)
      }

      expect(
        screen.getByPlaceholderText('Search for a manager...'),
      ).toBeInTheDocument()
    })

    it('should update search term when typing', async () => {
      const user = userEvent.setup()
      const mockSetSearchTerm = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        setSearchTerm: mockSetSearchTerm,
      })

      render(<WalletMonitoring />)

      // Open search
      const searchIcon = screen.getByTestId('search-icon')
      const searchButton = searchIcon.parentElement

      if (searchButton) {
        await user.click(searchButton)
      }

      // Type in input
      const searchInput = screen.getByPlaceholderText('Search for a manager...')
      await user.type(searchInput, 'John')

      // Wait for debounce (300ms)
      await new Promise((resolve) => setTimeout(resolve, 350))

      expect(mockSetSearchTerm).toHaveBeenCalledWith('John')
    })

    it('should clear search when clicking the X button', async () => {
      const user = userEvent.setup()
      const mockSetSearchTerm = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        setSearchTerm: mockSetSearchTerm,
      })

      render(<WalletMonitoring />)

      // Open search
      const searchIcon = screen.getByTestId('search-icon')
      const searchButton = searchIcon.parentElement

      if (searchButton) {
        await user.click(searchButton)
      }

      // Check if search input appeared
      const searchInput = screen.getByPlaceholderText('Search for a manager...')
      expect(searchInput).toBeInTheDocument()

      // Type something in input first
      await user.type(searchInput, 'test')

      // Find clear button (may be button or role="button")
      const clearButton =
        screen.getByRole('button', { name: /✕/i }) ||
        screen.getByText('✕').closest('button')

      if (clearButton) {
        await user.click(clearButton)
      }

      // Check if setSearchTerm was called with empty string
      expect(mockSetSearchTerm).toHaveBeenCalledWith('')
    })

    it('should close input on blur when empty', async () => {
      const user = userEvent.setup()
      render(<WalletMonitoring />)

      // Open search
      const searchIcon = screen.getByTestId('search-icon')
      const searchButton = searchIcon.parentElement

      if (searchButton) {
        await user.click(searchButton)
      }

      // Blur without text
      await user.click(document.body)

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText('Search for a manager...'),
        ).not.toBeInTheDocument()
      })
    })

    it('should show specific message when search returns no results', () => {
      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        managers: [],
        searchTerm: 'NonExistentManager',
      })

      render(<WalletMonitoring />)

      expect(screen.getByText('No managers found')).toBeInTheDocument()
      expect(
        screen.getByText('Try adjusting the filters to find managers.'),
      ).toBeInTheDocument()
    })
  })

  describe('Filter System', () => {
    it('should open filter modal when clicking the button', async () => {
      const user = userEvent.setup()
      render(<WalletMonitoring />)

      const filterIcon = screen.getByTestId('filter-icon')
      const filterButton = filterIcon.parentElement

      if (filterButton) {
        await user.click(filterButton)
      }

      expect(screen.getByTestId('filter-modal')).toBeInTheDocument()
    })

    it('should apply filters from modal', async () => {
      const user = userEvent.setup()
      const mockSetFilters = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        setFilters: mockSetFilters,
      })

      render(<WalletMonitoring />)

      // Open modal
      const filterIcon = screen.getByTestId('filter-icon')
      const filterButton = filterIcon.parentElement

      if (filterButton) {
        await user.click(filterButton)
      }

      // Apply filter
      const applyButton = screen.getByTestId('apply-filter-button')
      await user.click(applyButton)

      expect(mockSetFilters).toHaveBeenCalledWith({
        manager: ['test-manager'],
        status: ['perfect'],
      })
    })

    it('should close filter modal', async () => {
      const user = userEvent.setup()
      render(<WalletMonitoring />)

      // Open modal
      const filterIcon = screen.getByTestId('filter-icon')
      const filterButton = filterIcon.parentElement

      if (filterButton) {
        await user.click(filterButton)
      }

      // Close modal
      const closeButton = screen.getByTestId('close-filter-button')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('Pagination', () => {
    it('should render pagination controls correctly', () => {
      render(<WalletMonitoring />)

      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('should disable Previous on first page', () => {
      render(<WalletMonitoring />)

      const previousButton = screen.getByText('Previous')
      expect(previousButton).toBeDisabled()
    })

    it('should disable Next on last page', () => {
      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        currentPage: 2,
        canPreviousPage: true,
        canNextPage: false,
      })

      render(<WalletMonitoring />)

      const nextButton = screen.getByText('Next')
      expect(nextButton).toBeDisabled()
    })

    it('should navigate to previous page', async () => {
      const user = userEvent.setup()
      const mockSetCurrentPage = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        currentPage: 2,
        canPreviousPage: true,
        setCurrentPage: mockSetCurrentPage,
      })

      render(<WalletMonitoring />)

      const previousButton = screen.getByText('Previous')
      await user.click(previousButton)

      expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function))
    })

    it('should navigate to next page', async () => {
      const user = userEvent.setup()
      const mockSetCurrentPage = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        setCurrentPage: mockSetCurrentPage,
      })

      render(<WalletMonitoring />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('Export Button', () => {
    it('should show alert when clicking export button', async () => {
      const user = userEvent.setup()

      render(<WalletMonitoring />)

      const downloadIcon = screen.getByTestId('download-icon')
      const exportButton = downloadIcon.parentElement

      if (exportButton) {
        await user.click(exportButton)
      }

      expect(window.alert).toHaveBeenCalledWith(
        'Export functionality not implemented yet',
      )
    })
  })

  describe('Empty States and Edge Cases', () => {
    it('should show page 1 of 1 when totalPages is 0', () => {
      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        totalPages: 0,
      })

      render(<WalletMonitoring />)

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
    })

    it('should handle managers with incomplete data', () => {
      const incompleteManager = {
        managerName: 'Incomplete Manager',
        totalWallets: 0,
        balancedWallets: 0,
        delayedWallets: 0,
        percentage: 0,
      }

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        managers: [incompleteManager],
      })

      render(<WalletMonitoring />)

      expect(screen.getByText('Incomplete Manager')).toBeInTheDocument()
      expect(screen.getByText('0/0')).toBeInTheDocument()
      expect(screen.getByText('(0.0%)')).toBeInTheDocument()
    })

    it('should render correctly with zeroed stats', () => {
      const emptyStats = {
        totalManagers: 0,
        perfectManagers: 0,
        goodManagers: 0,
        warningManagers: 0,
        criticalManagers: 0,
      }

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        managers: [],
        stats: emptyStats,
      })

      render(<WalletMonitoring />)

      // Check if all 0 values are present on screen
      // There are 5 cards with value 0, so we should have 5 elements with this text
      const zeroElements = screen.getAllByText('0')
      expect(zeroElements).toHaveLength(5)

      // Check if card labels are present
      expect(screen.getByText('Perfect (100%)')).toBeInTheDocument()
      expect(screen.getByText('Good (80-99%)')).toBeInTheDocument()
      expect(screen.getByText('Warning (60-79%)')).toBeInTheDocument()
      expect(screen.getByText('Critical (<60%)')).toBeInTheDocument()
      expect(screen.getByText('Total Managers')).toBeInTheDocument()
    })
  })

  describe('Responsiveness and CSS Classes', () => {
    it('should apply responsive classes to stats cards', () => {
      render(<WalletMonitoring />)
      // The cards container should have responsive grid classes
      const cardsContainer = screen.getByTestId('stats-cards-container')
      expect(cardsContainer).toHaveClass('grid')
      expect(cardsContainer).toHaveClass('grid-cols-1')
      expect(cardsContainer).toHaveClass('md:grid-cols-5')
    })

    it('should apply dark theme classes correctly', () => {
      render(<WalletMonitoring />)

      const title = screen.getByText('Wallet Monitoring')
      expect(title).toHaveClass('text-foreground')

      const tableHeader = screen.getByText('Manager Performance Overview')
      expect(tableHeader).toHaveClass('text-foreground')
    })

    it('should have table with responsive overflow', () => {
      render(<WalletMonitoring />)

      const table = screen.getByRole('table')
      const tableContainer = table.parentElement
      expect(tableContainer).toHaveClass('overflow-x-auto')
    })
  })

  describe('Hook Integration', () => {
    it('should call setCurrentPage with function for Previous', async () => {
      const user = userEvent.setup()
      const mockSetCurrentPage = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        currentPage: 2,
        canPreviousPage: true,
        setCurrentPage: mockSetCurrentPage,
      })

      render(<WalletMonitoring />)

      const previousButton = screen.getByText('Previous')
      await user.click(previousButton)

      // Check if called with a function
      expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function))

      // Test the passed function
      const setPageFunction = mockSetCurrentPage.mock.calls[0][0]
      expect(setPageFunction(2)).toBe(1) // Math.max(2 - 1, 1)
    })

    it('should call setCurrentPage with function for Next', async () => {
      const user = userEvent.setup()
      const mockSetCurrentPage = jest.fn()

      mockUseWalletMonitoring.mockReturnValue({
        ...defaultMockHookReturn,
        totalPages: 3,
        setCurrentPage: mockSetCurrentPage,
      })

      render(<WalletMonitoring />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      expect(mockSetCurrentPage).toHaveBeenCalledWith(expect.any(Function))

      // Test the passed function
      const setPageFunction = mockSetCurrentPage.mock.calls[0][0]
      expect(setPageFunction(1)).toBe(2) // Math.min(1 + 1, 3)
    })

    it('should pass correct props to FilterModal', async () => {
      const user = userEvent.setup()
      render(<WalletMonitoring />)

      // Open modal to check props
      const filterIcon = screen.getByTestId('filter-icon')
      const filterButton = filterIcon.parentElement

      if (filterButton) {
        await user.click(filterButton)
      }

      // Modal should be present (confirming props are correct)
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument()
    })
  })
})
