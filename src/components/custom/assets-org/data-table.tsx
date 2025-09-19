import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
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
import filterIcon from '@/assets/icons/filter.svg'
import exportIcon from '@/assets/icons/export.svg'
import { useMemo, useState } from 'react'
import AddNewAssetModal from './add-new-asset-modal'
import { useAssetPricesSocket } from '@/hooks/useSocketPrice'

type Asset = {
  id: string
  asset: {
    urlImage: string
    name: string
  }
  price: number
  appearances: string
  porcentOfApp: string
  quantSLowRisk: string
  quantLowRisk: string
  quantStandard: string
  quantHighRisk: string
  quantSHighRisk: string
}

interface DataTableProps<TValue> {
  columns: ColumnDef<Asset, TValue>[]
  data: Asset[]
}

export function DataTableAssetOrg<TValue>({
  columns,
  data,
}: DataTableProps<TValue>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])

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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
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
      <div className="flex items-center justify-between rounded-t-lg bg-lightComponent p-5 dark:bg-[#171717]">
        <h1 className="text-xl dark:text-white">Administrator</h1>
        <div className="flex gap-5">
          <Button className="flex w-1/3 gap-2 bg-gray-200 p-5 text-black hover:bg-gray-300 dark:bg-white">
            <img src={filterIcon} alt="" /> Filters
          </Button>
          <Button className="flex w-1/3 gap-2 bg-gray-200 p-5 text-black hover:bg-gray-300 dark:bg-white">
            <img src={exportIcon} alt="" /> Export
          </Button>
          <Button
            className="w-1/2 bg-[#FF4A3A] text-black hover:bg-red-500 hover:text-white"
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
              className="bg-gray-200 hover:bg-gray-300 dark:bg-[#131313] dark:hover:bg-[#101010]"
            >
              {headerGroup.headers.map((header, idx) => (
                <TableHead
                  key={header.id}
                  className={`text-black dark:text-white ${idx === 0 ? 'pl-4' : ''}`}
                >
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
                className="hover:bg-gray-200 dark:hover:bg-[#101010] dark:hover:bg-[#171717]"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <TableCell
                    key={cell.id}
                    className={`${idx === 0 ? 'pl-4' : ''}`}
                  >
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
      <AddNewAssetModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
