import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { ActionButtons } from '../../../pages/wallet'
import { Header } from '../../../pages/wallet/Header'
import { TriggerSection } from '../../../pages/wallet/TriggerSection'
import { WalletInfo } from '../../../pages/wallet/WalletInfo'

describe('ActionButtons Component', () => {
  it('should render buttons without crashing', () => {
    render(
      <MemoryRouter>
        <ActionButtons
          walletUuid="test-wallet-uuid"
          openOperationModal={() => {}}
          openCloseWalletModal={() => {}}
          openOrCloseModalRebalanced={() => {}}
          infosWallet={undefined}
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: 'Rebalanced' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Historic' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Withdrawal / Deposit' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Start Wallet|Close Wallet/ }),
    ).toBeInTheDocument()
  })
})

describe('WalletInfo Component', () => {
  it('should render wallet information correctly', () => {
    const mockData = {
      startDate: '01/01/2023',
      investedAmount: 1000,
      currentAmount: 1500,
      performanceFee: 0.5,
      lastRebalance: '02/01/2023',
      monthCloseDate: '01/02/2023',
    }

    render(<WalletInfo ownerName={''} isClosed={false} {...mockData} />)

    expect(screen.getByText('Start date')).toBeInTheDocument()
    expect(screen.getByText('01/01/2023')).toBeInTheDocument()
    expect(screen.getByText('Invested Amount')).toBeInTheDocument()
    expect(screen.getByText('1000.00')).toBeInTheDocument()
    expect(screen.getByText('Current Amount')).toBeInTheDocument()
    expect(screen.getByText('1500.00')).toBeInTheDocument()
    expect(screen.getByText('Last rebalancing')).toBeInTheDocument()
    expect(screen.getByText('02/01/2023')).toBeInTheDocument()
    expect(screen.getByText('Month closing date')).toBeInTheDocument()
    expect(screen.getByText('01/02/2023')).toBeInTheDocument()
    expect(screen.getByText('Performance fee')).toBeInTheDocument()
    expect(screen.getByText('0.50')).toBeInTheDocument()
  })
})

describe('Header Component', () => {
  it('renders the header title', () => {
    render(<Header walletUuid={undefined} />)
    expect(screen.getByText('Client wallet')).toBeInTheDocument()
  })
})

describe('TriggerSection Component', () => {
  const defaultProps = {
    isOperationModalOpen: false,
    closeOperationModal: jest.fn(),
    isCloseWalletModalOpen: false,
    closeCloseWalletModal: jest.fn(),
    closeModalState: false,
    isModalRebalance: false,
    openOrCloseModalRebalanced: jest.fn(),
    fetchData: jest.fn(),
  }

  it('should render basic elements correctly', () => {
    render(<TriggerSection {...defaultProps} />)

    expect(screen.getByText('My Triggers')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Trigger Action' }),
    ).toBeInTheDocument()
  })
})
