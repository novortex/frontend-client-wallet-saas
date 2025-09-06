import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDolarCurrency } from '@/utils/formatDolarCurrency'

interface AssetData {
  name: string
  total: number
  percentage: number
  walletCount: number
}

interface AssetAllocationTableProps {
  data: AssetData[]
  colors: string[]
}

export function AssetAllocationTable({ data, colors }: AssetAllocationTableProps) {
  return (
    <Card className="border-border bg-card transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">
          Alocação por Ativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-foreground">
                  Ativo
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  % do Total
                </th>
                <th className="px-4 py-3 text-right font-medium text-foreground">
                  Carteiras
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((asset, index) => (
                <tr
                  key={asset.name}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      {asset.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatDolarCurrency(asset.total)}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {asset.percentage.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {asset.walletCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}