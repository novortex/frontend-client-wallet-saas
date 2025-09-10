import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatRealCurrency } from '@/utils/formatRealCurrency'

interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  formatter?: 'text' | 'number' | 'currency' | ((value: any, row: any) => string)
}

interface AnalysisTableProps {
  data: any[]
  columns: TableColumn[]
  title: string
}

export function AnalysisTable({ 
  data, 
  columns,
  title 
}: AnalysisTableProps) {
  const formatValue = (column: TableColumn, value: any, row: any) => {
    if (typeof column.formatter === 'function') {
      return column.formatter(value, row)
    }
    
    switch (column.formatter) {
      case 'currency':
        return formatRealCurrency(value)
      case 'number':
        return value?.toString() || '0'
      case 'text':
      default:
        return value?.toString() || 'N/A'
    }
  }

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'left': return 'text-left'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key}
                  className={`${getAlignmentClass(column.align)} text-foreground`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = row[column.key]
                  return (
                    <TableCell 
                      key={column.key}
                      className={`${getAlignmentClass(column.align)} text-foreground`}
                    >
                      {formatValue(column, value, row)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}