import React, { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { PerformanceWallets } from '../types/performanceWallets'

type PerformanceChartProps = {
  data: PerformanceWallets[]
}

interface TooltipData {
  range: string
  count: number
  clients: Array<{ name: string; performance: number }>
  color: string
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [rangeSize, setRangeSize] = useState(5)
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [fixedTooltipPosition, setFixedTooltipPosition] = useState({
    x: 0,
    y: 0,
  })

  const handleMouseEnter = (data: TooltipData) => {
    setTooltipData(data)
    setIsTooltipVisible(true)
    // Fixar posição quando o tooltip aparece
    setFixedTooltipPosition({ x: mousePosition.x, y: mousePosition.y })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // Só atualiza posição se tooltip não estiver visível
    if (!isTooltipVisible) {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
  }

  const handleTooltipMouseLeave = () => {
    setIsTooltipVisible(false)
    setTooltipData(null)
  }

  const chartData = useMemo(() => {
    if (data.length === 0) return []
    const performances = data
      .map((d) => d.performance)
      .filter((p) => !isNaN(p) && isFinite(p))
    if (performances.length === 0) return []
    const lowerLimit = -100
    const upperLimit = 100
    const safeRangeSize = [5, 10, 15, 20].includes(rangeSize) ? rangeSize : 5
    const ranges = []
    for (let i = lowerLimit; i < upperLimit; i += safeRangeSize) {
      ranges.push({
        min: i,
        max: i + safeRangeSize,
        label: `${i}% a ${i + safeRangeSize}%`,
      })
    }
    ranges.unshift({ min: -Infinity, max: lowerLimit, label: '< -100%' })
    ranges.push({ min: upperLimit, max: Infinity, label: '> 100%' })
    const negativeColors = [
      '#fef2f2',
      '#fecaca',
      '#fca5a5',
      '#f87171',
      '#ef4444',
      '#dc2626',
      '#b91c1c',
      '#991b1b',
      '#7f1d1d',
    ]
    const positiveColors = [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0',
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d',
      '#134e4a',
      '#0f766e',
      '#0d9488',
      '#14b8a6',
      '#2dd4bf',
    ]
    const rangeData = ranges.map((range) => {
      const clientsInRange = data.filter(
        (client) =>
          client.performance > range.min && client.performance <= range.max,
      )
      let color = '#22c55e'
      if (range.max <= 0) {
        color =
          negativeColors[
            Math.min(
              Math.abs(Math.floor((range.max - lowerLimit) / safeRangeSize)),
              negativeColors.length - 1,
            )
          ]
      } else if (range.min >= 0) {
        color =
          positiveColors[
            Math.min(
              Math.floor(range.min / safeRangeSize),
              positiveColors.length - 1,
            )
          ]
      }
      return {
        range: range.label,
        rangeStart:
          range.min === -Infinity
            ? lowerLimit - safeRangeSize / 2
            : (range.min + range.max) / 2,
        rangeEnd:
          range.max === Infinity ? upperLimit + safeRangeSize / 2 : range.max,
        count: clientsInRange.length,
        clients: clientsInRange.map((client) => ({
          name: client.user,
          performance: client.performance,
        })),
        color,
      }
    })
    return rangeData
  }, [data, rangeSize])

  const baseHeight = 400
  const extraBars = Math.max(0, chartData.length - 10)
  const chartHeight = Math.min(baseHeight + extraBars * 10, 700)
  const maxCount =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.count), 1)
      : 1

  return (
    <div className="relative w-full rounded-lg border bg-card p-6 border-border">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">
          Distribuição de Performance dos Clientes
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">
            Tamanho do Range:
          </span>
          <select
            className="w-24 rounded border bg-background px-2 py-1 text-foreground border-border"
            value={rangeSize}
            onChange={(e) => setRangeSize(Number(e.target.value))}
          >
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
          </select>
        </div>
      </div>
      <div className="relative">
        <div onMouseMove={handleMouseMove}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="range"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                label={{
                  value: 'Range de Performance (%)',
                  position: 'insideBottom',
                  offset: -5,
                  style: { textAnchor: 'middle', fill: '#9ca3af' },
                }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                label={{
                  value: 'Número de Clientes',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#9ca3af' },
                }}
                domain={[0, maxCount + 1]}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data) => {
                  if (data && data.payload) {
                    handleMouseEnter(data.payload)
                  }
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tooltip simples */}
        {isTooltipVisible && tooltipData && (
          <div
            className="fixed z-50 w-80 max-w-sm rounded-lg border bg-popover p-3 shadow-2xl border-border"
            style={{
              left: fixedTooltipPosition.x + 10,
              top: fixedTooltipPosition.y + 10,
              pointerEvents: 'auto',
            }}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: tooltipData.color }}
              />
              <p className="font-semibold text-popover-foreground">
                {tooltipData.range}
              </p>
            </div>
            <p className="mb-2 text-popover-foreground">
              Clientes: {tooltipData.count}
            </p>
            {tooltipData.count > 0 && (
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Clientes neste range:
                </p>
                <div className="scrollbar-thin max-h-32 overflow-y-auto rounded border bg-muted p-2 border-border">
                  {tooltipData.clients.map(
                    (
                      client: { name: string; performance: number },
                      index: number,
                    ) => (
                      <p
                        key={index}
                        className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50"
                      >
                        • {client.name} — {client.performance?.toFixed(2)}%
                      </p>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
        {chartData
          .filter((item) => item.count > 0)
          .map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">
                {item.range} ({item.count})
              </span>
            </div>
          ))}
      </div>
      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div className="rounded bg-muted p-3">
          <p className="text-muted-foreground">Total de Clientes</p>
          <p className="text-lg font-semibold text-foreground">
            {data.length}
          </p>
        </div>
        <div className="rounded bg-green-900/20 p-3">
          <p className="text-muted-foreground">
            Performance Positiva
          </p>
          <p className="text-lg font-semibold text-success">
            {data.filter((client) => client.performance > 0).length}
          </p>
        </div>
        <div className="rounded bg-red-900/20 p-3">
          <p className="text-muted-foreground">
            Performance Negativa
          </p>
          <p className="text-lg font-semibold text-destructive">
            {data.filter((client) => client.performance < 0).length}
          </p>
        </div>
        <div className="rounded bg-muted p-3">
          <p className="text-muted-foreground">Performance Média</p>
          <p className="text-lg font-semibold text-foreground">
            {data.length > 0
              ? (
                  data.reduce((acc, client) => acc + client.performance, 0) /
                  data.length
                ).toFixed(2)
              : '0.00'}
            %
          </p>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart
