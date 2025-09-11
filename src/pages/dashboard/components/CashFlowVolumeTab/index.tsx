// Funcionalidade temporariamente comentada devido a problemas de visualização em produção
// TODO: Restaurar quando a padronização de dados estiver concluída

/*
import { useState } from 'react'
import { Loading } from '@/components/custom/loading'
import { useCashFlowVolumeData } from '@/hooks/useCashFlowVolumeData'
import { PeriodType, DateRange, Currency } from '@/types/cashFlowVolume.type'
import { PeriodSelector } from './PeriodSelector'
import { CurrencySelector } from './CurrencySelector'
import { CashFlowSummaryCards } from './CashFlowSummaryCards'
import { CashFlowChart } from './CashFlowChart'
import { VolumeDistribution } from './VolumeDistribution'
*/

export function CashFlowVolumeTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
      {/* Ícone de desenvolvimento */}
      <div className="flex items-center justify-center w-24 h-24 bg-muted/50 rounded-full">
        <svg 
          className="w-12 h-12 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      </div>

      {/* Mensagem principal */}
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">
          Cash Flow & Volume
        </h2>
        <div className="space-y-2">
          <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
            🚧 Funcionalidade em Desenvolvimento
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Esta seção está sendo aprimorada para oferecer uma melhor experiência de visualização dos dados. 
            Nossa equipe está trabalhando na padronização e otimização dos gráficos.
          </p>
        </div>
      </div>

      {/* Informação adicional */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 max-w-sm text-center">
        <p className="text-xs text-muted-foreground">
          Em breve você terá acesso a análises detalhadas de fluxo de caixa e volume de criptomoedas
        </p>
      </div>
    </div>
  )
}

/*
Código original comentado para restauração futura:

export function CashFlowVolumeTab() {
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [currency, setCurrency] = useState<Currency>('BRL')
  
  const getDefaultDateRange = (selectedPeriod: PeriodType): DateRange => {
    const endDate = new Date()
    const startDate = new Date()

    switch (selectedPeriod) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 30)
        break
      case 'weekly':
        startDate.setDate(startDate.getDate() - 84)
        break
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 12)
        break
      case 'quarterly':
        startDate.setMonth(startDate.getMonth() - 24)
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
  } = useCashFlowVolumeData(period, dateRange)

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod)
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

      <CashFlowSummaryCards
        cashFlowSummary={cashFlowSummary}
        volumeSummary={volumeSummary}
        currency={currency}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CashFlowChart data={cashFlowData} period={period} />
        <VolumeDistribution data={volumeData} period={period} currency={currency} />
      </div>

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
*/