import React, { useMemo, useState, useRef, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { PerformanceWallets } from '@/pages/performance_view'

interface PerformanceChartProps {
  data: PerformanceWallets[]
}

interface RangeData {
  range: string
  rangeStart: number
  rangeEnd: number
  count: number
  clients: string[]
  color: string
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [tooltipData, setTooltipData] = useState<any>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const chartRef = useRef<HTMLDivElement>(null)

  const chartData = useMemo(() => {
    // Ranges de performance de 5 em 5%
    const ranges = [
      { min: -Infinity, max: -20, label: '< -20%', color: '#dc2626' },
      { min: -20, max: -15, label: '-20% a -15%', color: '#ea580c' },
      { min: -15, max: -10, label: '-15% a -10%', color: '#f59e0b' },
      { min: -10, max: -5, label: '-10% a -5%', color: '#fbbf24' },
      { min: -5, max: 0, label: '-5% a 0%', color: '#fde047' },
      { min: 0, max: 5, label: '0% a 5%', color: '#84cc16' },
      { min: 5, max: 10, label: '5% a 10%', color: '#22c55e' },
      { min: 10, max: 15, label: '10% a 15%', color: '#16a34a' },
      { min: 15, max: 20, label: '15% a 20%', color: '#15803d' },
      { min: 20, max: Infinity, label: '> 20%', color: '#166534' },
    ]

    // Agrupa os clientes por range
    const rangeData: RangeData[] = ranges.map((range) => {
      const clientsInRange = data.filter(
        (client) =>
          client.performance > range.min && client.performance <= range.max,
      )

      return {
        range: range.label,
        rangeStart:
          range.min === -Infinity ? -22.5 : (range.min + range.max) / 2,
        rangeEnd: range.max === Infinity ? 22.5 : range.max,
        count: clientsInRange.length,
        clients: clientsInRange.map((client) => client.user),
        color: range.color,
      }
    })

    return rangeData
  }, [data])

  const clearTooltip = useCallback(() => {
    setTooltipData(null)
    setIsInteracting(false)
  }, [])

  const handleTooltipActivate = useCallback(
    (data: any, coordinate?: { x: number; y: number }) => {
      if (!isInteracting) {
        setTooltipData(data)

        // Calcula posição do tooltip
        if (coordinate && chartRef.current) {
          const chartRect = chartRef.current.getBoundingClientRect()

          // Posição base do tooltip
          const x = coordinate.x + 15 // margem left do BarChart
          const y = coordinate.y + 20 // margem top do BarChart

          // Dimensoes do tooltip
          const tooltipWidth = 320
          const tooltipHeight = Math.min(
            250,
            80 + (data.clients?.length || 0) * 25,
          )

          let adjustedX = x + 15 // pequeno offset da barra
          let adjustedY = y - tooltipHeight / 2 // centraliza verticalmente com a barra

          // Se vai sair pela direita, coloca à esquerda
          if (adjustedX + tooltipWidth > chartRect.width - 20) {
            adjustedX = x - tooltipWidth - 15
          }

          // Se vai sair por cima
          if (adjustedY < 10) {
            adjustedY = 10
          }

          // Se vai sair por baixo
          if (adjustedY + tooltipHeight > chartRect.height - 10) {
            adjustedY = chartRect.height - tooltipHeight - 10
          }

          // Garante que não saia pela esquerda
          adjustedX = Math.max(10, adjustedX)

          setTooltipPosition({ x: adjustedX, y: adjustedY })
        }
      }
    },
    [isInteracting],
  )

  const handleTooltipDeactivate = useCallback(() => {
    if (!isInteracting) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(clearTooltip, 100)
    }
  }, [isInteracting, clearTooltip])

  const handleTooltipInteractionStart = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsInteracting(true)
  }, [])

  const handleTooltipInteractionEnd = useCallback(() => {
    setIsInteracting(false)
    clearTooltip()
  }, [clearTooltip])

  const CustomTooltip = ({ active, payload, coordinate }: any) => {
    if (active && payload && payload.length && !isInteracting) {
      handleTooltipActivate(payload[0].payload, coordinate)
    } else if (!active && !isInteracting) {
      handleTooltipDeactivate()
    }
    return null
  }

  const maxCount = Math.max(...chartData.map((item) => item.count), 1)

  return (
    <div className="relative w-full rounded-lg border border-neutral-700 bg-neutral-800/50 p-6">
      <h3 className="mb-4 text-xl font-bold text-slate-100">
        Distribuição de Performance dos Clientes
      </h3>

      <div
        ref={chartRef}
        className="relative"
        style={{ pointerEvents: isInteracting ? 'none' : 'auto' }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              bottom: 60,
              left: 60,
            }}
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {tooltipData && (
          <div
            className="absolute z-50 w-80 max-w-sm rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-2xl"
            style={{
              pointerEvents: 'auto',
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
            onMouseEnter={handleTooltipInteractionStart}
            onMouseLeave={handleTooltipInteractionEnd}
          >
            <div className="mb-2 flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: tooltipData.color }}
              />
              <p className="font-semibold text-slate-100">
                {tooltipData.range}
              </p>
            </div>
            <p className="mb-2 text-slate-300">Clientes: {tooltipData.count}</p>
            {tooltipData.count > 0 && (
              <div>
                <p className="mb-2 text-xs text-slate-400">
                  Clientes neste range:
                </p>
                <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700 max-h-32 overflow-y-auto">
                  {tooltipData.clients.map((client: string, index: number) => (
                    <p
                      key={index}
                      className="rounded px-2 py-1 text-xs text-slate-300 hover:bg-neutral-700/50"
                    >
                      • {client}
                    </p>
                  ))}
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
              <span className="text-slate-300">
                {item.range} ({item.count})
              </span>
            </div>
          ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div className="rounded bg-neutral-700/50 p-3">
          <p className="text-slate-400">Total de Clientes</p>
          <p className="text-lg font-semibold text-slate-100">{data.length}</p>
        </div>
        <div className="rounded bg-green-900/20 p-3">
          <p className="text-slate-400">Performance Positiva</p>
          <p className="text-lg font-semibold text-green-400">
            {data.filter((client) => client.performance > 0).length}
          </p>
        </div>
        <div className="rounded bg-red-900/20 p-3">
          <p className="text-slate-400">Performance Negativa</p>
          <p className="text-lg font-semibold text-red-400">
            {data.filter((client) => client.performance < 0).length}
          </p>
        </div>
        <div className="rounded bg-neutral-700/50 p-3">
          <p className="text-slate-400">Performance Média</p>
          <p className="text-lg font-semibold text-slate-100">
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
