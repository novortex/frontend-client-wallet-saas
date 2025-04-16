// components/WalletClosingsTable.tsx
import { useState } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { WalletClosing } from '../types'
import { StatusBadge } from './statusBadge'
import { CellActions } from './cellActions'
import { formatDate } from '../utils/formatters'

// Define a proper type for the table reference
export interface WalletClosingsTableRef {
  getState: () => { pagination: { pageIndex: number; pageSize: number } }
  getPageCount: () => number
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  previousPage: () => void
  nextPage: () => void
}

interface WalletClosingsTableProps {
  data: WalletClosing[]
  onSearch: (value: string) => void
  tableRef: React.RefObject<WalletClosingsTableRef>
}

export function WalletClosingsTable({
  data,
  tableRef,
}: WalletClosingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Define columns for the table
  const columns: ColumnDef<WalletClosing>[] = [
    {
      accessorKey: 'clientName',
      header: () => <div className="w-fit pl-4 text-left">Client</div>,
      cell: ({ row }) => (
        <div className="w-fit whitespace-nowrap pl-4 text-left">
          {row.original.clientName}
        </div>
      ),
    },
    {
      accessorKey: 'managerName',
      header: () => <div className="w-fit pl-4 text-left">Manager</div>,
      cell: ({ row }) => (
        <div className="w-fit whitespace-nowrap pl-4 text-left">
          {row.original.managerName}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: () => <div className="text-center">Start Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-center">
          {formatDate(row.original.startDate)}
        </div>
      ),
    },
    {
      accessorKey: 'closingDate',
      header: () => <div className="text-center">Closing Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-center">
          {formatDate(row.original.closingDate)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="w-full"
        >
          <div className="flex w-full items-center justify-center text-center">
            Status <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <StatusBadge status={row.original.status} />
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <CellActions rowData={row.original} />
        </div>
      ),
    },
  ]

  // Configure table
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
    // Configuração de paginação
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10, // 10 itens por página
      },
    },
  })

  // Store the table methods in the ref
  if (tableRef && tableRef.current) {
    Object.assign(tableRef.current, {
      getState: () => table.getState(),
      getPageCount: () => table.getPageCount(),
      getCanPreviousPage: () => table.getCanPreviousPage(),
      getCanNextPage: () => table.getCanNextPage(),
      previousPage: () => table.previousPage(),
      nextPage: () => table.nextPage(),
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-black dark:text-white"
                  >
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
        <TableBody className="bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6]">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-gray-200 dark:hover:bg-[#101010] dark:hover:bg-[#171717]"
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
    </>
  )
}

// Export the pagination data type for reuse
export type PaginationData = {
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
  totalItems: number
  pageSize: number
}
