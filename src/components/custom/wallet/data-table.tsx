import { useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AddNewWalletModal } from '../add-new-wallet-modal'
import { RebalanceModal } from '../rebalanceModal'
import { useAssetPricesSocket } from '@/hooks/useSocketPrice'

export type ClientActive = {
  id: string
  asset: {
    urlImage: string
    name: string
  }
  currentAmount: number
  assetQuantity: number
  price: number
  allocation: number
  idealAllocation: number
  idealAmount: number
  buyOrSell: number
  averagePrice: number
  profitLossPercentage: number | null
}

interface DataTableProps<TValue> {
  columns: ColumnDef<ClientActive, TValue>[]
  data: ClientActive[]
  walletUuid: string
  fetchData: () => Promise<void>
  calculateRebalance: (rebalanceData: {
    minAmount: number
    minPercentage: number
  }) => Promise<unknown[]>
}

export function DataTable<TValue>({
  columns,
  data,
  walletUuid,
  fetchData,
}: DataTableProps<TValue>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'investedAmount', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const assetIds = useMemo(() => {
    return data.map((item) => item.id)
  }, [data])

  const { assetPrices } = useAssetPricesSocket(assetIds)

  const dataWithUpdatedPrices = useMemo(() => {
    return data.map((item) => {
      const assetId = item.id

      if (assetPrices[assetId] !== undefined) {
        return {
          ...item,
          price: assetPrices[assetId],
        }
      }

      return item
    })
  }, [data, assetPrices])

  const table = useReactTable({
    data: dataWithUpdatedPrices,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="rounded-md">
      <div className="flex w-full items-center justify-between rounded-t-lg border bg-lightComponent p-5 dark:bg-[#171717]">
        <h1 className="w-1/3 text-xl dark:text-white">Assets wallet</h1>
        <div className="flex w-fit gap-5">
          <RebalanceModal walletUuid={walletUuid} />
          <Button
            className="flex items-center gap-2 bg-[#F2BE38] px-4 font-medium text-black transition-all duration-200 transform hover:scale-105 hover:bg-yellow-500 hover:text-white"
            onClick={openModal}
          >
            + Add New Asset
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border bg-gray-200 dark:bg-[#131313] dark:hover:bg-[#131313]"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-black dark:text-white"
                >
                  {!header.isPlaceholder &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="border bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6] dark:hover:bg-[#171717]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-gray-200 dark:hover:bg-[#131313]"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddNewWalletModal
        isOpen={isModalOpen}
        onClose={closeModal}
        walletUuid={walletUuid}
        fetchData={fetchData}
      />
    </div>
  )
}
