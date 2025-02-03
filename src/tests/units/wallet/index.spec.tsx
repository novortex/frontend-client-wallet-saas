import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { ActionButtons } from '../../../pages/wallet'
import { Header } from '../../../pages/wallet/Header'
import { TriggerSection } from '../../../pages/wallet/TriggerSection'
import { WalletInfo } from '../../../pages/wallet/WalletInfo'

const getByTextCaseInsensitive = (text: string) => {
  return screen.getByText((_content, element) => {
    const hasText = (element: Element | null) =>
      element?.textContent?.toLowerCase() === text.toLowerCase()
    const elementHasText = hasText(element)
    const childrenDontHaveText = Array.from(element?.children || []).every(
      (child) => !hasText(child),
    )
    return elementHasText && childrenDontHaveText
  })
}

describe('ActionButtons Component', () => {
  it('should render buttons without crashing', () => {
    render(
      <MemoryRouter>
        <ActionButtons
          walletUuid="test-wallet-uuid"
          openOperationModal={() => {}}
          openCloseWalletModal={() => {}}
          openOrCloseModalRebalanced={() => {}}
          infosWallet={{
            ownerName: 'test-owner-name',
            startDate: '01/01/2023',
            investedAmount: 1000,
            currentAmount: 1500,
            performanceFee: 0.5,
            lastRebalance: '02/01/2023',
            monthCloseDate: '01/02/2023',
            isClosed: false,
          }}
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: /rebalanced/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /historic/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /withdrawal \/ deposit/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start wallet|close wallet/i }),
    ).toBeInTheDocument()
    expect(getByTextCaseInsensitive('test-owner-name')).toBeInTheDocument()
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

    expect(getByTextCaseInsensitive('start date')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('01/01/2023')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('invested amount')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('1000.00')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('current amount')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('1500.00')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('last rebalancing')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('02/01/2023')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('month closing date')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('01/02/2023')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('performance fee')).toBeInTheDocument()
    expect(getByTextCaseInsensitive('0.50')).toBeInTheDocument()
  })
})

describe('Header Component', () => {
  it('renders the header title', () => {
    render(<Header walletUuid={undefined} />)
    expect(getByTextCaseInsensitive('client wallet')).toBeInTheDocument()
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

    expect(getByTextCaseInsensitive('my triggers')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /trigger action/i }),
    ).toBeInTheDocument()
  })
})
