import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
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
import { useUserStore } from '@/store/user'
import { getGraphData } from '@/service/request'

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

export default function WalletGraph() {
  const [showWallet, setShowWallet] = useState(true)
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [graphData, setGraphData] = useState<graphDataEntry[]>([])
  const { walletUuid } = useParams()
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])

  useEffect(() => {
    async function fetchGraphData() {
      if (uuidOrganization && walletUuid) {
        try {
          const data = await getGraphData(uuidOrganization, walletUuid)

          // Ordenar os dados por data (createAt) e tipar os parâmetros
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
  }, [uuidOrganization, walletUuid])

  // Mapeamento dos dados retornados da API para o formato esperado pelo gráfico
  const formattedChartData = graphData.map((entry) => ({
    month: new Date(entry.createAt).toLocaleString('default', {
      month: 'long',
    }), // Converte a data para o nome do mês
    value: entry.cryptoMoney, // Torna o "value" dinâmico com base em wallet
    wallet: entry.cryptoMoney,
    Benchmark: entry.benchmarkMoney,
  }))

  // Encontrar os valores mínimos e máximos entre "cryptoMoney" e "benchmarkMoney"
  const minValue = Math.min(
    ...graphData.map((entry) =>
      Math.min(entry.cryptoMoney, entry.benchmarkMoney),
    ),
  )
  const maxValue = Math.max(
    ...graphData.map((entry) =>
      Math.max(entry.cryptoMoney, entry.benchmarkMoney),
    ),
  )

  return (
    <Card className="bg-[#131313] text-card-foreground p-4 rounded-lg shadow-lg border-transparent">
      <CardHeader className="mb-4 gap-10">
        <CardTitle className="text-2xl font-semibold flex flex-row gap-5">
          <div className="flex flex-row text-[#fff] gap-2 items-center">
            <Checkbox
              checked={showWallet}
              onCheckedChange={(checked) => setShowWallet(checked === true)}
              className="border-transparent bg-[#1878f3] data-[state=checked]:bg-[#1878f3]"
            />
            <Label className="text-lg">Wallet</Label>
          </div>
          <div className="flex flex-row text-[#fff] gap-2 items-center">
            <Checkbox
              checked={showBenchmark}
              onCheckedChange={(checked) => setShowBenchmark(checked === true)}
              className="border-transparent bg-[#11a45c] data-[state=checked]:bg-[#11a45c]"
            />
            <Label className="text-lg">Benchmark</Label>
          </div>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-[#fff] text-lg">
          Graphic | Profitability x Time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mb-4">
          <LineChart data={formattedChartData}>
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Exibe os primeiros 3 caracteres do mês
            />
            <YAxis
              domain={[minValue, maxValue]} // Domínio definido com base nos valores mínimo e máximo
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {showWallet && (
              <Line
                dataKey="wallet"
                type="linear" // Alterado para reta
                stroke="#1878f3"
                strokeWidth={1.5}
                dot={true}
              />
            )}
            {showBenchmark && (
              <Line
                dataKey="Benchmark"
                type="linear" // Alterado para reta
                stroke="#11a45c"
                strokeWidth={1.5}
                dot={true}
              />
            )}
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
