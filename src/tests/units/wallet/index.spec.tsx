import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useWallet } from '@/hooks/useWallet'
import { useWalletModals } from '@/hooks/useWalletModals'
import { Wallet } from '@/pages/wallet'
import { data, columns, walletUuid } from '../../mocks/walletDataTable.mock'
import { DataTable } from '@/components/custom/tables/wallet-client/data-table'

jest.mock('@/hooks/useWallet')
jest.mock('@/hooks/useWalletModals')

const mockUseWallet = useWallet as jest.Mock
const mockUseWalletModals = useWalletModals as jest.Mock
const pagePath = '/wallet/4091e88c-bfa5-4608-8514-212502fb2598/assets'

describe('Wallet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Given that the wallet is loading, When the component renders, Then it should display the loading indicator', () => {
    // Arrange
    mockUseWallet.mockReturnValue({
      data: [],
      infosWallet: null,
      loading: true,
    })

    mockUseWalletModals.mockReturnValue({
      isOperationModalOpen: false,
      openOperationModal: jest.fn(),
      closeOperationModal: jest.fn(),
      isCloseWalletModalOpen: false,
      openCloseWalletModal: jest.fn(),
      closeCloseWalletModal: jest.fn(),
      isModalRebalance: false,
      openOrCloseModalRebalanced: jest.fn(),
    })

    // Act
    render(
      <MemoryRouter initialEntries={[pagePath]}>
        <Wallet />
      </MemoryRouter>,
    )

    // Assert
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toBeInTheDocument()
  })

  test('Given that the user types a filter in the search input, When the filter is applied, Then the table should display only the filtered results', () => {
    // Arrange
    mockUseWallet.mockReturnValue({
      data, // Mock data para o teste
      infosWallet: null,
      loading: false,
    })

    mockUseWalletModals.mockReturnValue({
      isOperationModalOpen: false,
      openOperationModal: jest.fn(),
      closeOperationModal: jest.fn(),
      isCloseWalletModalOpen: false,
      openCloseWalletModal: jest.fn(),
      closeCloseWalletModal: jest.fn(),
      isModalRebalance: false,
      openOrCloseModalRebalanced: jest.fn(),
    })

    // Act
    render(
      <MemoryRouter initialEntries={[pagePath]}>
        <DataTable columns={columns} data={data} walletUuid={walletUuid} />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('Filter asset name...')
    fireEvent.change(input, { target: { value: 'Bitcoin' } })

    // Assert
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument()
    expect(screen.queryByText('Litecoin')).not.toBeInTheDocument()
  })

  test('Given that the user clears the search input, When the table is rendered, Then all results should be displayed', () => {
    // Arrange
    mockUseWallet.mockReturnValue({
      data, // Mock data para o teste
      infosWallet: null,
      loading: false,
    })

    mockUseWalletModals.mockReturnValue({
      isOperationModalOpen: false,
      openOperationModal: jest.fn(),
      closeOperationModal: jest.fn(),
      isCloseWalletModalOpen: false,
      openCloseWalletModal: jest.fn(),
      closeCloseWalletModal: jest.fn(),
      isModalRebalance: false,
      openOrCloseModalRebalanced: jest.fn(),
    })

    // Act
    render(
      <MemoryRouter initialEntries={[pagePath]}>
        <DataTable columns={columns} data={data} walletUuid={walletUuid} />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('Filter asset name...')
    fireEvent.change(input, { target: { value: 'Bitcoin' } })
    fireEvent.change(input, { target: { value: '' } })

    // Assert
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    expect(screen.getByText('Litecoin')).toBeInTheDocument()
  })
})
