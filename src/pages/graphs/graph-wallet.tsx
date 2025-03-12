/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceArea,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getGraphData } from '@/services/wallet/walleInfoService'

const chartConfig = {
  desktop: {
    label: '',
    color: '',
  },
} satisfies ChartConfig

interface graphDataEntry {
  cuid: string
  amountPercentage: number
  cryptoMoney: number
  benchmarkMoney: number
  walletUuid: string
  createAt: string
}

export function WalletGraph() {
  const [showWallet, setShowWallet] = useState(true)
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [graphData, setGraphData] = useState<graphDataEntry[]>([])
  const [isMonthlyView, setIsMonthlyView] = useState(false)
  const [dragStart, setDragStart] = useState<{
    index: number
    value: number
  } | null>(null)
  const [dragEnd, setDragEnd] = useState<{
    index: number
    value: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mouseCoords, setMouseCoords] = useState<{
    x: number
    y: number
  } | null>(null)
  const [diffAbsolute, setDiffAbsolute] = useState<number | null>(null)
  const [diffPercent, setDiffPercent] = useState<number | null>(null)
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchGraphData() {
      if (walletUuid) {
        try {
          const data = await getGraphData(walletUuid)
          const sortedData = data.sort(
            (a: graphDataEntry, b: graphDataEntry) =>
              new Date(a.createAt).getTime() - new Date(b.createAt).getTime(),
          )
          setGraphData(sortedData)
        } catch (error) {
          console.error('Failed to fetch historic:', error)
        }
      } else {
        console.error('organizationUuid or walletUuid is undefined')
      }
    }
    fetchGraphData()
  }, [walletUuid])

  const getLastEntryOfEachMonth = (data: graphDataEntry[]) => {
    const months = new Map<string, graphDataEntry>()
    data.forEach((entry) => {
      const monthYear = new Date(entry.createAt).toLocaleDateString('default', {
        month: 'long',
        year: '2-digit',
      })
      months.set(monthYear, entry)
    })
    return Array.from(months.values())
  }

  const formattedChartData = graphData.map((entry, index) => ({
    index,
    date: new Date(entry.createAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    wallet: entry.cryptoMoney,
    Benchmark: entry.benchmarkMoney,
  }))

  const monthlyData = getLastEntryOfEachMonth(graphData).map(
    (entry, index) => ({
      index,
      date: new Date(entry.createAt).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      wallet: entry.cryptoMoney,
      Benchmark: entry.benchmarkMoney,
    }),
  )

  const chartData = isMonthlyView ? monthlyData : formattedChartData

  const activeValues = chartData.flatMap((d) => {
    const values: number[] = []
    if (showWallet) values.push(d.wallet)
    if (showBenchmark) values.push(d.Benchmark)
    return values
  })
  const minValue = activeValues.length ? Math.min(...activeValues) : 0
  const maxValue = activeValues.length ? Math.max(...activeValues) : 0

  const handleMouseDown = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const payloadKey = showWallet ? 'wallet' : 'Benchmark'
      const selectedPayload = e.activePayload.find(
        (p: any) => p.dataKey === payloadKey,
      )
      if (selectedPayload) {
        setIsDragging(true)
        const value = selectedPayload.payload[payloadKey]
        const payloadIndex = selectedPayload.payload.index
        setDragStart({ index: payloadIndex, value })
        setDragEnd(null)
        setDiffAbsolute(null)
        setDiffPercent(null)
      }
    }
  }

  const handleMouseMove = (e: any) => {
    if (
      isDragging &&
      e &&
      e.activePayload &&
      e.activePayload.length > 0 &&
      dragStart !== null
    ) {
      const payloadKey = showWallet ? 'wallet' : 'Benchmark'
      const selectedPayload = e.activePayload.find(
        (p: any) => p.dataKey === payloadKey,
      )
      if (selectedPayload) {
        const value = selectedPayload.payload[payloadKey]
        const payloadIndex = selectedPayload.payload.index
        setDragEnd({ index: payloadIndex, value })
        if (e.chartX && e.chartY) {
          setMouseCoords({ x: e.chartX, y: e.chartY })
        }
        if (dragStart.value !== 0) {
          const absDiff = value - dragStart.value
          const percDiff = (absDiff / dragStart.value) * 100
          setDiffAbsolute(absDiff)
          setDiffPercent(percDiff)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <Card className="rounded-lg border bg-lightComponent p-4 text-card-foreground shadow-lg dark:bg-[#131313]">
      <CardHeader className="mb-4 gap-10">
        <CardTitle className="flex flex-row gap-5 text-2xl font-semibold">
          <div className="flex w-1/2 flex-row gap-5">
            <div className="flex flex-row items-center gap-2 dark:text-[#fff]">
              <Checkbox
                checked={showWallet}
                onCheckedChange={(checked) => setShowWallet(checked === true)}
                className="border-transparent bg-[#1878f3] data-[state=checked]:bg-[#1878f3]"
              />
              <Label className="text-lg">Wallet</Label>
            </div>
            <div className="flex flex-row items-center gap-2 dark:text-[#fff]">
              <Checkbox
                checked={showBenchmark}
                onCheckedChange={(checked) =>
                  setShowBenchmark(checked === true)
                }
                className="border-transparent bg-[#11a45c] data-[state=checked]:bg-[#11a45c]"
              />
              <Label className="text-lg">Benchmark</Label>
            </div>
          </div>
          <div className="flex w-1/2 items-center justify-end gap-4 text-sm dark:text-[#fff]">
            <p>Daily</p>
            <Switch
              checked={isMonthlyView}
              onCheckedChange={setIsMonthlyView}
            />
            <p>Monthly</p>
          </div>
        </CardTitle>
        <CardDescription className="text-lg text-sm text-black text-muted-foreground dark:text-[#fff]">
          Graphic | Profitability x Time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ userSelect: 'none' }}>
          <ChartContainer
            config={chartConfig}
            className="mb-4 h-[400px] w-full"
          >
            <LineChart
              data={chartData}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <CartesianGrid vertical={false} horizontal={true} />
              {dragStart && dragEnd && diffAbsolute !== null && (
                <ReferenceArea
                  x1={dragStart.index}
                  x2={dragEnd.index}
                  y1={minValue}
                  y2={maxValue}
                  strokeOpacity={0}
                  fillOpacity={0.3}
                  fill={diffAbsolute >= 0 ? 'green' : 'red'}
                />
              )}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={[minValue, maxValue]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
                  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
                  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
                  return value.toFixed(2)
                }}
              />
              {showWallet && (
                <Line
                  dataKey="wallet"
                  type="linear"
                  stroke="#1878f3"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              {showBenchmark && (
                <Line
                  dataKey="Benchmark"
                  type="linear"
                  stroke="#11a45c"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
          {mouseCoords &&
            dragStart &&
            dragEnd &&
            diffAbsolute !== null &&
            diffPercent !== null && (
              <div
                style={{
                  position: 'absolute',
                  left: mouseCoords.x,
                  top: mouseCoords.y - 40,
                  zIndex: 10,
                }}
              >
                <div
                  className={`text-sm font-bold ${diffAbsolute >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {diffAbsolute >= 0 ? '+' : ''}
                  {diffAbsolute.toFixed(2)} ({diffPercent >= 0 ? '+' : ''}
                  {diffPercent.toFixed(2)}%)
                </div>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
