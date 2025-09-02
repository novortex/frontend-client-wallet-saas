import { useEffect, useState } from 'react'
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { preparePerformanceData } from './utils/prepareWalletsPerformanceComparison'
import { prepareBenchmarkComparisonData } from './utils/prepareBenchmarkComparison'
import { getAUMByRiskProfile } from './utils/getAUMByRiskprofile'
import { getAUMByBenchmark } from './utils/getAUMByBenchmark'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'
import {
  getAllocationByAsset,
  getRevenueProjection,
} from '@/services/managementService'
import { AllocationByAsset } from '@/types/asset.type'
import { Loading } from '@/components/custom/loading'
import { formatDolarCurrency } from '@/utils/formatDolarCurrency'
import { gerarCores } from './utils/generateBarchartColors'
import { SwitchTheme } from '@/components/custom/switch-theme'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Sistema de cores padronizado
const COLORS_PERFORMANCE = ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'] // Verde, Vermelho
const COLORS_BENCHMARK = ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'] // Verde, Vermelho

export default function Dashboard() {
  const [allocationByAsset, setAllocationByAsset] = useState<AllocationByAsset>(
    {
      totalAUM: 0,
      assets: {},
    },
  )
  const [revenueProjection, setRevenueProjection] =
    useState<RevenueProjectionDashboardData>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [allocationByAssetResponse, revenueProjectionResponse] =
        await Promise.all([getAllocationByAsset(), getRevenueProjection()])

      setAllocationByAsset(allocationByAssetResponse)
      setRevenueProjection(revenueProjectionResponse)
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const [activeTab, setActiveTab] = useState('overview')
  if (isLoading) return <Loading />

  if (!revenueProjection)
    return (
      <p className="text-md flex items-center justify-center font-bold text-foreground">
        Error fetching dashboard data
      </p>
    )

  const aumByRiskprofile = getAUMByRiskProfile(revenueProjection)
  const aumByBenchmark = getAUMByBenchmark(revenueProjection)
  const allocationArray = Object.entries(allocationByAsset.assets)
    .map(([name, data]) => ({
      name,
      total: data.value,
      percentage: data.percentage,
      walletCount: data.walletCount,
    }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)

  const colors = gerarCores(allocationArray.length)

  const performanceData = preparePerformanceData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  )
  const benchmarkComparisonData = prepareBenchmarkComparisonData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  )

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard Financeiro
            </h1>
            <p className="text-sm text-muted-foreground">
              Análise de desempenho de carteiras de investimento
            </p>
          </div>
          <SwitchTheme />
        </div>

        {/* Abas de navegação */}
        <div className="mb-6 flex flex-wrap border-b border-border">
          <button
            className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="hidden sm:inline">Visão Geral</span>
            <span className="sm:hidden">Visão</span>
          </button>
          <button
            className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'risk' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('risk')}
          >
            <span className="hidden sm:inline">
              Análise por Perfil de Risco
            </span>
            <span className="sm:hidden">Risco</span>
          </button>
          <button
            className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'benchmark' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('benchmark')}
          >
            <span className="hidden sm:inline">Análise por Benchmark</span>
            <span className="sm:hidden">Benchmark</span>
          </button>
        </div>

        <p className="text-md mb-4 ml-2 font-bold text-muted-foreground">
          Carteiras que não entraram na conta por falta de dados:{' '}
          {revenueProjection.summary.missingInformationAboutPerformanceOrWallet}
        </p>

        {/* Conteúdo da Visão Geral */}
        {activeTab === 'overview' && (
          <div>
            {/* KPIs */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">
                        Número de carteiras abertas
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {revenueProjection.summary.openWallets}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">
                        AUM Total
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatRealCurrency(revenueProjection.summary.totalAUM)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">
                        Total investido
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatRealCurrency(
                          revenueProjection.summary.totalInvestedCapital,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 font-semibold text-foreground">
                        Receita Total
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (fechando todas hoje)
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatRealCurrency(
                          revenueProjection.summary.totalRevenue,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Alocação por Ativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Ativo
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">
                          Valor Total
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">
                          % do Total
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-foreground">
                          Carteiras
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocationArray.map((asset, index) => (
                        <tr
                          key={asset.name}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="px-4 py-3 text-foreground">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    colors[index % colors.length],
                                }}
                              />
                              {asset.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {formatDolarCurrency(asset.total)}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            {asset.percentage.toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            {asset.walletCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Comparação Lucro x Prejuízo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="35%"
                          labelLine={false}
                          outerRadius={45}
                          fill="hsl(var(--chart-4))"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {performanceData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS_PERFORMANCE[
                                  index % COLORS_PERFORMANCE.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Quantidade']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-300">
                    <span
                      style={{ color: COLORS_PERFORMANCE[0] }}
                      className="font-semibold"
                    >
                      {revenueProjection.summary.openWallets -
                        revenueProjection.summary.walletsLosingMoneyCount}
                    </span>
                    <span> carteiras com lucro • </span>
                    <span
                      style={{ color: COLORS_PERFORMANCE[1] }}
                      className="font-semibold"
                    >
                      {revenueProjection.summary.walletsLosingMoneyCount}
                    </span>
                    <span> carteiras com prejuízo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Comparação com Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={benchmarkComparisonData}
                          cx="50%"
                          cy="35%"
                          labelLine={false}
                          outerRadius={45}
                          fill="hsl(var(--chart-4))"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {benchmarkComparisonData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS_BENCHMARK[
                                  index % COLORS_BENCHMARK.length
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Quantidade']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 text-center text-sm text-gray-300">
                    <span
                      style={{ color: COLORS_BENCHMARK[0] }}
                      className="font-semibold"
                    >
                      {revenueProjection.summary.openWallets -
                        revenueProjection.summary
                          .benchmarkOutperformedWalletCount}
                    </span>
                    <span> carteiras superaram o Benchmark • </span>
                    <span
                      style={{ color: COLORS_BENCHMARK[1] }}
                      className="font-semibold"
                    >
                      {
                        revenueProjection.summary
                          .benchmarkOutperformedWalletCount
                      }
                    </span>
                    <span> carteiras não superaram o benchmark</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Conteúdo do Perfil de Risco */}
        {activeTab === 'risk' && (
          <div className="w-full">
            {/* Tabela de Análise por Perfil de Risco */}
            <Card className="mb-6 border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Métricas por Perfil de Risco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Perfil de Risco</TableHead>
                        <TableHead className="text-right">Carteiras</TableHead>
                        <TableHead className="text-right">AUM</TableHead>
                        <TableHead className="text-right">Capital Investido</TableHead>
                        <TableHead className="text-right">Receita Total</TableHead>
                        <TableHead className="text-right">Média de Investimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(revenueProjection.byRiskProfile).map(([riskProfile, data]) => {
                        const avgInvestmentData = revenueProjection.averageInvestmentByRiskProfile?.[riskProfile]
                        return (
                          <TableRow key={riskProfile}>
                            <TableCell className="font-medium text-foreground">
                              {riskProfile}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {data.count}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {formatRealCurrency(data.aum)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {formatRealCurrency(data.invested)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {formatRealCurrency(data.revenue)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {avgInvestmentData ? formatRealCurrency(avgInvestmentData.averageInvestment) : '-'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Primeira linha de gráficos - Receita e Média de Investimento */}
            <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Receita por perfil de risco</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(
                          revenueProjection.byRiskProfile,
                        ).map(([name, values]) => ({
                          name,
                          revenue: values.revenue,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="revenueBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-3))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-3))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="url(#revenueBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>
                    Média de investimento por perfil de risco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(
                          revenueProjection.averageInvestmentByRiskProfile ||
                            {},
                        ).map(([name, values]) => ({
                          name,
                          averageInvestment: values.averageInvestment,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="avgInvestmentBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-5))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-5))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="averageInvestment"
                          fill="url(#avgInvestmentBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
            <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Distribuição de AUM por perfil de risco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={aumByRiskprofile}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="barGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-2))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-2))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) =>
                            `${(v / 1_000_000).toFixed(1)}M`
                          }
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="aum"
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Número de carteiras por perfil de risco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(
                          revenueProjection.byRiskProfile,
                        ).map(([name, values]) => ({
                          name,
                          count: values.count,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="countBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) => [v, 'Carteiras']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="count"
                          fill="url(#countBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        )}

        {/* Conteúdo da Análise por Benchmark */}
        {activeTab === 'benchmark' && (
          <div>
            {/* Tabela de Análise por Benchmark */}
            <Card className="mb-6 border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Métricas por Benchmark
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Benchmark</TableHead>
                        <TableHead className="text-right">Carteiras</TableHead>
                        <TableHead className="text-right">AUM</TableHead>
                        <TableHead className="text-right">Capital Investido</TableHead>
                        <TableHead className="text-right">Receita Total</TableHead>
                        <TableHead className="text-right">Média de Investimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(revenueProjection.byBenchmark).map(([benchmark, data]) => {
                        const avgInvestmentData = revenueProjection.averageInvestmentByBenchmark?.[benchmark]
                        return (
                          <TableRow key={benchmark}>
                            <TableCell className="font-medium text-foreground">
                              {benchmark}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {data.count}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {formatRealCurrency(data.aum)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {formatRealCurrency(data.invested)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {formatRealCurrency(data.revenue)}
                            </TableCell>
                            <TableCell className="text-right text-foreground">
                              {avgInvestmentData ? formatRealCurrency(avgInvestmentData.averageInvestment) : '-'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Primeira linha de gráficos - Receita e Média de Investimento */}
            <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Receita por benchmark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(revenueProjection.byBenchmark).map(
                          ([name, values]) => ({
                            name,
                            revenue: values.revenue,
                          }),
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="benchmarkRevenueBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-3))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-3))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="url(#benchmarkRevenueBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Média de investimento por benchmark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(
                          revenueProjection.averageInvestmentByBenchmark || {},
                        ).map(([name, values]) => ({
                          name,
                          averageInvestment: values.averageInvestment,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="benchmarkAvgInvestmentBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-5))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-5))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="averageInvestment"
                          fill="url(#benchmarkAvgInvestmentBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
            <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Distribuição de AUM por benchmark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={aumByBenchmark}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="benchmarkBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-2))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-2))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tickFormatter={(v) =>
                            `${(v / 1_000_000).toFixed(1)}M`
                          }
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) =>
                            v.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          }
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="aum"
                          fill="url(#benchmarkBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Número de carteiras por benchmark
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(revenueProjection.byBenchmark).map(
                          ([name, values]) => ({
                            name,
                            count: values.count,
                          }),
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="benchmarkCountBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--chart-1))"
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip
                          formatter={(v: number) => [v, 'Carteiras']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--popover-foreground))',
                          }}
                          labelStyle={{ color: 'hsl(var(--chart-1))' }}
                        />
                        <Bar
                          dataKey="count"
                          fill="url(#benchmarkCountBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
