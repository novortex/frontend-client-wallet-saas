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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import filterIcon from '../../../../assets/icons/filter.svg'
import exportIcon from '../../../../assets/icons/export.svg'

import { AddNewWalletModal } from '../../add-new-wallet-modal'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  walletUuid: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  walletUuid,
}: DataTableProps<TData, TValue>) {
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
      <div className="bg-[#171717] rounded-t-lg p-5 flex items-center justify-between">
        <h1 className="text-xl text-white w-1/3">Assets wallet</h1>
        <div className="flex gap-5 w-1/2">
          <Input
            placeholder="Filter asset name..."
            value={(table.getColumn('asset')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('asset')?.setFilterValue(event.target.value)
            }
            className="bg-gray-800 text-gray-400 border-transparent h-11"
          />
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={filterIcon} alt="" /> Filters
          </Button>
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button
            className="bg-[#F2BE38] text-black w-1/2 hover:bg-yellow-600 p-5"
            onClick={openModal}
          >
            + Add new
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-[#131313] hover:bg-[#131313]"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="text-[#959CB6] bg-[#171717] hover:bg-[#171717]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-[#171717]"
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
      />
    </div>
  )
}
