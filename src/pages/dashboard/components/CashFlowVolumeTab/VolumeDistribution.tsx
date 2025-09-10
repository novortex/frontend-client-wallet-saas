import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VolumeData, PeriodType, Currency } from '@/types/cashFlowVolume.type'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { formatDolarCurrency } from '@/utils/formatDolarCurrency'

interface VolumeDistributionProps {
  data: VolumeData[]
  period: PeriodType
  currency: Currency
}

export function VolumeDistribution({ data, period, currency }: VolumeDistributionProps) {
  const periodLabels = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
  }

  // Aggregate data by period, summing all assets
  const aggregatedData = useMemo(() => {
    const periodTotals = data.reduce((acc, item) => {
      if (!acc[item.period]) {
        acc[item.period] = {
          period: item.period,
          totalBuy: 0,
          totalSell: 0,
          totalVolume: 0,
        }
      }

      // Use monetary values based on selected currency
      if (currency === 'BRL') {
        acc[item.period].totalBuy += item.buyVolumeValueBRL || 0
        acc[item.period].totalSell += item.sellVolumeValueBRL || 0
        acc[item.period].totalVolume += item.totalVolumeValueBRL || 0
      } else {
        acc[item.period].totalBuy += item.buyVolumeValueUSD || 0
        acc[item.period].totalSell += item.sellVolumeValueUSD || 0
        acc[item.period].totalVolume += item.totalVolumeValueUSD || 0
      }

      return acc
    }, {} as Record<string, any>)

    return Object.values(periodTotals).sort((a: any, b: any) => 
      a.period.localeCompare(b.period)
    )
  }, [data, currency])

  const formatVolume = currency === 'BRL' ? formatRealCurrency : formatDolarCurrency

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium mb-2">{`Período: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            let displayName = ''
            let color = ''

            switch (entry.dataKey) {
              case 'totalBuy':
                displayName = 'Compras'
                color = '#10b981'
                break
              case 'totalSell':
                displayName = 'Vendas'
                color = '#ef4444'
                break
            }

            return (
              <p key={index} style={{ color }}>
                {`${displayName}: ${formatVolume(entry.value)}`}
              </p>
            )
          })}
        </div>
      )
    }

    return null
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">
          Volume de Criptomoedas ({currency}) - {periodLabels[period]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aggregatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tickFormatter={formatVolume}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={customTooltip} />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  color: 'hsl(var(--foreground))',
                }}
              />

              <Bar
                dataKey="totalBuy"
                stackId="volume"
                fill="#10b981"
                name="Compras"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="totalSell"
                stackId="volume"
                fill="#ef4444"
                name="Vendas"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}