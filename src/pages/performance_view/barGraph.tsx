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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  const [rangeSize, setRangeSize] = useState(5) // Padrão de 5%
  const timeoutRef = useRef<NodeJS.Timeout>()
  const chartRef = useRef<HTMLDivElement>(null)

  const chartData = useMemo(() => {
    if (data.length === 0) return []

    // Encontra o min e max dos dados com verificação de segurança
    const performances = data
      .map((d) => d.performance)
      .filter((p) => !isNaN(p) && isFinite(p))

    if (performances.length === 0) return []

    const minPerformance =
      Math.floor(Math.min(...performances) / rangeSize) * rangeSize
    const maxPerformance =
      Math.ceil(Math.max(...performances) / rangeSize) * rangeSize

    // Verificação de segurança para evitar loops infinitos
    if (minPerformance === maxPerformance) {
      return [
        {
          range: `${minPerformance}% a ${minPerformance + rangeSize}%`,
          rangeStart: minPerformance + rangeSize / 2,
          rangeEnd: minPerformance + rangeSize,
          count: data.length,
          clients: data.map((client) => client.user),
          color: '#22c55e',
        },
      ]
    }

    // Gera ranges dinamicamente baseado nos dados
    const ranges = []

    // Cores para ranges negativos (vermelho/laranja claro para escuro)
    const negativeColors = [
      '#fef2f2', // vermelho muito claro
      '#fecaca', // vermelho claro
      '#fca5a5', // vermelho médio claro
      '#f87171', // vermelho médio
      '#ef4444', // vermelho
      '#dc2626', // vermelho escuro
      '#b91c1c', // vermelho mais escuro
      '#991b1b', // vermelho muito escuro
      '#7f1d1d', // vermelho extremamente escuro
    ]

    // Cores para ranges positivos (verde claro para escuro)
    const positiveColors = [
      '#f0fdf4', // verde muito claro
      '#dcfce7', // verde claro
      '#bbf7d0', // verde médio claro
      '#86efac', // verde médio
      '#4ade80', // verde
      '#22c55e', // verde escuro
      '#16a34a', // verde mais escuro
      '#15803d', // verde muito escuro
      '#166534', // verde extremamente escuro
      '#14532d', // verde ainda mais escuro
      '#134e4a', // verde azulado escuro
      '#0f766e', // teal escuro
      '#0d9488', // teal mais escuro
      '#14b8a6', // teal muito escuro
      '#2dd4bf', // teal extremamente escuro
    ]

    // Gera ranges negativos (cores mais escuras para valores mais negativos)
    for (let i = minPerformance; i < 0; i += rangeSize) {
      const colorIndex = Math.abs(i / rangeSize) - 1
      const color =
        negativeColors[Math.min(colorIndex, negativeColors.length - 1)]

      ranges.push({
        min: i,
        max: i + rangeSize,
        label: `${i}% a ${i + rangeSize}%`,
        color,
      })
    }

    // Range de 0%
    ranges.push({
      min: 0,
      max: rangeSize,
      label: `0% a ${rangeSize}%`,
      color: positiveColors[0],
    })

    // Gera ranges positivos (cores mais escuras para valores mais positivos)
    for (let i = rangeSize; i <= maxPerformance; i += rangeSize) {
      const colorIndex = Math.floor(i / rangeSize) - 1
      const color =
        positiveColors[Math.min(colorIndex, positiveColors.length - 1)]

      ranges.push({
        min: i,
        max: i + rangeSize,
        label: `${i}% a ${i + rangeSize}%`,
        color,
      })
    }

    // Adiciona ranges extremos se necessário
    if (minPerformance < -20) {
      ranges.unshift({
        min: -Infinity,
        max: minPerformance,
        label: `< ${minPerformance}%`,
        color: '#dc2626',
      })
    }

    if (maxPerformance > 50) {
      ranges.push({
        min: maxPerformance,
        max: Infinity,
        label: `> ${maxPerformance}%`,
        color: positiveColors[positiveColors.length - 1],
      })
    }

    // Agrupa os clientes por range
    const rangeData: RangeData[] = ranges.map((range) => {
      const clientsInRange = data.filter(
        (client) =>
          client.performance > range.min && client.performance <= range.max,
      )

      return {
        range: range.label,
        rangeStart:
          range.min === -Infinity
            ? minPerformance - 2.5
            : (range.min + range.max) / 2,
        rangeEnd: range.max === Infinity ? maxPerformance + 2.5 : range.max,
        count: clientsInRange.length,
        clients: clientsInRange.map((client) => client.user),
        color: range.color,
      }
    })

    return rangeData
  }, [data, rangeSize])

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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100">
          Distribuição de Performance dos Clientes
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">Tamanho do Range:</span>
          <Select
            value={rangeSize.toString()}
            onValueChange={(value) => setRangeSize(Number(value))}
          >
            <SelectTrigger className="w-24 bg-neutral-700 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-700 text-slate-100">
              <SelectItem value="1">1%</SelectItem>
              <SelectItem value="2">2%</SelectItem>
              <SelectItem value="5">5%</SelectItem>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="15">15%</SelectItem>
              <SelectItem value="20">20%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        ref={chartRef}
        className="relative"
        style={{ pointerEvents: isInteracting ? 'none' : 'auto' }}
      >
        <ResponsiveContainer
          width="100%"
          height={Math.max(400, chartData.length * 30)}
        >
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
