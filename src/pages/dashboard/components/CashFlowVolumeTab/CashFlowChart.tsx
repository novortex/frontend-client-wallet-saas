import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CashFlowData, PeriodType } from '@/types/cashFlowVolume.type'
import { formatRealCurrency } from '@/utils/formatRealCurrency'

interface CashFlowChartProps {
  data: CashFlowData[]
  period: PeriodType
}

export function CashFlowChart({ data, period }: CashFlowChartProps) {
  const periodLabels = {
    daily: 'Diário',
    weekly: 'Semanal', 
    monthly: 'Mensal',
    quarterly: 'Trimestral',
  }

  const yAxisFormatter = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`
    } else if (Math.abs(value) >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`
    }
    return `R$ ${value.toFixed(0)}`
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium mb-2">{`Período: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            let displayName = ''
            let color = ''

            switch (entry.dataKey) {
              case 'deposits':
                displayName = 'Entradas'
                color = '#10b981'
                break
              case 'withdrawals':
                displayName = 'Saídas'
                color = '#ef4444'
                break
              case 'netFlow':
                displayName = 'Fluxo Líquido'
                color = '#3b82f6'
                break
            }

            return (
              <p key={index} style={{ color }}>
                {`${displayName}: ${formatRealCurrency(entry.value)}`}
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
          Fluxo de Caixa - {periodLabels[period]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
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
                tickFormatter={yAxisFormatter}
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
                dataKey="deposits"
                fill="#10b981"
                name="Entradas"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="withdrawals"
                fill="#ef4444"
                name="Saídas"
                radius={[2, 2, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="netFlow"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Fluxo Líquido"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}