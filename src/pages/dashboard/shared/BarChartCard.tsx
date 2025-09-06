import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TOOLTIP_STYLES, AXIS_STYLES, ChartDataType, generateUniqueGradientId, getChartConfig } from '../constants'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { useMemo } from 'react'

interface BarChartCardProps {
  title: string
  data: any[]
  dataKey: string
  chartType: ChartDataType
  nameKey?: string
  valueFormatter?: (value: number) => string
  yAxisFormatter?: (value: number) => string
  tooltipLabel?: string
  tooltipFormatter?: (value: number) => [string | number, string]
  height?: number
  truncateNames?: boolean
  maxNameLength?: number
  margin?: { top: number; right: number; left: number; bottom: number }
  xAxisProps?: {
    angle?: number
    textAnchor?: string
    height?: number
    tick?: {
      fill?: string
      fontSize?: number
    }
  }
}

export function BarChartCard({
  title,
  data,
  dataKey,
  chartType,
  nameKey = 'name',
  valueFormatter = formatRealCurrency,
  yAxisFormatter = (value) => `R$ ${(value / 1000).toFixed(0)}k`,
  tooltipLabel,
  tooltipFormatter,
  height = 320,
  truncateNames = true,
  maxNameLength = 10,
  margin = { top: 20, right: 30, left: 20, bottom: 60 },
  xAxisProps,
}: BarChartCardProps) {
  // Gerar configuração única para este gráfico
  const chartConfig = useMemo(() => {
    const config = getChartConfig(chartType)
    const uniqueGradientId = generateUniqueGradientId(chartType)
    return {
      ...config,
      gradientId: uniqueGradientId,
    }
  }, [chartType])

  const processedData = data.map((item) => ({
    ...item,
    [nameKey]: truncateNames && item[nameKey]?.length > maxNameLength 
      ? `${item[nameKey].substring(0, maxNameLength)}...` 
      : item[nameKey],
  }))

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={margin}
            >
              <defs>
                <linearGradient
                  id={chartConfig.gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.color}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey={nameKey}
                angle={xAxisProps?.angle ?? -45}
                textAnchor={xAxisProps?.textAnchor ?? "end"}
                height={xAxisProps?.height ?? 80}
                interval={0}
                tick={xAxisProps?.tick ?? { fontSize: 10, fill: 'hsl(var(--foreground))' }}
                axisLine={AXIS_STYLES.axisLine}
              />
              <YAxis
                tickFormatter={yAxisFormatter}
                tick={AXIS_STYLES.tick}
                axisLine={AXIS_STYLES.axisLine}
              />
              <Tooltip
                formatter={tooltipFormatter || ((v: number) => [
                  valueFormatter(v),
                  tooltipLabel || chartConfig.label,
                ])}
                contentStyle={TOOLTIP_STYLES.contentStyle}
                labelStyle={TOOLTIP_STYLES.labelStyle}
              />
              <Bar
                dataKey={dataKey}
                fill={`url(#${chartConfig.gradientId})`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}