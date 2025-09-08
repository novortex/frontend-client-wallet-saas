import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChartTooltip } from './PieChartTooltip'
import { formatRealCurrency } from '@/utils/formatRealCurrency'

interface PieChartCardProps {
  title: string
  data: any[]
  dataKey: string
  nameKey?: string
  colors: string[]
  valueFormatter?: (value: number) => string
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
}

export function PieChartCard({
  title,
  data,
  dataKey,
  nameKey = 'name',
  colors,
  valueFormatter = formatRealCurrency,
  height = 300,
  innerRadius = 0,
  outerRadius = 100,
  showLegend = true,
}: PieChartCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                dataKey={dataKey}
                nameKey={nameKey}
                fill="#8884d8"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    style={{
                      filter: 'drop-shadow(0 1px 2px hsl(var(--shadow)))',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={<PieChartTooltip valueFormatter={valueFormatter} />}
                cursor={{ fill: 'transparent' }}
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{
                    fontSize: '12px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}