import { useState } from 'react'
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import filterIcon from '@/assets/icons/filter.svg'
import exportIcon from '@/assets/icons/export.svg'
import { AddNewWalletModal } from '../add-new-wallet-modal'
import { RebalanceModal } from '../rebalanceModal'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  walletUuid: string
  fetchData: () => Promise<void>
  calculateRebalance: (rebalanceData: { minAmount: number; minPercentage: number }) => Promise<unknown[]>
}

export function DataTable<TData, TValue>({ columns, data, walletUuid, fetchData }: DataTableProps<TData, TValue>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'investedAmount', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const table = useReactTable({
    data,
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
      <div className="bg-lightComponent border dark:bg-[#171717] rounded-t-lg p-5 flex items-center justify-between w-full">
        <h1 className="text-xl dark:text-white w-1/3">Assets wallet</h1>
        <div className="flex gap-5 w-fit">
          <Input
            placeholder="Filter asset name..."
            value={(table.getColumn('asset')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('asset')?.setFilterValue(event.target.value)}
            className="bg-gray-300 border dark:bg-gray-800 dark:text-gray-400 border-transparent h-11"
          />

          <RebalanceModal walletUuid={walletUuid} />
          <Button className="bg-gray-200 dark:bg-white text-black border flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={filterIcon} alt="" /> Filters
          </Button>
          <Button className="bg-gray-200 dark:bg-white text-black flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button className="bg-[#F2BE38] text-black w-1/2 hover:text-white hover:bg-yellow-600 p-5" onClick={openModal}>
            + Add New
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border bg-gray-200 dark:bg-[#131313] dark:hover:bg-[#131313]">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-black dark:text-white">
                  {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-lightComponent border dark:text-[#959CB6] dark:bg-[#171717] dark:hover:bg-[#171717]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="hover:bg-gray-200 dark:hover:bg-[#131313]" key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <AddNewWalletModal isOpen={isModalOpen} onClose={closeModal} walletUuid={walletUuid} fetchData={fetchData} />
    </div>
  )
}
