import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddNewAssetModal from '../../../components/custom/assets-org/add-new-asset-modal'
import { columnsAssetOrg } from '../../../components/custom/assets-org/columns'
import { DataTableAssetOrg } from '../../../components/custom/assets-org/data-table'

// Teste para AddNewAssetModal
describe('AddNewAssetModal Component', () => {
  it('renders modal with correct fields', async () => {
    render(<AddNewAssetModal isOpen={true} onClose={() => {}} />)

    await waitFor(() => screen.findByText(/New Asset/i))

    expect(screen.getByText(/New Asset/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('idCMC')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const mockOnClose = jest.fn()
    render(<AddNewAssetModal isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByText('Close')
    closeButton.click()

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1))
  })
})

// Testes para a definição das colunas (columns.tsx)
describe('columnsAssetOrg Definition', () => {
  it('should define all necessary columns', () => {
    expect(columnsAssetOrg).toBeDefined()
    expect(columnsAssetOrg.length).toBeGreaterThan(0)

    const columnTitles = columnsAssetOrg.map((col) => col.header)
    expect(columnTitles).toContain('Asset')
    expect(columnTitles).toContain('Price')
    expect(columnTitles).toContain('Appearances')
  })
})

// Testes para DataTableAssetOrg
const mockData = [
  {
    id: '1',
    asset: { urlImage: '/assets/bitcoin.png', name: 'Bitcoin' },
    price: 40000,
    appearances: '5 Wallets',
    porcentOfApp: '50%',
    quantSLowRisk: '2 Wallets',
    quantLowRisk: '1 Wallet',
    quantStandard: '2 Wallets',
  },
]

describe('DataTableAssetOrg Component', () => {
  it('renders table with asset data', async () => {
    render(<DataTableAssetOrg data={mockData} columns={columnsAssetOrg} />)

    await waitFor(() => screen.findByText(/Bitcoin/i))
    await waitFor(() => screen.findByText(/40000/i))
    await waitFor(() => screen.findByText(/5 Wallets/i))
    await waitFor(() => screen.findByText(/50/i))

    expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument()
    expect(screen.getByText(/40000/i)).toBeInTheDocument()
    expect(screen.getByText(/5 Wallets/i)).toBeInTheDocument()
    expect(screen.getByText(/50/i)).toBeInTheDocument()
  })

  it('displays column headers', async () => {
    render(<DataTableAssetOrg data={mockData} columns={columnsAssetOrg} />)

    await waitFor(() => screen.findByText(/Asset/i))
    await waitFor(() => screen.findByText(/Price/i))
    await waitFor(() => screen.findByText(/Appearances/i))

    expect(screen.getByText(/Asset/i)).toBeInTheDocument()
    expect(screen.getByText(/Price/i)).toBeInTheDocument()
    expect(screen.getByText(/Appearances/i)).toBeInTheDocument()
  })
})
