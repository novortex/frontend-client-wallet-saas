import { HistoricEntry } from '@/types/wallet.type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { downloadPdf } from '@/services/managementService'
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Play,
  Pause,
  Download
} from 'lucide-react'

interface HistoryCompactCardProps {
  entry: HistoricEntry
  fiatCurrency: string
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(value)
}

const formatPercentage = (value: number | undefined) => {
  if (value === undefined || value === null) return '0.00%'
  return `${value.toFixed(2)}%`
}

export default function HistoryCompactCard({ entry, fiatCurrency }: HistoryCompactCardProps) {
  const { historyType, data } = entry

  const handleDownloadPdf = async () => {
    const formatNumber = (value: number | string | null | undefined): string => {
      if (value === null || value === undefined) return '0.00'
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? '0.00' : num.toFixed(2)
    }

    await downloadPdf(
      data.client_name,
      data.start_date,
      data.start_date_formated,
      data.close_date,
      data.close_date_formated,
      formatNumber(data.invested_amount_in_organization_fiat),
      data.benchmark,
      formatNumber(data.wallet_performance_fee),
      formatNumber(data.company_commission),
      formatNumber(data.total_commission),
      formatNumber(data.dollar_value),
      formatNumber(data.benchmark_price_start),
      formatNumber(data.benchmark_price_end),
      formatNumber(data.benchmark_performance),
      formatNumber(data.benchmark_value),
      formatNumber(data.close_wallet_value_in_organization_fiat),
      formatNumber(data.total_wallet_profit_percent),
      formatNumber(data.benchmark_exceeded_value),
      data.assets?.map((asset) => ({
        name: asset.name,
        allocation: asset.allocation !== null && asset.allocation !== undefined
          ? parseFloat(asset.allocation.toFixed(2))
          : 0,
      })) || [],
    )
  }

  const renderOperationDetails = () => {
    switch (historyType) {
      case 'BUY_ASSET':
      case 'SELL_ASSET':
        const isBuy = historyType === 'BUY_ASSET'
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.icon && (
                <img src={data.icon} alt={data.asset} className="w-8 h-8 rounded-full border border-border" />
              )}
              <div>
                <p className="font-medium text-foreground">{data.asset}</p>
                <p className="text-sm text-muted-foreground">
                  {isBuy ? 'Compra' : 'Venda'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2">
                {isBuy ? (
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {data.before} → {data.after}
                  </p>
                  <p className="text-xs text-muted-foreground">{data.asset}</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'INCREASE_ALLOCATION':
      case 'DECREASE_ALLOCATION':
        const isIncrease = historyType === 'INCREASE_ALLOCATION'
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.icon && (
                <img src={data.icon} alt={data.asset} className="w-8 h-8 rounded-full border border-border" />
              )}
              <div>
                <p className="font-medium text-foreground">{data.asset}</p>
                <p className="text-sm text-muted-foreground">
                  {isIncrease ? 'Aumento de' : 'Redução de'} alocação
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {formatPercentage(data.before)} → {formatPercentage(data.after)}
                  </p>
                  <p className="text-xs text-muted-foreground">Alocação</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ADD_ASSET':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.icon && (
                <img src={data.icon} alt={data.asset} className="w-8 h-8 rounded-full border border-border" />
              )}
              <div>
                <p className="font-medium text-foreground">{data.asset}</p>
                <p className="text-sm text-muted-foreground">Ativo adicionado</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  +{data.quantity} {data.asset}
                </Badge>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Alocação: {formatPercentage(data.target_allocation)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'DELETE_ASSET':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.icon && (
                <img src={data.icon} alt={data.asset} className="w-8 h-8 rounded-full opacity-50" />
              )}
              <div>
                <p className="font-medium text-foreground line-through">{data.asset}</p>
                <p className="text-sm text-muted-foreground">Ativo removido</p>
              </div>
            </div>
            
            <Badge variant="secondary">
              Removido
            </Badge>
          </div>
        )

      case 'DEPOSIT':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Depósito</p>
                <p className="text-sm text-muted-foreground">
                  Data efetiva: {new Date(data.data).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                +{formatCurrency(data.deposit_amount_in_organization_fiat, fiatCurrency)}
              </p>
            </div>
          </div>
        )

      case 'WITHDRAWAL':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Saque</p>
                <p className="text-sm text-muted-foreground">
                  Data efetiva: {new Date(data.data).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                -{formatCurrency(data.withdrawal_value_in_organization_fiat, fiatCurrency)}
              </p>
            </div>
          </div>
        )

      case 'START_WALLET':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Carteira Iniciada</p>
                <p className="text-sm text-muted-foreground">
                  Data de início: {new Date(data.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(data.invested_amount_in_organization_fiat, fiatCurrency)}
              </p>
              <p className="text-xs text-muted-foreground">Valor inicial</p>
            </div>
          </div>
        )

      case 'CLOSE_WALLET':
        const profit = data.close_wallet_value_in_organization_fiat - data.invested_amount_in_organization_fiat
        const profitPercentage = data.total_wallet_profit_percent
        
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Pause className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Carteira Fechada</p>
                  <p className="text-sm text-muted-foreground">
                    Data de fechamento: {new Date(data.close_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(data.close_wallet_value_in_organization_fiat, fiatCurrency)}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit, fiatCurrency)} ({formatPercentage(profitPercentage)})
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                size="sm"
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 bg-[#FF4A3A] text-black hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Baixar PDF
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-muted-foreground">
            Operação não identificada
          </div>
        )
    }
  }

  return (
    <div>
      {renderOperationDetails()}
    </div>
  )
}