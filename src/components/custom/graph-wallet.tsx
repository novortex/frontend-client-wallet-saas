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
import { useState } from 'react'

const chartDataMonth = [
  { value: '25000', month: 'January', wallet: '26000', Benchmark: '28000' },
  { value: '30000', month: 'February', wallet: '29000', Benchmark: '27500' },
  { value: '35000', month: 'March', wallet: '34000', Benchmark: '28500' },
  { value: '40000', month: 'April', wallet: '35000', Benchmark: '29500' },
  { value: '45000', month: 'May', wallet: '37000', Benchmark: '30000' },
  { value: '50000', month: 'June', wallet: '48000', Benchmark: '32000' },
  { value: '55000', month: 'July', wallet: '50000', Benchmark: '63000' },
  { value: '60000', month: 'August', wallet: '51000', Benchmark: '34000' },
  { value: '65000', month: 'September', wallet: '60000', Benchmark: '35000' },
  { value: '70000', month: 'October', wallet: '62000', Benchmark: '36500' },
  { value: '75000', month: 'November', wallet: '68000', Benchmark: '38000' },
  { value: '80000', month: 'December', wallet: '70000', Benchmark: '40000' },
]

const chartConfig = {
  desktop: {
    label: '',
    color: '',
  },
} satisfies ChartConfig

export default function WalletGraph() {
  const [showWallet, setShowWallet] = useState(true)
  const [showBenchmark, setShowBenchmark] = useState(true)

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
          <LineChart data={chartDataMonth}>
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {showWallet && (
              <Line
                dataKey="wallet"
                type="monotone"
                stroke="#1878f3"
                strokeWidth={1.5}
                dot={true}
              />
            )}
            {showBenchmark && (
              <Line
                dataKey="Benchmark"
                type="monotone"
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
