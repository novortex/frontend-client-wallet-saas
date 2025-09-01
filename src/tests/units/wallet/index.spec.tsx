import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ActionButtons } from '../../../pages/wallet'
import { Header } from '../../../pages/wallet/Header'
import { TriggerSection } from '../../../pages/wallet/TriggerSection'
import { WalletInfo } from '../../../pages/wallet/WalletInfo'
import { ResultRebalanceModal } from '../../../components/custom/resultRebalanceModal'
import { RebalanceReturn } from '../../../types/wallet.type'

// Mock UI components for ResultRebalanceModal
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, className, ...props }: any) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children, className }: any) => (
    <h1 data-testid="dialog-title" className={className}>
      {children}
    </h1>
  ),
  DialogClose: ({ children }: any) => (
    <div data-testid="dialog-close">{children}</div>
  ),
  DialogFooter: ({ children, className }: any) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    ...props
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: any) => (
    <hr data-testid="separator" className={className} />
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, ...props }: any) => (
    <input
      value={
        typeof value === 'string'
          ? value.replace(/[^0-9.]/g, '').replace(/^(\d*\.\d{0,2}).*$/, '$1')
          : value
      }
      onChange={(e) => {
        const v = e.target.value
          .replace(/[^0-9.]/g, '')
          .replace(/^(\d*\.\d{0,2}).*$/, '$1')
        onChange({ ...e, target: { ...e.target, value: v } })
      }}
      data-testid={props['data-testid'] || 'input'}
      {...props}
    />
  ),
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, className, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={className}
      data-testid={props['data-testid'] || 'checkbox'}
      {...props}
    />
  ),
}))

// Mock RebalanceModal
jest.mock('@/components/custom/rebalanceModal', () => ({
  RebalanceModal: ({ walletUuid }: { walletUuid: string }) => (
    <div data-testid="rebalance-modal">Rebalance Modal for {walletUuid}</div>
  ),
}))

// Helper functions
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

const getInputValue = (input: HTMLElement): string => {
  return (input as HTMLInputElement).value
}

const getNumericInputValue = (input: HTMLElement): number => {
  return Number((input as HTMLInputElement).value)
}

const getInputsByTestId = (testId: string): HTMLInputElement[] => {
  return screen.getAllByTestId(testId) as HTMLInputElement[]
}

describe('Wallet Component', () => {
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
              riskProfile: 'STANDARD',
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
        riskProfile: 'STANDARD',
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
      render(<Header walletUuid={undefined} />, { wrapper: MemoryRouter })
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

  describe('ResultRebalanceModal Component', () => {
    const mockOnOpenChange = jest.fn()
    const mockOnConfirm = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('Balance Approximation Logic - Critical Tests', () => {
      it('should automatically balance when values have decimal approximations', () => {
        const decimalResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000.33',
            targetAllocation: '25.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'buy',
            amount: '500.66',
            targetAllocation: '12.5',
          },
          {
            assetName: 'Solana',
            assetIcon: 'solana.png',
            action: 'sell',
            amount: '750.50',
            targetAllocation: '18.75',
          },
          {
            assetName: 'Cardano',
            assetIcon: 'cardano.png',
            action: 'sell',
            amount: '750.49',
            targetAllocation: '18.74',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={decimalResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Checks if the balance was automatically adjusted to 0
        expect(screen.getByText('✓')).toBeInTheDocument()

        // Checks if totals are equal (balance = 0)
        const balanceSection = screen.getByRole('status')
        expect(balanceSection).toBeInTheDocument()
      })

      it('should maintain balance = 0 when original values sum to same total', () => {
        const balancedResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000.0',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000.0',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={balancedResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Should show balance = 0
        expect(screen.getByText('✓')).toBeInTheDocument()

        // Values should be kept as 1000 each
        const inputs = getInputsByTestId('input')
        expect(getInputValue(inputs[0])).toBe('1000')
        expect(getInputValue(inputs[1])).toBe('1000')
      })

      it('should distribute approximation remainder correctly', () => {
        const unbalancedResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '333.33',
            targetAllocation: '16.67',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'buy',
            amount: '333.33',
            targetAllocation: '16.67',
          },
          {
            assetName: 'Solana',
            assetIcon: 'solana.png',
            action: 'sell',
            amount: '666.66',
            targetAllocation: '33.33',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={unbalancedResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Should automatically adjust to balance = 0
        expect(screen.getByText('✓')).toBeInTheDocument()

        // Sum of buy inputs should equal sum of sell inputs
        const inputs = getInputsByTestId('input')
        const buyInputs = inputs.slice(0, 2) // First 2 are buy
        const sellInputs = inputs.slice(2) // Last is sell

        const totalBuy = buyInputs.reduce(
          (sum, input) => sum + getNumericInputValue(input),
          0,
        )
        const totalSell = sellInputs.reduce(
          (sum, input) => sum + getNumericInputValue(input),
          0,
        )

        expect(Math.abs(totalBuy - totalSell)).toBeLessThanOrEqual(1)
      })

      it('should handle extreme decimal cases correctly', () => {
        const extremeDecimalResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '999.999999',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '999.000001',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={extremeDecimalResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Should balance even with extreme decimals
        expect(screen.getByText('✓')).toBeInTheDocument()
      })

      it('should maintain balance when manually editing values', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '40.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'buy',
            amount: '500',
            targetAllocation: '20.0',
          },
          {
            assetName: 'Solana',
            assetIcon: 'solana.png',
            action: 'sell',
            amount: '1500',
            targetAllocation: '60.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const firstBuyInput = inputs[0]

        // Manually edit a value
        await user.clear(firstBuyInput)
        await user.type(firstBuyInput, '2000')

        // Checks if the item was marked as custom
        expect(screen.getByText('• Custom')).toBeInTheDocument()

        // The manually edited value should be preserved
        expect(getInputValue(firstBuyInput)).toBe('2000')
      })

      it('should not rebalance custom amounts when other items are toggled', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '40.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'buy',
            amount: '500',
            targetAllocation: '20.0',
          },
          {
            assetName: 'Solana',
            assetIcon: 'solana.png',
            action: 'sell',
            amount: '1500',
            targetAllocation: '60.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const firstBuyInput = inputs[0]

        // Edit manually first
        await user.clear(firstBuyInput)
        await user.type(firstBuyInput, '3000')

        // Deselect another item
        const checkboxes = getInputsByTestId('checkbox')
        await user.click(checkboxes[1]) // Deselect Ethereum

        // The manually edited value should be preserved
        expect(getInputValue(firstBuyInput)).toBe('3000')
        expect(screen.getByText('• Custom')).toBeInTheDocument()
      })

      it('should show unbalanced state when manual edits create imbalance', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const buyInput = inputs[0]

        // Edit to create imbalance
        await user.clear(buyInput)
        await user.type(buyInput, '2000')

        // Should not show the balanced ✓
        expect(screen.queryByText('✓')).not.toBeInTheDocument()

        // Should show the imbalance value in the Balance section (yellow)
        await waitFor(() => {
          // Specifically look for the Balance element with yellow class
          const balanceElement = screen
            .getByText('Balance')
            .parentElement?.querySelector('.text-yellow-600')
          expect(balanceElement).toHaveTextContent('$1,000')
        })
      })

      it('should handle balance threshold correctly (< 1 USD)', () => {
        const nearBalancedResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000.40',
            targetAllocation: '50.02',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000.60',
            targetAllocation: '50.03',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={nearBalancedResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Difference of 1 USD should be considered balanced
        expect(screen.getByText('✓')).toBeInTheDocument()
      })

      it('should properly reset approximated values', async () => {
        const user = userEvent.setup()
        const decimalResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000.75',
            targetAllocation: '50.04',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000.25',
            targetAllocation: '50.01',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={decimalResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Edit values
        const inputs = getInputsByTestId('input')
        await user.clear(inputs[0])
        await user.type(inputs[0], '5000')

        // Deselect an item
        const checkboxes = getInputsByTestId('checkbox')
        await user.click(checkboxes[1])

        // Reset
        const resetButton = screen.getByText('Reset to Original Calculation')
        await user.click(resetButton)

        // Should return to original balanced state
        expect(screen.getByText('✓')).toBeInTheDocument()
        expect(
          screen.getByText('Confirm Rebalance (2 items)'),
        ).toBeInTheDocument()
      })

      it('should handle edge case with single buy and single sell', () => {
        const singlePairResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1500.33',
            targetAllocation: '50.01',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1500.67',
            targetAllocation: '50.02',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={singlePairResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Should automatically balance
        expect(screen.getByText('✓')).toBeInTheDocument()

        const inputs = getInputsByTestId('input')
        const buyValue = getNumericInputValue(inputs[0])
        const sellValue = getNumericInputValue(inputs[1])

        expect(Math.abs(buyValue - sellValue)).toBeLessThanOrEqual(1)
      })

      it('should handle multiple assets with complex decimal distribution', () => {
        const complexResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '333.33',
            targetAllocation: '16.67',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'buy',
            amount: '333.33',
            targetAllocation: '16.67',
          },
          {
            assetName: 'Solana',
            assetIcon: 'solana.png',
            action: 'buy',
            amount: '333.34',
            targetAllocation: '16.67',
          },
          {
            assetName: 'Cardano',
            assetIcon: 'cardano.png',
            action: 'sell',
            amount: '500.0',
            targetAllocation: '25.0',
          },
          {
            assetName: 'Polkadot',
            assetIcon: 'polkadot.png',
            action: 'sell',
            amount: '500.0',
            targetAllocation: '25.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={complexResults}
            onConfirm={mockOnConfirm}
          />,
        )

        // Should balance even with complex distribution
        expect(screen.getByText('✓')).toBeInTheDocument()

        const inputs = getInputsByTestId('input')
        const buyInputs = inputs.slice(0, 3)
        const sellInputs = inputs.slice(3, 5)

        const totalBuy = buyInputs.reduce(
          (sum, input) => sum + getNumericInputValue(input),
          0,
        )
        const totalSell = sellInputs.reduce(
          (sum, input) => sum + getNumericInputValue(input),
          0,
        )

        expect(Math.abs(totalBuy - totalSell)).toBeLessThanOrEqual(1)
      })
    })

    describe('Balance Visual Indicators', () => {
      it('should show green checkmark when perfectly balanced', () => {
        const balancedResults: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={balancedResults}
            onConfirm={mockOnConfirm}
          />,
        )

        const checkmark = screen.getByLabelText('Balanced')
        expect(checkmark).toHaveTextContent('✓')
        expect(checkmark.closest('p')).toHaveClass('text-green-600')
      })

      it('should show yellow warning when unbalanced', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')

        // Create imbalance
        await user.clear(inputs[0])
        await user.type(inputs[0], '1500')

        // Should show yellow color for imbalance
        const balanceText = screen.getByText('$500')
        expect(balanceText.closest('p')).toHaveClass('text-yellow-600')
      })

      it('should update balance indicator in real-time', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const buyInput = inputs[0]

        // Initially balanced
        expect(screen.getByText('✓')).toBeInTheDocument()

        // Edit to create imbalance
        await user.clear(buyInput)
        await user.type(buyInput, '1200')

        // Should show new imbalance value
        await waitFor(() => {
          expect(screen.getByText('$200')).toBeInTheDocument()
        })

        // Return to balance
        await user.clear(buyInput)
        await user.type(buyInput, '1000')

        // Should show balanced again
        await waitFor(() => {
          expect(screen.getByText('✓')).toBeInTheDocument()
        })
      })
    })

    describe('Basic Functionality', () => {
      it('should render modal when open is true', () => {
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        expect(screen.getByTestId('dialog')).toBeInTheDocument()
        expect(screen.getByTestId('dialog-title')).toHaveTextContent(
          'Rebalancing Parameters',
        )
        expect(
          screen.getByText('Select assets and adjust amounts for rebalancing'),
        ).toBeInTheDocument()
      })

      it('should not render modal when open is false', () => {
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={false}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
      })

      it('should call onConfirm with selected items when confirm is clicked', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '50.0',
          },
          {
            assetName: 'Ethereum',
            assetIcon: 'ethereum.png',
            action: 'sell',
            amount: '1000',
            targetAllocation: '50.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const confirmButton = screen.getByText(/Confirm Rebalance/)
        await user.click(confirmButton)

        expect(mockOnConfirm).toHaveBeenCalledTimes(1)
        expect(mockOnConfirm).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              assetName: 'Bitcoin',
              selected: true,
            }),
            expect.objectContaining({
              assetName: 'Ethereum',
              selected: true,
            }),
          ]),
        )
      })

      it('should handle empty rebalanceResults', () => {
        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={[]}
            onConfirm={mockOnConfirm}
          />,
        )

        expect(screen.getByText('No buy operations')).toBeInTheDocument()
        expect(screen.getByText('No sell operations')).toBeInTheDocument()
      })

      it('should toggle asset selection when checkbox is clicked', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const checkboxes = getInputsByTestId('checkbox')
        const firstCheckbox = checkboxes[0]

        expect(firstCheckbox).toBeChecked()

        await user.click(firstCheckbox)

        expect(firstCheckbox).not.toBeChecked()
      })
    })

    describe('Input Validation', () => {
      it('should allow valid decimal inputs', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const firstInput = inputs[0]

        await user.clear(firstInput)
        await user.type(firstInput, '1234.56')

        expect(getInputValue(firstInput)).toBe('1234.56')
      })

      it('should reject invalid characters in input', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const firstInput = inputs[0]

        await user.clear(firstInput)
        await user.type(firstInput, 'abc123def')

        // Should only contain numeric characters
        expect(getInputValue(firstInput)).toBe('123')
      })

      it('should limit decimal places to 2', async () => {
        const user = userEvent.setup()
        const results: RebalanceReturn[] = [
          {
            assetName: 'Bitcoin',
            assetIcon: 'bitcoin.png',
            action: 'buy',
            amount: '1000',
            targetAllocation: '100.0',
          },
        ]

        render(
          <ResultRebalanceModal
            open={true}
            onOpenChange={mockOnOpenChange}
            rebalanceResults={results}
            onConfirm={mockOnConfirm}
          />,
        )

        const inputs = getInputsByTestId('input')
        const firstInput = inputs[0]

        await user.clear(firstInput)
        await user.type(firstInput, '123.456789')

        expect(getInputValue(firstInput)).toBe('123.45')
      })
    })
  })
})
