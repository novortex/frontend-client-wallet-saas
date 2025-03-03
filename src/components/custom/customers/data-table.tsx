import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import exportIcon from '@/assets/icons/export.svg'
import { useState } from 'react'
import RegisterCustomerModal from '@/pages/customers/register-customer-modal'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTableCustomers<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="rounded-md border">
      <div className="bg-lightComponent dark:bg-[#171717] rounded-t-lg p-5 flex items-center justify-between">
        <h1 className="text-xl dark:text-white">Customers organization</h1>
        <div className="flex gap-5 items-center">
          <div className="flex items-center py-4 w-[200%]">
            <Input
              placeholder="Search for a customer name..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
              className="bg-gray-200 dark:bg-[#000] text-gray-400 border-transparent h-11 w-[100%]"
            />
          </div>
          <Button className="bg-gray-200 dark:bg-white text-black flex gap-2 hover:bg-gray-400 dark:hover:bg-gray-400 w-1/3 p-5">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button onClick={openModal} className="bg-[#F2BE38] w-1/2 text-black hover:text-white hover:bg-yellow-600">
            + Add new
          </Button>
          <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-5 flex items-center justify-end space-x-2 py-4">
            <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="hover:bg-gray-400 bg-gray-200 dark:bg-white text-black">
              Previous
            </Button>
            <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600">
              Next
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-black dark:text-white">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-lightComponent dark:text-[#959CB6] dark:bg-[#171717]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="hover:bg-gray-200 dark:hover:bg-[#171717] dark:hover:bg-[#101010]" key={row.id} data-state={row.getIsSelected() && 'selected'}>
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

      <RegisterCustomerModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
