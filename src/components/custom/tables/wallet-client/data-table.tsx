import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { HandCoins } from 'lucide-react'
import { Button } from '@/components/ui/button'

import filterIcon from '../../../../assets/icons/filter.svg'
import exportIcon from '../../../../assets/icons/export.svg'

import AddNewWalletModal from '../../add-new-wallet-modal'
import OperationsModal from './operations'

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
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openOperationModal = () => {
    setIsOperationModalOpen(true)
  }

  const closeOperationModal = () => {
    setIsOperationModalOpen(false)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md">
      <div className="bg-[#171717] rounded-t-lg p-5 flex items-center justify-between">
        <h1 className="text-xl text-white">Table</h1>
        <div className="flex gap-5">
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={filterIcon} alt="" /> Filters
          </Button>
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 w-1/3 p-5">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button
            className="bg-[#1877F2] w-1/2 hover:bg-blue-600 p-5 gap-2"
            onClick={openOperationModal}
          >
            <HandCoins />
            Withdrawal / Deposit
          </Button>
          <Button
            className="bg-[#1877F2] w-1/2 hover:bg-blue-600 p-5"
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
      <OperationsModal
        isOpen={isOperationModalOpen}
        onClose={closeOperationModal}
      />
    </div>
  )
}
