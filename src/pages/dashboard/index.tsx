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

// Cores harmônicas com o sistema
const COLORS_PERFORMANCE = ['#10A45C', '#EF4E3D']
const COLORS_BENCHMARK = ['#10A45C', '#EF4E3D']

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
      <p className="text-md flex items-center justify-center font-bold text-white">
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
    <div className="bg-black-700 flex min-h-screen flex-col p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Financeiro</h1>
        <p className="text-gray-200">
          Análise de desempenho de carteiras de investimento
        </p>
      </div>

      {/* Abas de navegação */}
      <div className="mb-6 flex flex-wrap border-b">
        <button
          className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'overview' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="hidden sm:inline">Visão Geral</span>
          <span className="sm:hidden">Visão</span>
        </button>
        <button
          className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'risk' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('risk')}
        >
          <span className="hidden sm:inline">Análise por Perfil de Risco</span>
          <span className="sm:hidden">Risco</span>
        </button>
        <button
          className={`px-2 py-2 text-sm sm:px-4 sm:text-base ${activeTab === 'benchmark' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('benchmark')}
        >
          <span className="hidden sm:inline">Análise por Benchmark</span>
          <span className="sm:hidden">Benchmark</span>
        </button>
      </div>

      <p className="text-md mb-4 ml-2 font-bold text-gray-400">
        Carteiras que não entraram na conta por falta de dados:{' '}
        {revenueProjection.summary.missingInformationAboutPerformanceOrWallet}
      </p>

      {/* Conteúdo da Visão Geral */}
      {activeTab === 'overview' && (
        <div>
          {/* KPIs */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div className="rounded-lg bg-black p-3 text-sm shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 font-semibold text-white">
                    Número de carteiras abertas
                  </p>
                  <p className="text-lg font-bold text-white">
                    {revenueProjection.summary.openWallets}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-black p-3 text-sm shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 font-semibold text-white">AUM Total</p>
                  <p className="text-lg font-bold text-white">
                    {formatRealCurrency(revenueProjection.summary.totalAUM)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-black p-3 text-sm shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2 font-semibold text-white">
                    Total investido
                  </p>
                  <p className="text-lg font-bold text-white">
                    {formatRealCurrency(
                      revenueProjection.summary.totalInvestedCapital,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-black p-3 text-sm shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 font-semibold text-white">Receita Total</p>
                  <p className="text-xs text-white">(fechando todas hoje)</p>
                  <p className="text-lg font-bold text-white">
                    {formatRealCurrency(revenueProjection.summary.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-black p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Alocação por Ativo
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left font-medium">Ativo</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Valor Total
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      % do Total
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Carteiras
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allocationArray.map((asset, index) => (
                    <tr
                      key={asset.name}
                      className="border-b border-gray-800 hover:bg-gray-900/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          {asset.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatDolarCurrency(asset.total)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {asset.percentage.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        {asset.walletCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Comparação Lucro x Prejuízo
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="35%"
                      labelLine={false}
                      outerRadius={45}
                      fill="#8884d8"
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
            </div>

            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Comparação com Benchmarks
              </h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={benchmarkComparisonData}
                      cx="50%"
                      cy="35%"
                      labelLine={false}
                      outerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {benchmarkComparisonData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS_BENCHMARK[index % COLORS_BENCHMARK.length]
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
                    revenueProjection.summary.benchmarkOutperformedWalletCount}
                </span>
                <span> carteiras superaram o Benchmark • </span>
                <span
                  style={{ color: COLORS_BENCHMARK[1] }}
                  className="font-semibold"
                >
                  {revenueProjection.summary.benchmarkOutperformedWalletCount}
                </span>
                <span> carteiras não superaram o benchmark</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo do Perfil de Risco */}
      {activeTab === 'risk' && (
        <div className="w-full">
          {/* Primeira linha de gráficos - Receita e Média de Investimento */}
          <div className="mb-6 grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Receita por perfil de risco
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.byRiskProfile).map(([name, values]) => ({
                      name,
                      revenue: values.revenue
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4E3D" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#EF4E3D" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#revenueBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Média de investimento por perfil de risco
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.averageInvestmentByRiskProfile || {}).map(([name, values]) => ({
                      name,
                      averageInvestment: values.averageInvestment
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="avgInvestmentBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="averageInvestment" 
                      fill="url(#avgInvestmentBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
          <div className="mb-6 grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Distribuição de AUM por perfil de risco
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={aumByRiskprofile}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10A45C" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#10A45C" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="aum" 
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Número de carteiras por perfil de risco
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.byRiskProfile).map(([name, values]) => ({
                      name,
                      count: values.count
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="countBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F2BE38" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#F2BE38" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) => [v, 'Carteiras']}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#countBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Conteúdo da Análise por Benchmark */}
      {activeTab === 'benchmark' && (
        <div>
          {/* Primeira linha de gráficos - Receita e Média de Investimento */}
          <div className="mb-6 grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Receita por benchmark
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.byBenchmark).map(([name, values]) => ({
                      name,
                      revenue: values.revenue
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="benchmarkRevenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4E3D" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#EF4E3D" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#benchmarkRevenueBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Média de investimento por benchmark
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.averageInvestmentByBenchmark || {}).map(([name, values]) => ({
                      name,
                      averageInvestment: values.averageInvestment
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="benchmarkAvgInvestmentBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="averageInvestment" 
                      fill="url(#benchmarkAvgInvestmentBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Segunda linha de gráficos - AUM e Número de Carteiras */}
          <div className="mb-6 grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Distribuição de AUM por benchmark
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={aumByBenchmark}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="benchmarkBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10A45C" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#10A45C" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="aum" 
                      fill="url(#benchmarkBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Número de carteiras por benchmark
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(revenueProjection.byBenchmark).map(([name, values]) => ({
                      name,
                      count: values.count
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <defs>
                      <linearGradient id="benchmarkCountBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F2BE38" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#F2BE38" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#374151" 
                      opacity={0.3}
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickLine={{ stroke: '#374151' }}
                      axisLine={{ stroke: '#374151' }}
                    />
                    <Tooltip
                      formatter={(v: number) => [v, 'Carteiras']}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      labelStyle={{ color: '#F2BE38' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#benchmarkCountBarGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
