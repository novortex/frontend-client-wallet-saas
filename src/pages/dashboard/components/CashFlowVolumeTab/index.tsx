import { useState } from 'react'
import { subMonths, subDays, subWeeks } from 'date-fns'
import { Loading } from '@/components/custom/loading'
import { useCashFlowVolumeData } from '@/hooks/useCashFlowVolumeData'
import { PeriodType, DateRange, Currency } from '@/types/cashFlowVolume.type'
import { PeriodSelector } from './PeriodSelector'
import { CurrencySelector } from './CurrencySelector'
import { CashFlowSummaryCards } from './CashFlowSummaryCards'
import { CashFlowChart } from './CashFlowChart'
import { VolumeDistribution } from './VolumeDistribution'

export function CashFlowVolumeTab() {
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [currency, setCurrency] = useState<Currency>('BRL')
  
  // Get default date range based on period
  const getDefaultDateRange = (selectedPeriod: PeriodType): DateRange => {
    const endDate = new Date()
    const startDate = new Date()

    switch (selectedPeriod) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 30) // Last 30 days
        break
      case 'weekly':
        startDate.setDate(startDate.getDate() - 84) // Last 12 weeks
        break
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 12) // Last 12 months
        break
      case 'quarterly':
        startDate.setMonth(startDate.getMonth() - 24) // Last 8 quarters
        break
    }

    return { startDate, endDate }
  }

  const [dateRange] = useState<DateRange>(() => getDefaultDateRange(period))

  const {
    cashFlowData,
    volumeData,
    cashFlowSummary,
    volumeSummary,
    loading,
    error,
    refresh,
  } = useCashFlowVolumeData(period, dateRange)

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod)
    // dateRange will be recalculated in the hook based on the new period
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Use o botão de atualizar geral para tentar novamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cash Flow & Volume</h2>
          <p className="text-muted-foreground">
            Análise de fluxo de caixa e volume de criptomoedas
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <PeriodSelector value={period} onChange={handlePeriodChange} />
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
      </div>

      {/* Summary Cards */}
      <CashFlowSummaryCards
        cashFlowSummary={cashFlowSummary}
        volumeSummary={volumeSummary}
        currency={currency}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CashFlowChart data={cashFlowData} period={period} />
        <VolumeDistribution data={volumeData} period={period} currency={currency} />
      </div>

      {/* Empty state */}
      {!loading && cashFlowData.length === 0 && volumeData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Nenhum dado encontrado para o período selecionado
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tente selecionar um período diferente ou aguarde novos dados
          </p>
        </div>
      )}
    </div>
  )
}