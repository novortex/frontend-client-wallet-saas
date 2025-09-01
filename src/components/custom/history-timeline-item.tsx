import { HistoricEntry } from '@/types/wallet.type'
import HistoryCompactCard from './history-compact-card'
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  ShoppingCart, 
  DollarSign,
  Play,
  Pause
} from 'lucide-react'

interface HistoryTimelineItemProps {
  entry: HistoricEntry
  fiatCurrency: string
}

const getOperationIcon = (operationType: string) => {
  switch (operationType) {
    case 'BUY_ASSET':
      return <ShoppingCart className="h-4 w-4 text-green-500" />
    case 'SELL_ASSET':
      return <DollarSign className="h-4 w-4 text-red-500" />
    case 'INCREASE_ALLOCATION':
      return <TrendingUp className="h-4 w-4 text-blue-500" />
    case 'DECREASE_ALLOCATION':
      return <TrendingDown className="h-4 w-4 text-orange-500" />
    case 'ADD_ASSET':
      return <Plus className="h-4 w-4 text-green-600" />
    case 'DELETE_ASSET':
      return <Minus className="h-4 w-4 text-red-600" />
    case 'DEPOSIT':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />
    case 'WITHDRAWAL':
      return <TrendingDown className="h-4 w-4 text-rose-500" />
    case 'START_WALLET':
      return <Play className="h-4 w-4 text-green-500" />
    case 'CLOSE_WALLET':
      return <Pause className="h-4 w-4 text-red-500" />
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }
}

const getOperationColor = (operationType: string) => {
  switch (operationType) {
    case 'BUY_ASSET':
    case 'ADD_ASSET':
    case 'DEPOSIT':
    case 'START_WALLET':
    case 'INCREASE_ALLOCATION':
      return 'border-l-green-500'
    case 'SELL_ASSET':
    case 'DELETE_ASSET':
    case 'WITHDRAWAL':
    case 'CLOSE_WALLET':
    case 'DECREASE_ALLOCATION':
      return 'border-l-red-500'
    default:
      return 'border-l-gray-400'
  }
}

export default function HistoryTimelineItem({ entry, fiatCurrency }: HistoryTimelineItemProps) {
  const time = new Date(entry.createAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="relative flex items-start">
      <div className="absolute left-4 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center">
        {getOperationIcon(entry.historyType)}
      </div>
      
      <div className="ml-12 w-full">
        <div className={`border-l-4 ${getOperationColor(entry.historyType)} bg-card rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-lg hover:scale-[1.02] hover:border-l-6 transition-all duration-300 cursor-pointer`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {entry.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {time}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {entry.historyType.replace('_', ' ').toLowerCase()}
            </div>
          </div>
          
          <HistoryCompactCard 
            entry={entry} 
            fiatCurrency={fiatCurrency}
          />
        </div>
      </div>
    </div>
  )
}