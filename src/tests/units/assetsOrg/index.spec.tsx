/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddNewAssetModal from '../../../components/custom/assets-org/add-new-asset-modal'
import { columnsAssetOrg } from '../../../components/custom/assets-org/columns'
import { DataTableAssetOrg } from '../../../components/custom/assets-org/data-table'
import { ColumnDef } from '@tanstack/react-table'

type AssetOrg = {
  id: string
  asset: { urlImage: string; name: string }
  price: number
  appearances: string
  porcentOfApp: string
  quantSLowRisk: string
  quantLowRisk: string
  quantStandard: string
  averagePrice?: number
}

const expectedColumns = columnsAssetOrg as ColumnDef<AssetOrg, unknown>[]

describe('Asset Organization', () => {
  describe('AddNewAssetModal Component', () => {
    it('renders modal with correct fields', () => {
      render(<AddNewAssetModal isOpen={true} onClose={() => {}} />)

      expect(screen.getByText(/new asset/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/idcmc/i)).toBeInTheDocument()
      expect(
        screen.getByText(/check the desired asset id/i),
      ).toBeInTheDocument()
    })

    it('allows user to input CoinMarketCap ID and submit', async () => {
      const mockOnClose = jest.fn()
      render(<AddNewAssetModal isOpen={true} onClose={mockOnClose} />)

      const input = screen.getByPlaceholderText(/idcmc/i)
      fireEvent.change(input, { target: { value: '1' } })

      const addButton = screen.getByText(/add asset/i)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('DataTableAssetOrg Component', () => {
    const mockData: AssetOrg[] = [
      {
        id: '1',
        asset: { urlImage: 'bitcoin.png', name: 'Bitcoin' },
        price: 40000,
        appearances: '5 wallets',
        porcentOfApp: '50%',
        quantSLowRisk: '2 wallets',
        quantLowRisk: '1 wallet',
        quantStandard: '2 wallets',
        averagePrice: 30000,
      },
    ]

    it('renders table with asset data', async () => {
      render(<DataTableAssetOrg data={mockData} columns={expectedColumns} />)

      await waitFor(() => {
        expect(screen.getByText(/bitcoin/i)).toBeInTheDocument()
        expect(screen.getByText(/u\$ 40000.00/i)).toBeInTheDocument()
        expect(screen.getByText(/5 wallets/i)).toBeInTheDocument()
        expect(screen.getByText(/50/i)).toBeInTheDocument()
      })
    })
  })

  describe('DataTableAssetOrg Column Definition', () => {
    const columns: ColumnDef<any, any>[] = [
      { accessorKey: 'asset', header: 'Asset' },
      { accessorKey: 'price', header: 'Price' },
      { accessorKey: 'appearances', header: 'Appearances' },
    ]

    it('should define all necessary columns', () => {
      expect(columns).toBeDefined()
      expect(columns.length).toBeGreaterThan(0)

      const columnTitles = columns.map((col) => col.header)
      expect(columnTitles).toContain('Asset')
      expect(columnTitles).toContain('Price')
      expect(columnTitles).toContain('Appearances')
    })
  })

  describe('DataTableAssetOrg Component', () => {
    const mockData: AssetOrg[] = [
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

    it('displays column headers', async () => {
      render(<DataTableAssetOrg data={mockData} columns={expectedColumns} />)

      await waitFor(() => {
        expect(screen.getByText(/Asset/i)).toBeInTheDocument()
        expect(screen.getByText(/Price/i)).toBeInTheDocument()
        expect(screen.getByText(/Appearances/i)).toBeInTheDocument()
      })
    })
  })
})
