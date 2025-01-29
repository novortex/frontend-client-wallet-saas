import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
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
  const [showWallet, setShowWallet] =
    useState(true)
  const [showBenchmark, setShowBenchmark] =
    useState(true)
  const [graphData, setGraphData] = useState<
    graphDataEntry[]
  >([])
  const [isMonthlyView, setIsMonthlyView] =
    useState(false) // Estado para o switch
  const { walletUuid } = useParams()

  useEffect(() => {
    async function fetchGraphData() {
      if (walletUuid) {
        try {
          const data =
            await getGraphData(walletUuid)

          const sortedData = data.sort(
            (
              a: graphDataEntry,
              b: graphDataEntry
            ) =>
              new Date(a.createAt).getTime() -
              new Date(b.createAt).getTime()
          )

          setGraphData(sortedData)
        } catch (error) {
          console.error(
            'Failed to fetch historic:',
            error
          )
        }
      } else {
        console.error(
          'organizationUuid or walletUuid is undefined'
        )
      }
    }
    fetchGraphData()
  }, [walletUuid])

  // Função para filtrar o último valor de cada mês
  const getLastEntryOfEachMonth = (
    data: graphDataEntry[]
  ) => {
    const months = new Map<
      string,
      graphDataEntry
    >()

    data.forEach((entry) => {
      const monthYear = new Date(
        entry.createAt
      ).toLocaleDateString('default', {
        month: 'long',
        year: '2-digit',
      })
      // Substituirá a entrada do mês anterior com o valor mais recente
      months.set(monthYear, entry)
    })

    return Array.from(months.values())
  }

  // Mapeamento dos dados retornados da API para o formato esperado pelo gráfico
  const formattedChartData = graphData.map(
    (entry) => ({
      date: new Date(
        entry.createAt
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }), // Formata a data para dd/MM
      value: entry.cryptoMoney,
      wallet: entry.cryptoMoney,
      Benchmark: entry.benchmarkMoney,
    })
  )

  // Formatar dados para visualização mensal
  const monthlyData = getLastEntryOfEachMonth(
    graphData
  ).map((entry) => ({
    date: new Date(
      entry.createAt
    ).toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit',
    }), // Formata para Sep/24, Oct/24
    value: entry.cryptoMoney,
    wallet: entry.cryptoMoney,
    Benchmark: entry.benchmarkMoney,
  }))

  // Selecionar os dados com base na visualização atual (dias ou meses)
  const chartData = isMonthlyView
    ? monthlyData
    : formattedChartData

  // Encontrar os valores mínimos e máximos
  const minValue = Math.min(
    ...graphData.map((entry) =>
      Math.min(
        entry.cryptoMoney,
        entry.benchmarkMoney
      )
    )
  )
  const maxValue = Math.max(
    ...graphData.map((entry) =>
      Math.max(
        entry.cryptoMoney,
        entry.benchmarkMoney
      )
    )
  )

  return (
    <Card className="bg-[#131313] text-card-foreground p-4 rounded-lg shadow-lg border-transparent">
      <CardHeader className="mb-4 gap-10">
        <CardTitle className="text-2xl font-semibold flex flex-row gap-5">
          <div className="flex flex-row gap-5 w-1/2">
            <div className="flex flex-row text-[#fff] gap-2 items-center">
              <Checkbox
                checked={showWallet}
                onCheckedChange={(checked) =>
                  setShowWallet(checked === true)
                }
                className="border-transparent bg-[#1878f3] data-[state=checked]:bg-[#1878f3]"
              />
              <Label className="text-lg">
                Wallet
              </Label>
            </div>
            <div className="flex flex-row text-[#fff] gap-2 items-center">
              <Checkbox
                checked={showBenchmark}
                onCheckedChange={(checked) =>
                  setShowBenchmark(
                    checked === true
                  )
                }
                className="border-transparent bg-[#11a45c] data-[state=checked]:bg-[#11a45c]"
              />
              <Label className="text-lg">
                Benchmark
              </Label>
            </div>
          </div>
          <div className="w-1/2 flex justify-end text-sm gap-4 items-center text-[#fff]">
            <p>View: Days / Months</p>
            <Switch
              checked={isMonthlyView}
              onCheckedChange={setIsMonthlyView} // Alterna a visualização
            />
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-[#fff] text-lg">
          Graphic | Profitability x Time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mb-4"
        >
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
            />
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
                if (value >= 1e9)
                  return `${(value / 1e9).toFixed(2)}B`
                if (value >= 1e6)
                  return `${(value / 1e6).toFixed(2)}M`
                if (value >= 1e3)
                  return `${(value / 1e3).toFixed(2)}K`
                return value.toFixed(2)
              }}
            />
            {showWallet && (
              <Line
                dataKey="wallet"
                type="linear"
                stroke="#1878f3"
                strokeWidth={1.5}
                dot={true}
              />
            )}
            {showBenchmark && (
              <Line
                dataKey="Benchmark"
                type="linear"
                stroke="#11a45c"
                strokeWidth={1.5}
                dot={true}
              />
            )}
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
