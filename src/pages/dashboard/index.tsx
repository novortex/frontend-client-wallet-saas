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
import { getWalletsByBenchmark } from './utils/getWalletsByBenchmark'
import { getWalletsByRiskProfile } from './utils/getWalletsByRiskprofile'
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

const COLORS_PERFORMANCE = ['#32CD32', '#B22222']

const COLORS_BARCHART = [
  '#800000', // vermelho muito escuro
  '#8B0000',
  '#A52A2A',
  '#B22222',
  '#DC143C',
  '#E74C3C',
  '#FF6347',
  '#FFA07A', // laranja claro
  '#FFD700', // amarelo forte (neutro/limite)
  '#ADFF2F', // amarelo esverdeado
  '#7CFC00',
  '#32CD32',
  '#2E8B57',
  '#228B22',
  '#006400', // verde escuro
]

export default function Dashboard() {
  const [allocationByAsset, setAllocationByAsset] = useState<AllocationByAsset>(
    {},
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

  const walletsByBenchmark = getWalletsByBenchmark(revenueProjection)
  const walletsByRiskprofile = getWalletsByRiskProfile(revenueProjection)
  const aumByRiskprofile = getAUMByRiskProfile(revenueProjection)
  const aumByBenchmark = getAUMByBenchmark(revenueProjection)
  const allocationArray = Object.entries(allocationByAsset)
    .map(([name, total]) => ({ name, total }))
    .filter(({ total }) => total > 0)
    .sort((a, b) => b.total - a.total)

  const performanceData = preparePerformanceData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  )
  const benchmarkComparisonData = prepareBenchmarkComparisonData(
    revenueProjection,
    revenueProjection.summary.openWallets,
  )

  return (
    <div className="bg-black-700 flex min-h-screen flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Financeiro</h1>
        <p className="text-gray-200">
          Análise de desempenho de carteiras de investimento
        </p>
      </div>

      {/* Abas de navegação */}
      <div className="mb-6 flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'risk' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('risk')}
        >
          Análise por Perfil de Risco
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'benchmark' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-white'}`}
          onClick={() => setActiveTab('benchmark')}
        >
          Análise por Benchmark
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
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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

          {/* Gráficos principais */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold">
                Contagem de carteiras por benchmark
              </h2>
              <ResponsiveContainer width="100%" height="95%">
                {/* Mudando para BarChart layout="vertical" */}
                <BarChart
                  layout="vertical"
                  data={walletsByBenchmark}
                  margin={{ top: 16, right: 10, left: 10, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* Invertendo os eixos X e Y */}
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Contagem de carteiras por perfil de risco
              </h2>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={walletsByRiskprofile}
                  margin={{ top: 16, right: 30, left: 0, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-black p-4 shadow">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Alocação por ativo (Escala Log)
            </h2>
            <ResponsiveContainer width="100%" height={1200}>
              <BarChart
                layout="vertical"
                data={allocationArray}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  scale="log"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$ ${formatRealCurrency(value)}`}
                />
                <YAxis dataKey="name" type="category" width={110} />
                <Tooltip
                  formatter={(value: number) =>
                    `$ ${formatRealCurrency(value)}`
                  }
                />
                <Legend />
                <Bar dataKey="total" fill="#8884d8">
                  {allocationArray.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_BARCHART[index % COLORS_BARCHART.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around gap-4">
            <div className="rounded-lg bg-black p-4 shadow">
              <div className="h-64">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Comparação Lucro x Prejuízo
                </h2>
                <ResponsiveContainer width={700} height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={60}
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
            </div>

            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Comparação com Benchmarks
              </h2>
              <div className="h-64">
                <ResponsiveContainer width={700} height="100%">
                  <PieChart>
                    <Pie
                      data={benchmarkComparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
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
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo do Perfil de Risco */}
      {activeTab === 'risk' && (
        <div className="w-full">
          <div className="mb-6 flex flex-wrap gap-4">
            {Object.entries(revenueProjection.byRiskProfile).map(
              ([riskProfile, values]) => (
                <div
                  key={riskProfile}
                  className="w-[180px] rounded-lg bg-black p-3 text-sm shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 font-semibold text-white">
                        {riskProfile}
                      </p>
                      <p className="text-xs text-white">RECEITA</p>
                      <p className="text-lg font-bold text-white">
                        {formatRealCurrency(values.revenue)}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
          {/* Primeiro Gráfico */}
          <div className="mb-6 grid w-full grid-cols-1 gap-6">
            <div className="w-full rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Distribuição de AUM por perfil de risco
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={aumByRiskprofile}
                    margin={{ top: 16, right: 30, left: 20, bottom: 16 }} // aumenta o espaço esquerdo
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      formatter={(v: number) =>
                        v.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      }
                    />
                    <Bar dataKey="aum" fill="#8884d8" />
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
          <div className="mb-6 flex flex-wrap gap-4">
            {Object.entries(revenueProjection.byBenchmark).map(
              ([benchmark, values]) => (
                <div
                  key={benchmark}
                  className="w-[180px] rounded-lg bg-black p-3 text-sm shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 font-semibold text-white">
                        {benchmark}
                      </p>
                      <p className="text-xs text-white">RECEITA</p>
                      <p className="text-lg font-bold text-white">
                        {formatRealCurrency(values.revenue)}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold">
                Distribuição de AUM por benchmark
              </h2>
              <ResponsiveContainer width="100%" height="95%">
                <BarChart
                  layout="vertical"
                  data={aumByBenchmark}
                  margin={{ top: 16, right: 10, left: 10, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="aum" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
