import { useState } from 'react'
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
import { RotateCcw } from 'lucide-react'
import { preparePerformanceData } from './utils/prepareWalletsPerformanceComparison'
import { prepareBenchmarkComparisonData } from './utils/prepareBenchmarkComparison'
import { prepareRevenueGeneratingData } from './utils/prepareRevenueGeneratingData'
import { getAUMByRiskProfile } from './utils/getAUMByRiskprofile'
import { getAUMByBenchmark } from './utils/getAUMByBenchmark'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
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
import { useDashboardData } from '@/hooks/useDashboardData'
import { Button } from '@/components/ui/button'

// Sistema de cores padronizado para gráficos
const CHART_COLORS = {
  REVENUE: 'hsl(var(--chart-3))', // Verde - para gráficos de receita
  INVESTMENT: 'hsl(var(--chart-1))', // Azul - para gráficos de média de investimento
  AUM: 'hsl(var(--chart-2))', // Laranja - para gráficos de AUM
  COUNT: 'hsl(var(--chart-5))', // Roxo - para gráficos de contagem
  SPECIAL: 'hsl(var(--chart-4))', // Rosa - para casos especiais
  // Cores para pie charts (overview)
  PIE_PERFORMANCE: ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'], // Verde, Vermelho
  PIE_BENCHMARK: ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'], // Verde, Vermelho  
  PIE_REVENUE: ['hsl(var(--chart-2))', 'hsl(var(--chart-3))'], // Verde, Vermelho
}

export default function Dashboard() {
  const {
    performanceSummary,
    assetAllocation,
    riskBreakdown,
    benchmarkAnalysis,
    exchangeBreakdown,
    clientSegmentAnalysis,
    isMainDataLoaded,
    isAllDataLoaded,
    hasMainError,
    isRefreshing,
    retry,
    refresh,
  } = useDashboardData()

  const [activeTab, setActiveTab] = useState('overview')

  // Show loading until main data is loaded
  if (!isMainDataLoaded && !hasMainError) return <Loading />

  // Show error if main data failed to load
  if (hasMainError)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-md mb-4 font-bold text-foreground">
            Erro ao carregar dados do dashboard
          </p>
          <Button onClick={retry} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )

  // Prepare data from new granular endpoints
  const allocationArray = assetAllocation.data ? Object.entries(assetAllocation.data.assets)
    .map(([name, data]) => ({
      name,
      total: data.value,
      percentage: data.percentage,
      walletCount: data.walletCount,
    }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total) : []

  const colors = gerarCores(allocationArray.length)

  // Prepare data structure using new granular endpoints
  const revenueProjection = performanceSummary.data ? {
    summary: {
      openWallets: performanceSummary.data.openWallets,
      successfulWallets: performanceSummary.data.openWallets - 0, // Assumindo que todos são processados com sucesso para compatibilidade
      profitableWallets: performanceSummary.data.profitableWallets,
      totalRevenue: performanceSummary.data.totalRevenue,
      averageRevenue: performanceSummary.data.averageRevenue,
      totalInvestedCapital: performanceSummary.data.totalInvestedCapital,
      totalAUM: performanceSummary.data.totalAUM,
      missingPerformanceHistoryCount: 0, // Calculado internamente, usando 0 para compatibilidade
      walletsLosingMoneyCount: performanceSummary.data.walletsLosingMoneyCount,
      benchmarkOutperformedWalletCount: performanceSummary.data.benchmarkOutperformedWalletCount,
      missingInformationAboutPerformanceOrWallet: 0, // Calculado internamente, usando 0 para compatibilidade
      averageInvestmentGeneral: performanceSummary.data.averageInvestmentGeneral,
      averageGainPerWallet: performanceSummary.data.averageGainPerWallet,
      clientsUnder25k: performanceSummary.data.clientsUnder25k,
    },
    byRiskProfile: riskBreakdown.data?.byRiskProfile || {},
    byBenchmark: benchmarkAnalysis.data?.byBenchmark || {},
    byExchange: exchangeBreakdown.data?.byExchange || {},
    byClientSegment: clientSegmentAnalysis.data?.byClientSegment || {},
    averageInvestmentByRiskProfile: riskBreakdown.data?.averageInvestmentByRiskProfile || {},
    averageInvestmentByBenchmark: benchmarkAnalysis.data?.averageInvestmentByBenchmark || {},
    averageInvestmentByExchange: exchangeBreakdown.data?.averageInvestmentByExchange || {},
    averageInvestmentByClientSegment: clientSegmentAnalysis.data?.averageInvestmentByClientSegment || {},
  } : null

  const aumByRiskprofile = revenueProjection ? getAUMByRiskProfile(revenueProjection) : []
  const aumByBenchmark = revenueProjection ? getAUMByBenchmark(revenueProjection) : []

  // Função para ordenar as faixas de cliente por valor
  const getClientSegmentOrder = (segmentName: string): number => {
    const orderMap: Record<string, number> = {
      'R$ 0 - 25.000': 1,
      'R$ 25.001 - 50.000': 2,
      'R$ 50.001 - 100.000': 3,
      'R$ 100.001 - 200.000': 4,
      'R$ 200.001 - 300.000': 5,
      'R$ 300.001 - 400.000': 6,
      'R$ 400.001 - 500.000': 7,
      'R$ 500.001 - 600.000': 8,
      'R$ 600.001 - 700.000': 9,
      'R$ 700.001 - 800.000': 10,
      'R$ 800.001 - 900.000': 11,
      'R$ 900.001 - 1.000.000': 12,
      'R$ 1.000.000+': 13,
    }
    return orderMap[segmentName] || 999
  }

  // Dados de clientes ordenados por faixa de investimento
  const sortedClientSegmentEntries = revenueProjection 
    ? Object.entries(revenueProjection.byClientSegment || {})
        .sort(([a], [b]) => getClientSegmentOrder(a) - getClientSegmentOrder(b))
    : []

  const sortedClientSegmentChartData = sortedClientSegmentEntries.map(([name, values]) => ({
    name,
    revenue: values.revenue,
    aum: values.aum,
    count: values.count,
  }))

  const sortedClientSegmentAvgInvestmentData = revenueProjection
    ? Object.entries(revenueProjection.averageInvestmentByClientSegment || {})
        .sort(([a], [b]) => getClientSegmentOrder(a) - getClientSegmentOrder(b))
        .map(([name, values]) => ({
          name,
          averageInvestment: values.averageInvestment,
        }))
    : []
  
  const performanceData = revenueProjection ? preparePerformanceData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  ) : []
  
  const benchmarkComparisonData = revenueProjection ? prepareBenchmarkComparisonData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  ) : []
  
  const revenueGeneratingData = revenueProjection ? prepareRevenueGeneratingData(
    revenueProjection, 
    revenueProjection.summary.openWallets
  ) : []

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                Dashboard Financeiro
              </h1>
              {!isAllDataLoaded && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Análise de desempenho de carteiras de investimento
            </p>
          </div>
          <SwitchTheme />
        </div>

        {/* Seção de ações */}
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={refresh} 
            disabled={isRefreshing}
            size="sm"
            className="btn-yellow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isRefreshing ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
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
          <button
            className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'exchange' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('exchange')}
          >
            <span className="hidden sm:inline">Análise por Corretoras</span>
            <span className="sm:hidden">Corretoras</span>
          </button>
          <button
            className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'client' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('client')}
          >
            <span className="hidden sm:inline">Análise por Clientes</span>
            <span className="sm:hidden">Clientes</span>
          </button>
        </div>

        {performanceSummary.data && (
          <p className="text-md mb-4 ml-2 font-bold text-muted-foreground">
            Taxa de qualidade dos dados: {performanceSummary.data.dataQualityRate.toFixed(1)}%
          </p>
        )}

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
                        {performanceSummary.data?.openWallets || '-'}
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
                        Carteiras Gerando Receita
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {performanceSummary.data?.profitableWallets || '-'}
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
                        Média de Investimento por Carteira
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {revenueProjection?.summary.averageInvestmentGeneral 
                          ? formatRealCurrency(revenueProjection.summary.averageInvestmentGeneral)
                          : '-'}
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
                        {formatRealCurrency(revenueProjection?.summary.totalAUM || 0)}
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
                          revenueProjection?.summary.totalInvestedCapital || 0,
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
                          revenueProjection?.summary.totalRevenue || 0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">
                        Média de Ganho por Carteira
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {revenueProjection?.summary.averageGainPerWallet 
                          ? formatRealCurrency(revenueProjection.summary.averageGainPerWallet)
                          : '-'}
                      </p>
                    </div>
                  </div>
                  {/* Tooltip hover */}
                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                    Receita Total ({formatRealCurrency(revenueProjection?.summary.totalRevenue || 0)}) / Número de Carteiras Abertas ({revenueProjection?.summary.openWallets || 0})
                    <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">
                        Clientes com Menos de R$ 25k
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {revenueProjection?.summary.clientsUnder25k || 0}
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                        >
                          {performanceData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CHART_COLORS.PIE_PERFORMANCE[
                                  index % CHART_COLORS.PIE_PERFORMANCE.length
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
                        >
                          {benchmarkComparisonData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CHART_COLORS.PIE_BENCHMARK[
                                  index % CHART_COLORS.PIE_BENCHMARK.length
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
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Carteiras Abertas vs Gerando Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueGeneratingData}
                          cx="50%"
                          cy="35%"
                          labelLine={false}
                          outerRadius={45}
                          fill="hsl(var(--chart-4))"
                          dataKey="value"
                        >
                          {revenueGeneratingData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                CHART_COLORS.PIE_REVENUE[
                                  index % CHART_COLORS.PIE_REVENUE.length
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
                      {Object.entries(revenueProjection?.byRiskProfile || {}).map(([riskProfile, data]) => {
                        const avgInvestmentData = revenueProjection?.averageInvestmentByRiskProfile?.[riskProfile]
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
                          revenueProjection?.byRiskProfile || {},
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
                              stopColor={CHART_COLORS.REVENUE}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.REVENUE}
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
                          revenueProjection?.averageInvestmentByRiskProfile ||
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
                              stopColor={CHART_COLORS.INVESTMENT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.INVESTMENT}
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
                              stopColor={CHART_COLORS.AUM}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.AUM}
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
                          revenueProjection?.byRiskProfile || {},
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
                              stopColor={CHART_COLORS.COUNT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.COUNT}
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
                      {Object.entries(revenueProjection?.byBenchmark || {}).map(([benchmark, data]) => {
                        const avgInvestmentData = revenueProjection?.averageInvestmentByBenchmark?.[benchmark]
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
                        data={Object.entries(revenueProjection?.byBenchmark || {}).map(
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
                              stopColor={CHART_COLORS.REVENUE}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.REVENUE}
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
                          revenueProjection?.averageInvestmentByBenchmark || {},
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
                              stopColor={CHART_COLORS.INVESTMENT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.INVESTMENT}
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
                              stopColor={CHART_COLORS.AUM}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.AUM}
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
                        data={Object.entries(revenueProjection?.byBenchmark || {}).map(
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
                              stopColor={CHART_COLORS.COUNT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.COUNT}
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

        {/* Conteúdo da Análise por Corretoras */}
        {activeTab === 'exchange' && (
          <div>
            {/* Tabela de Análise por Corretoras */}
            <Card className="mb-6 border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Métricas por Corretoras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Corretora</TableHead>
                        <TableHead className="text-right">Carteiras</TableHead>
                        <TableHead className="text-right">AUM</TableHead>
                        <TableHead className="text-right">Capital Investido</TableHead>
                        <TableHead className="text-right">Receita Total</TableHead>
                        <TableHead className="text-right">Média de Investimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(revenueProjection?.byExchange || {}).map(([exchange, data]) => {
                        const avgInvestmentData = revenueProjection?.averageInvestmentByExchange?.[exchange]
                        return (
                          <TableRow key={exchange}>
                            <TableCell className="font-medium text-foreground">
                              {exchange}
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
                    Receita por corretora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(revenueProjection?.byExchange || {}).map(
                          ([name, values]) => ({
                            name,
                            revenue: values.revenue,
                          }),
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="exchangeRevenueBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.REVENUE}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.REVENUE}
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
                          fill="url(#exchangeRevenueBarGradient)"
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
                    Média de investimento por corretora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(
                          revenueProjection?.averageInvestmentByExchange || {},
                        ).map(([name, values]) => ({
                          name,
                          averageInvestment: values.averageInvestment,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="exchangeAvgInvestmentBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.INVESTMENT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.INVESTMENT}
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
                          fill="url(#exchangeAvgInvestmentBarGradient)"
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
                    Distribuição de AUM por corretora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(revenueProjection?.byExchange || {}).map(
                          ([name, values]) => ({
                            name,
                            aum: values.aum,
                          }),
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="exchangeBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.AUM}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.AUM}
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
                          fill="url(#exchangeBarGradient)"
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
                    Número de carteiras por corretora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(revenueProjection?.byExchange || {}).map(
                          ([name, values]) => ({
                            name,
                            count: values.count,
                          }),
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <defs>
                          <linearGradient
                            id="exchangeCountBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.COUNT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.COUNT}
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
                          fill="url(#exchangeCountBarGradient)"
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

        {/* Conteúdo da Análise por Clientes */}
        {activeTab === 'client' && (
          <div>
            {/* Tabela de Análise por Segmento de Cliente */}
            <Card className="mb-6 border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Métricas por Faixa de Investimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">Faixa de Investimento</TableHead>
                        <TableHead className="text-right">Carteiras</TableHead>
                        <TableHead className="text-right">AUM</TableHead>
                        <TableHead className="text-right">Capital Investido</TableHead>
                        <TableHead className="text-right">Receita Total</TableHead>
                        <TableHead className="text-right">Média de Investimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedClientSegmentEntries.map(([clientSegment, data]) => {
                        const avgInvestmentData = revenueProjection?.averageInvestmentByClientSegment?.[clientSegment]
                        return (
                          <TableRow key={clientSegment}>
                            <TableCell className="font-medium text-foreground">
                              {clientSegment}
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
                    Receita por faixa de investimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedClientSegmentChartData.map(item => ({
                          name: item.name,
                          revenue: item.revenue,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      >
                        <defs>
                          <linearGradient
                            id="clientRevenueBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.REVENUE}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.REVENUE}
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
                            fontSize: 10,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
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
                          fill="url(#clientRevenueBarGradient)"
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
                    Média de investimento por faixa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedClientSegmentAvgInvestmentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      >
                        <defs>
                          <linearGradient
                            id="clientAvgInvestmentBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.INVESTMENT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.INVESTMENT}
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
                            fontSize: 10,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
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
                          fill="url(#clientAvgInvestmentBarGradient)"
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
                    Distribuição de AUM por faixa de investimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedClientSegmentChartData.map(item => ({
                          name: item.name,
                          aum: item.aum,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      >
                        <defs>
                          <linearGradient
                            id="clientBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.AUM}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.AUM}
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
                            fontSize: 10,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
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
                          fill="url(#clientBarGradient)"
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
                    Número de carteiras por faixa de investimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={sortedClientSegmentChartData.map(item => ({
                          name: item.name,
                          count: item.count,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                      >
                        <defs>
                          <linearGradient
                            id="clientCountBarGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.COUNT}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.COUNT}
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
                            fontSize: 10,
                          }}
                          tickLine={{ stroke: 'hsl(var(--border))' }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
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
                          fill="url(#clientCountBarGradient)"
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
