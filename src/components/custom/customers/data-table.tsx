import { useState } from 'react'
import { Button } from '@/components/ui/button'
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

import { FileText } from 'lucide-react'

import { Input } from '@/components/ui/input'

import exportIcon from '@/assets/icons/export.svg'
import RegisterCustomerModal from '@/pages/customers/register-customer-modal'
import { SendContractIdModal } from '@/pages/customers/send-contract-modal'
import { sendContractId } from '@/services/managementService'
import { useToast } from '@/components/ui/use-toast'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTableCustomers<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSendIdModalOpen, setIsSendIdModalOpen] = useState(false)
  const { toast } = useToast()

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

  const openSendIdModal = () => {
    setIsSendIdModalOpen(true)
  }

  const closeSendIdModal = () => {
    setIsSendIdModalOpen(false)
  }

  const handleSendContractId = async (contractId: string) => {
    try {
      const response = await sendContractId({
        uuid_documento_gerado: contractId,
      })
      if (response) {
        toast({
          title: 'Success!',
          description: 'Contract ID sent successfully!',
          className: 'bg-green-500 text-white',
        })
        setIsSendIdModalOpen(false)
      }
    } catch (error) {
      console.error('Error sending contract ID:', error)
      toast({
        title: 'Error',
        description: 'Failed to send Contract ID.',
        className: 'bg-red-500 text-white',
      })
    }
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
        <h1 className="text-xl dark:text-white">Customers organization</h1>
        <div className="flex items-center gap-5">
          <div className="flex w-[200%] items-center py-4">
            <Input
              placeholder="Search for a customer name..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="h-11 w-[100%] border-transparent bg-gray-200 text-gray-400 dark:bg-[#000]"
            />
          </div>
          <Button className="flex w-1/3 gap-2 bg-gray-200 p-5 text-black hover:bg-gray-400 dark:bg-white dark:hover:bg-gray-400">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button
            onClick={openModal}
            className="w-1/2 bg-[#FF4A3A] text-black hover:bg-red-500 hover:text-white"
          >
            + Add new
          </Button>
          <Button
            onClick={openSendIdModal}
            className="w-1/2 bg-[#FF4A3A] text-black hover:bg-red-500 hover:text-white"
          >
            <FileText /> Send ID
          </Button>
          <div className="flex items-center justify-end space-x-2 border-l-2 border-gray-300 py-4 pl-5 dark:border-gray-600">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-gray-200 text-black hover:bg-gray-400 dark:bg-white"
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-[#FF4A3A] text-black hover:bg-red-500 hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
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

      <RegisterCustomerModal isOpen={isModalOpen} onClose={closeModal} />
      <SendContractIdModal
        isOpen={isSendIdModalOpen}
        onClose={closeSendIdModal}
        handleSendContractId={handleSendContractId}
      />
    </div>
  )
}
