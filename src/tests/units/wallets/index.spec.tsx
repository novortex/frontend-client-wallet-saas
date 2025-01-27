import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { ActionButtons } from '../../../pages/wallet'

// Test for ActionButtons Component
describe('ActionButtons Component', () => {
  it('renders without crashing', () => {
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

    // Assert buttons are rendered
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
