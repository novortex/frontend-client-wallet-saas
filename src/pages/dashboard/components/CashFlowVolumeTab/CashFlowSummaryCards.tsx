import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CashFlowSummary, VolumeSummary, Currency } from '@/types/cashFlowVolume.type'
import { formatRealCurrency } from '@/utils/formatRealCurrency'
import { formatDolarCurrency } from '@/utils/formatDolarCurrency'

interface CashFlowSummaryCardsProps {
  cashFlowSummary: CashFlowSummary
  volumeSummary: VolumeSummary
  currency: Currency
}

export function CashFlowSummaryCards({ 
  cashFlowSummary, 
  volumeSummary,
  currency 
}: CashFlowSummaryCardsProps) {
  const formatCurrency = currency === 'BRL' ? formatRealCurrency : formatDolarCurrency
  const volumeValue = currency === 'BRL' ? volumeSummary.totalVolumeValueBRL : volumeSummary.totalVolumeValueUSD
  
  const cards = [
    {
      title: 'Total de Entradas',
      value: formatRealCurrency(cashFlowSummary.totalDeposits), // Cash flow sempre em BRL
      color: 'text-green-600',
    },
    {
      title: 'Total de Saídas', 
      value: formatRealCurrency(cashFlowSummary.totalWithdrawals), // Cash flow sempre em BRL
      color: 'text-red-600',
    },
    {
      title: 'Fluxo Líquido',
      value: formatRealCurrency(cashFlowSummary.totalNetFlow), // Cash flow sempre em BRL
      color: cashFlowSummary.totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: `Volume Total Crypto (${currency})`,
      value: formatCurrency(volumeValue),
      color: 'text-blue-600',
    },
    {
      title: 'Transações Crypto',
      value: volumeSummary.totalTransactions.toString(),
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}