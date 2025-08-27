import { useState, useEffect } from 'react'
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
import { formatDate } from '@/utils/formatDate'

// Interface simplificada para a referência da tabela
export interface WalletClosingsTableRef {
  nextPage: () => void
  previousPage: () => void
}

interface WalletClosingsTableProps {
  data: WalletClosing[]
  onSearch: (value: string) => void
  tableRef: React.RefObject<WalletClosingsTableRef>
  currentPage: number
  pageSize: number
  onPaginationChange: (pageIndex: number, pageCount: number) => void
}

export function WalletClosingsTable({
  data,
  tableRef,
  currentPage,
  pageSize,
  onPaginationChange,
}: WalletClosingsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Define columns for the table
  const columns: ColumnDef<WalletClosing>[] = [
    {
      accessorKey: 'clientName',
      header: () => <div className="w-fit pl-4 text-left">Client</div>,
      cell: ({ row }) => (
        <div className="w-fit whitespace-nowrap pl-4 text-left font-medium text-foreground">
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
    // For the startDate column
    {
      accessorKey: 'startDate',
      header: () => <div className="text-center">Start Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-center">
          {row.original.startDate !== null
            ? formatDate(row.original.startDate)
            : '-'}
        </div>
      ),
    },

    // For the closingDate column
    {
      accessorKey: 'closingDate',
      header: () => <div className="text-center">Closing Date</div>,
      cell: ({ row }) => (
        <div className="whitespace-nowrap text-center">
          {row.original.closingDate !== null
            ? formatDate(row.original.closingDate)
            : '-'}
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
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    manualPagination: false,
    pageCount: Math.ceil(data.length / pageSize),
  })

  // Atualizar a página no TanStack Table quando currentPage mudar
  useEffect(() => {
    table.setPageIndex(currentPage)
  }, [currentPage, table])

  // Notificar o componente pai sobre mudanças de paginação na tabela
  useEffect(() => {
    onPaginationChange(
      table.getState().pagination.pageIndex,
      table.getPageCount(),
    )
  }, [table, onPaginationChange])

  // Atribuir métodos de navegação à ref
  useEffect(() => {
    if (tableRef && tableRef.current) {
      tableRef.current.nextPage = () => table.nextPage()
      tableRef.current.previousPage = () => table.previousPage()
    }
  }, [table, tableRef])

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]"
          >
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-black dark:text-white">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="bg-lightComponent dark:bg-[#171717] dark:text-[#959CB6]">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="hover:bg-gray-200 dark:hover:bg-[#101010]"
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
  )
}
