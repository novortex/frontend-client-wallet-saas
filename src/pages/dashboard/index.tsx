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
import { getTotalWallets } from './utils/getTotalWallets'
import { preparePerformanceData } from './utils/prepareWalletsPerformanceComparison'
import { prepareBenchmarkComparisonData } from './utils/prepareBenchmarkComparison'
import { getWalletsByBenchmark } from './utils/getWalletsByBenchmark'
import { getWalletsByRiskProfile } from './utils/getWalletsByRiskprofile'
import { getAUMByRiskProfile } from './utils/getAUMByRiskprofile'
import { getAUMByBenchmark } from './utils/getAUMByBenchmark'
import { prepareAUMByAssets } from './utils/getAUMByAsset'
import { getAssetsByProfile } from './utils/getAssetsByRiskprofile'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { RevenueProjectionDashboardData } from '@/types/revenueProjectionDashboardData.type'
import { Portifolio } from '@/types/response.type'
import {
  getAllAssetsOrg,
  getRevenueProjection,
} from '@/services/managementService'

const COLORS_PERFORMANCE = ['#32CD32', '#B22222']

export default function Dashboard() {
  const [assetsDetailsData, setAssetsDetailsData] = useState<Portifolio>([])
  const [revenueProjection, setRevenueProjection] =
    useState<RevenueProjectionDashboardData>()

  const fetchDashboardData = async () => {
    try {
      const [assetsDetailResponse, revenueProjectionResponse] =
        await Promise.all([getAllAssetsOrg(), getRevenueProjection()])

      setAssetsDetailsData(assetsDetailResponse)
      setRevenueProjection(revenueProjectionResponse)
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const [activeTab, setActiveTab] = useState('overview')

  if (!revenueProjection) return <p>Carregando dados...</p>

  const totalWallets = getTotalWallets(revenueProjection)
  const walletsByBenchmark = getWalletsByBenchmark(revenueProjection)
  const walletsByRiskprofile = getWalletsByRiskProfile(revenueProjection)
  const aumByRiskprofile = getAUMByRiskProfile(revenueProjection)
  const aumByBenchmark = getAUMByBenchmark(revenueProjection)
  const assetsDetails = prepareAUMByAssets(assetsDetailsData)
  const assetsByRiskprofile = getAssetsByProfile(assetsDetailsData)

  const performanceData = preparePerformanceData(
    revenueProjection,
    totalWallets,
  )
  const benchmarkComparisonData = prepareBenchmarkComparisonData(
    revenueProjection,
    totalWallets,
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
        Missing wallets by missing data:{' '}
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
                  <p className="text-lg font-bold text-white">{totalWallets}</p>
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
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-black p-4 shadow">
                <h2 className="mb-4 text-lg font-semibold">
                  Contagem de carteiras por benchmark
                </h2>
                <ResponsiveContainer width="100%" height="90%">
                  {/* Mudando para BarChart layout="vertical" */}
                  <BarChart
                    layout="vertical"
                    data={walletsByBenchmark}
                    margin={{ top: 16, right: 30, left: 50, bottom: 16 }}
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
            <h2 className="mb-4 text-lg font-semibold">Alocação por ativo</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                layout="vertical"
                data={assetsDetails}
                margin={{ top: 20, right: 30, left: 120, bottom: 10 }}
              >
                {/* Invertendo os eixos X e Y */}
                <XAxis
                  type="number"
                  tickFormatter={(value) =>
                    `$ ${value.toLocaleString('pt-BR')}`
                  }
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  interval={0}
                />
                <Tooltip
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="total" fill="#8884d8">
                  {assetsDetails.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS_PERFORMANCE[index % COLORS_PERFORMANCE.length]
                      }
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
                <ResponsiveContainer width={600} height="100%">
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
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-black p-4 shadow">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Distribuição de AUM por Benchmark
              </h2>
              <div className="h-96">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={aumByBenchmark}
                    margin={{ top: 16, right: 30, left: 120, bottom: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* Invertendo os eixos X e Y */}
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <YAxis dataKey="name" type="category" width={110} />
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
    </div>
  )
}
